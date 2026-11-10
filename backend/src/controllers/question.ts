import type { Request, Response } from "express";
import question from "../models/question.js";
import mongoose from "mongoose"
import user from "../models/auth.js";

export const Askquestion = async (req: Request, res: Response) => {
  const { questionTitle, questionBody, questionTags } = req.body?.postquestiondata ?? {};
  if (typeof questionTitle !== "string" || !questionTitle.trim() || typeof questionBody !== "string" || !questionBody.trim() || !Array.isArray(questionTags) || questionTags.length < 1 || questionTags.length > 5 || !questionTags.every((tag) => typeof tag === "string" && tag.trim())) {
    return res.status(400).json({ message: "Add a title, details and 1 to 5 tags" });
  }
  try {
    const author = await user.findById(req.userid).select("name");
    if (!author) return res.status(401).json({ message: "Please log in again" });
    const postques = new question({
      questionTitle: questionTitle.trim(), questionBody: questionBody.trim(), questionTags,
      userID: req.userid, userpoted: author.name,
    });
    await postques.save();
    res.status(200).json({ data: postques });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong while adding question");
    return;
  }
};

export const getallquestion = async (req: Request, res: Response) => {
  try {
    const allquestion = await question.find().sort({ askedon: -1 });
    res.status(200).json({ data: allquestion });
  } catch (error) {
    res.status(500).json("something went wrong while getting all questions");
    return;
  }
};

export const getquestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Question not found" });
  }
  try {
    const result = await question.findById(id);
    if (!result) return res.status(404).json({ message: "Question not found" });
    res.status(200).json({ data: result });
  } catch {
    res.status(500).json({ message: "Could not load question" });
  }
};

export const deletequestion = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  if (Array.isArray(_id) || !_id) {
    return res.status(400).json({ message: "Invalid user ID format" }); // only string type is allowed
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    const deleted = await question.findOneAndDelete({ _id, userID: req.userid });
    if (!deleted) return res.status(403).json({ message: "Question not found or you cannot delete it" });
    res.status(200).json({ message: "question deleted" });
  } catch (error) {
    res.status(500).json("something went wrong while deleting questiong");
    return;
  }
}

// one user can only vote one time for one question
export const votequestion = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const { value } = req.body ?? {};
  const userid = req.userid;
  if (value !== "upvote" && value !== "downvote") {
    return res.status(400).json({ message: "Invalid vote" });
  }
  if (Array.isArray(_id) || !_id) {
    return res.status(400).json({ message: "Invalid user ID format" }); // only string type is allowed
  };
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }



  try {
    const ques = await question.findById(_id);
    if (!ques) {
      return res.status(400).json({ message: "question unavailable" })
    }
    const upindex = ques.upvote.findIndex((id) => id === String(userid));

    const downindex = ques.downvote.findIndex((id) => id === String(userid));

    if (value === "upvote") {
      if (downindex !== -1) {
        ques.downvote = ques.downvote.filter((id) => id !== String(userid))
      }
      if (upindex === -1) {
        ques.upvote.push(userid)
      } else {
        ques.upvote = ques.upvote.filter((id) => id !== String(userid))
      }
    } else if (value === "downvote") {
      if (upindex !== -1) {
        ques.upvote = ques.upvote.filter((id) => id !== String(userid))
      }
      if (downindex === -1) {
        ques.downvote.push(userid)
      } else {
        ques.downvote = ques.downvote.filter((id) => id !== String(userid))
      }
    }
    const questionvote = await question.findByIdAndUpdate(_id, {
      $set: { upvote: ques.upvote, downvote: ques.downvote },
    }, { new: true });
    res.status(200).json({ data: questionvote });
  } catch (error) {
    res.status(500).json("something went wrong while voting");
    return;
  }
}


