"use client";

import Link from "next/link";
import { Bookmark, ChevronDown, ChevronUp, History } from "lucide-react";
import { use, useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";

interface Answer {
  _id: string;
  answerbody?: string;
  useranswer?: string;
  userId?: string;
  answeredOn?: string;
}

interface Question {
  _id: string;
  questionTitle: string;
  questionBody: string;
  questionTags?: string[];
  upvote?: string[];
  downvote?: string[];
  userpoted?: string;
  userID?: string;
  askedon?: string;
  answer?: Answer[];
}

export default function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [voting, setVoting] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState("");

  async function postAnswer() {
    const token = localStorage.getItem("token");
    if (!user || !token) return toast.info("Please log in to post an answer.");
    if (!answerText.trim() || posting) return;
    setPosting(true);
    try {
      const res = await axiosInstance.post<{ data: Question }>(`/answer/postanswer/${id}`, {
        answerbody: answerText.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setQuestion(res.data.data);
      setAnswerText("");
      toast.success("Answer posted");
    } catch (error) {
      const status = (error as { response?: { status: number } } | null)?.response?.status;
      toast.error(status === 401 ? "Please log in again." : "Could not post your answer. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  async function deleteAnswer(answerid: string) {
    const token = localStorage.getItem("token");
    if (!user || !token) return toast.info("Please log in again.");
    if (deleting) return;
    setDeleting(answerid);
    try {
      const config = {
        data: { answerid }, headers: { Authorization: `Bearer ${token}` },
      };
      const res = await axiosInstance.delete<{ data: Question }>(`/answer/delete/${id}`, config);
      setQuestion(res.data.data);
      toast.success("Answer deleted");
    } catch {
      toast.error("Could not delete your answer. Please try again.");
    } finally {
      setDeleting("");
    }
  }

  async function vote(value: "upvote" | "downvote") {
    const token = localStorage.getItem("token");
    if (!user || !token) {
      toast.info("Please log in to vote.");
      return;
    }
    if (voting) return;
    setVoting(true);
    try {
      const res = await axiosInstance.patch<{ data: Question }>(`/question/vote/${id}`, { value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestion(res.data.data);
    } catch (error) {
      const status = (error as { response?: { status: number } } | null)?.response?.status;
      toast.error(status === 401 ? "Please log in again to vote." : "Could not save your vote. Please try again.");
    } finally {
      setVoting(false);
    }
  }

  useEffect(() => {
    let active = true;
    const fetchQuestion = async () => {
      setLoading(true);
      setError("");
      setQuestion(null);
      try {
        const res = await axiosInstance.get<{ data: Question }>(`/question/getquestion/${id}`);
        if (active) setQuestion(res.data.data);
      } catch (error) {
        const status = (error as { response?: { status: number } } | null)?.response?.status;
        if (active) setError(status === 404 ? "No question found" : "Could not load question. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchQuestion();
    return () => { active = false; };
  }, [id]);

  if (loading) return <p className="py-10 text-center text-gray-500">Loading question...</p>;
  if (error || !question) return <div className="flex min-h-64 items-center justify-center p-6 text-lg text-gray-500">{error || "No question found"}</div>;

  const answers = question.answer ?? [];
  const asked = question.askedon ? new Date(question.askedon).toLocaleDateString("en-US", { timeZone: "UTC" }) : "";

  return (
    <div
      className="min-w-0 text-[#232629]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}
    >
      <header className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="min-w-0 flex-1 text-[27px] leading-9 font-normal text-[#3b4045]">
            {question.questionTitle}
          </h1>
          <Link href="/ask" className="shrink-0 cursor-pointer rounded-sm border bg-[#1A75CF] p-3 text-xs text-white hover:bg-[#11589e]">
            Ask question
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
          {asked && <p><span className="mr-1 text-gray-500">Asked</span> {asked}</p>}
        </div>
      </header>

      <article className="flex items-start gap-4 sm:gap-6">
        {/* Question votes */}
        <div className="flex w-12 shrink-0 flex-col items-center gap-3">
          <button type="button" aria-label="Upvote" aria-pressed={question.upvote?.includes(user?._id) ?? false} disabled={voting || posting || Boolean(deleting)} onClick={() => vote("upvote")} className="flex size-12 items-center justify-center rounded-full border border-gray-300 hover:bg-orange-50 aria-pressed:bg-orange-100 aria-pressed:text-orange-600 disabled:opacity-50">
            <ChevronUp size={28} />
          </button>
          <span className="text-xl font-semibold">{(question.upvote?.length ?? 0) - (question.downvote?.length ?? 0)}</span>
          <button type="button" aria-label="Downvote" aria-pressed={question.downvote?.includes(user?._id) ?? false} disabled={voting || posting || Boolean(deleting)} onClick={() => vote("downvote")} className="flex size-12 items-center justify-center rounded-full border border-gray-300 hover:bg-orange-50 aria-pressed:bg-orange-100 aria-pressed:text-orange-600 disabled:opacity-50">
            <ChevronDown size={28} />
          </button>
          <Bookmark size={20} className="mt-1 text-gray-500" aria-label="Bookmark" />
          <History size={20} className="text-gray-500" aria-label="Post history" />
        </div>

        <div className="min-w-0 flex-1">
          <PostBody body={question.questionBody} />

          <div className="mt-7 flex flex-wrap gap-2">
            {(question.questionTags ?? []).map((tag) => (
              <span key={tag} className="rounded-sm bg-[#E3ECF3] px-2 py-1 text-xs text-[#39739D]">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-start justify-between gap-5 text-xs">
            <div className="flex flex-wrap gap-3 text-gray-500">
              <button type="button" className="hover:text-gray-800">Share</button>
              <button type="button" className="hover:text-gray-800">Improve this question</button>
              <button type="button" className="hover:text-gray-800">Follow</button>
            </div>
            <div className="w-52 rounded-sm bg-[#edf5fd] p-2">
              {asked && <p className="mb-2 text-gray-500">asked {asked}</p>}
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-sm bg-[#d0e3f1] text-lg font-bold text-[#39739D]">
                  {question.userpoted?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[#0074CC]">{question.userpoted}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200 py-4 text-[13px] text-gray-500">
            No comments yet.
          </div>
          <div className="">
            <div className="text-xl pb-8 ">
              {answers.length} Answers
            </div>
            <div className="space-y-6">
              {answers.map((answer) => (
                <AnswerCard key={answer._id} answer={answer} canDelete={Boolean(user?._id && user._id === answer.userId)} deleting={deleting === answer._id} disabled={Boolean(deleting) || posting || voting} onDelete={() => deleteAnswer(answer._id)} />
              ))}
            </div>
          </div>
          <hr className="my-8 border-gray-200" />
          <form onSubmit={(event) => { event.preventDefault(); postAnswer(); }}>
            <h2 className="mb-4 text-xl">
              <label htmlFor="your-answer">Your Answer</label>
            </h2>
            <textarea
              id="your-answer"
              name="answer"
              rows={8}
              required
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              disabled={posting}
              placeholder="Write your answer here..."
              className="w-full rounded-sm border border-gray-300 p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            {!user && <p className="mt-2 text-xs text-gray-500"><Link href="/auth" className="text-[#0074CC]">Log in</Link> to post an answer.</p>}
            <button type="submit" disabled={posting || voting || Boolean(deleting) || !answerText.trim() || !user} className="mt-4 rounded-sm bg-[#1A75CF] p-3 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50">
              {posting ? "Posting..." : "Post Your Answer"}
            </button>
          </form>
        </div>
      </article>
    </div>
  );
}

function AnswerCard({ answer, canDelete, deleting, disabled, onDelete }: { answer: Answer; canDelete: boolean; deleting: boolean; disabled: boolean; onDelete: () => void }) {
  return <div className="rounded-md border border-gray-200 p-4">
    <PostBody body={answer.answerbody ?? ""} />
    <div className="mt-6 flex flex-wrap items-end justify-between gap-4 text-xs">
      <div className="flex gap-3 text-gray-500">
        <button type="button" className="hover:text-gray-800">Share</button>
        <button type="button" className="hover:text-gray-800">Flag</button>
        {canDelete && <button type="button" disabled={disabled} onClick={onDelete} className="text-red-600 hover:underline disabled:opacity-50">{deleting ? "Deleting..." : "Delete"}</button>}
      </div>
      <div className="w-48 rounded-sm bg-[#edf5fd] p-2">
        {answer.answeredOn && <p className="mb-2 text-gray-500">answered {new Date(answer.answeredOn).toLocaleDateString("en-US", { timeZone: "UTC" })}</p>}
        <p className="text-[#0074CC]">{answer.useranswer}</p>
      </div>
    </div>
  </div>
}

// Text keeps its line breaks; code inside triple backticks is highlighted.
function PostBody({ body }: { body: string }) {
  const parts = body.split(/(```[^\n]*\n[\s\S]*?```)/g);
  return <div className="space-y-4 text-[15px] leading-7">
    {parts.map((part, i) => part.startsWith("```") ? (
      <CodeBlock key={i} code={part.slice(part.indexOf("\n") + 1, -3)} />
    ) : (
      <p key={i} className="whitespace-pre-wrap break-words">{part}</p>
    ))}
  </div>;
}

// Basic highlighting for comments, strings, keywords and numbers.
function CodeBlock({ code }: { code: string }) {
  const parts = code.split(/(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|from|export|default|function|return|const|let|var|new|async|await|fn|use|if|else|true|false|null|undefined|string|number|boolean)\b|\b\d+\b)/g);

  return (
    <pre className="overflow-x-auto rounded-md bg-[#f6f6f6] p-4 text-[13px] leading-6 text-[#232629]">
      <code>{parts.map((part, i) => {
        // Captured tokens are at odd indexes; the rest is plain code.
        if (i % 2 === 0) return part;

        let color = "text-blue-700";
        if (part.startsWith("//")) color = "text-gray-500";
        else if (/^["'`]/.test(part)) color = "text-green-700";
        else if (/^\d/.test(part)) color = "text-orange-700";

        return <span key={i} className={color}>{part}</span>;
      })}</code>
    </pre>
  );
}
