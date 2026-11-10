import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import auth from '../dist/middleware/auth.js';
import User from '../dist/models/auth.js';
import Question from '../dist/models/question.js';
import { Askquestion, deletequestion, votequestion } from '../dist/controllers/question.js';
import { AskAnswer, deleteanswer } from '../dist/controllers/answers.js';
import { getAllUsers, updateprofile } from '../dist/controllers/auth.js';
import userRoutes from '../dist/routes/auth.js';
import questionRoutes from '../dist/routes/question.js';
import answerRoutes from '../dist/routes/answer.js';

const owner = '507f1f77bcf86cd799439011';
const other = '507f1f77bcf86cd799439012';
const answerid = '507f1f77bcf86cd799439013';
const secret = 'test-secret-only';
const originalSecret = process.env.JWT_SECRET;
before(() => { process.env.JWT_SECRET = secret; });
after(() => {
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

function response() {
  return {
    statusCode: 200, body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

async function protectedRequest(handler, { id = owner, body = {}, userid = owner } = {}) {
  const req = { params: { id }, body, headers: { authorization: `Bearer ${jwt.sign({ id: userid }, secret)}` } };
  const res = response();
  let allowed = false;
  auth(req, res, () => { allowed = true; });
  if (allowed) await handler(req, res);
  return res;
}

test('missing, malformed, invalid, expired and wrong-algorithm tokens return 401', () => {
  const tokens = [undefined, '', 'Basic abc', 'Bearer', 'Bearer invalid',
    `Bearer ${jwt.sign({ id: owner }, 'wrong-secret')}`,
    `Bearer ${jwt.sign({ id: owner }, secret, { expiresIn: -1 })}`,
    `Bearer ${jwt.sign({ id: owner }, secret, { algorithm: 'HS384' })}`,
    `Bearer ${jwt.sign({ id: 'invalid-id' }, secret)}`,
    `Bearer ${jwt.sign({ email: 'test@example.com' }, secret)}`];
  for (const authorization of tokens) {
    const res = response();
    let called = false;
    auth({ headers: { authorization } }, res, () => { called = true; });
    assert.equal(res.statusCode, 401);
    assert.equal(called, false);
    assert(res.body.message);
  }
});

test('valid token sets verified userid and calls next once', () => {
  const req = { headers: { authorization: `Bearer ${jwt.sign({ id: owner }, secret)}` }, body: { userid: other } };
  let count = 0;
  auth(req, response(), () => { count++; });
  assert.equal(req.userid, owner);
  assert.equal(count, 1);
});

test('missing server secret rejects authentication', () => {
  delete process.env.JWT_SECRET;
  try {
    const res = response();
    auth({ headers: { authorization: 'Bearer token' } }, res, () => assert.fail('must not continue'));
    assert.equal(res.statusCode, 500);
  } finally { process.env.JWT_SECRET = secret; }
});

test('all write routes use auth and read/login/signup routes stay public', () => {
  for (const router of [userRoutes, questionRoutes, answerRoutes]) {
    for (const layer of router.stack) {
      const route = layer.route;
      if (!route) continue;
      const publicRoute = route.methods.get || ['/login', '/signup'].includes(route.path);
      assert.equal(route.stack.some(handler => handler.handle === auth), !publicRoute, route.path);
    }
  }
});

test('profile update rejects another user before any database write', async (t) => {
  const write = t.mock.method(User, 'findByIdAndUpdate', () => assert.fail('unauthorized write'));
  const res = await protectedRequest(updateprofile, { id: other, body: { editForm: { name: 'Changed' } } });
  assert.equal(res.statusCode, 403);
  assert.equal(write.mock.callCount(), 0);
});

test('question creation ignores forged authorship, votes and answers', async (t) => {
  t.mock.method(User, 'findById', () => ({ select: async () => ({ name: 'Real Author' }) }));
  t.mock.method(Question.prototype, 'save', async function () { return this; });
  const res = await protectedRequest(Askquestion, { body: { postquestiondata: {
    questionTitle: 'Title', questionBody: 'Body', questionTags: ['react'],
    userID: other, userpoted: 'Fake Author', upvote: [other], answer: [{ answerbody: 'Injected' }],
  } } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.data.userID, owner);
  assert.equal(res.body.data.userpoted, 'Real Author');
  assert.equal(res.body.data.upvote.length, 0);
  assert.equal(res.body.data.answer.length, 0);
});

test('question deletion requires the verified owner in the database filter', async (t) => {
  t.mock.method(Question, 'findOneAndDelete', async filter => {
    assert.deepEqual(filter, { _id: other, userID: owner });
    return null;
  });
  const res = await protectedRequest(deletequestion, { id: other });
  assert.equal(res.statusCode, 403);
});

test('answer posting uses verified identity and actual author name', async (t) => {
  t.mock.method(User, 'findById', id => {
    assert.equal(id, owner);
    return { select: async () => ({ name: 'Real Author' }) };
  });
  t.mock.method(Question, 'findByIdAndUpdate', async (id, update, options) => {
    assert.equal(update.$push.answer.userId, owner);
    assert.equal(update.$push.answer.useranswer, 'Real Author');
    assert.equal(update.$inc.numberOfAnswer, 1);
    assert.equal(options.new, true);
    return { _id: id };
  });
  assert.equal((await protectedRequest(AskAnswer, { body: { answerbody: 'Answer', userid: other, useranswered: 'Fake' } })).statusCode, 200);
});

test('answer deletion cannot spoof ownership through body fields', async (t) => {
  t.mock.method(Question, 'findOneAndUpdate', async (filter, update) => {
    assert.deepEqual(filter.answer.$elemMatch, { _id: answerid, userId: owner });
    assert.deepEqual(update.$pull.answer, { _id: answerid, userId: owner });
    return null;
  });
  assert.equal((await protectedRequest(deleteanswer, { body: { answerid, userid: other } })).statusCode, 403);
});

test('voting uses the identity set by middleware', async (t) => {
  t.mock.method(Question, 'findById', async () => ({ upvote: [], downvote: [] }));
  t.mock.method(Question, 'findByIdAndUpdate', async (id, update) => {
    assert.deepEqual(update.$set.downvote, [owner]);
    assert.deepEqual(update.$set.upvote, []);
    return { _id: id, ...update.$set };
  });
  assert.equal((await protectedRequest(votequestion, { body: { value: 'downvote', userid: other } })).statusCode, 200);
});

test('public users endpoint selects profile fields only', async (t) => {
  t.mock.method(User, 'find', () => ({ select: async fields => {
    assert.equal(fields, 'name about tags joinDate');
    return [];
  } }));
  const res = response();
  await getAllUsers({}, res);
  assert.equal(res.statusCode, 200);
});
