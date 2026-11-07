"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

export default function AskPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [review, setReview] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");

  function addTag() {
    const value = tag.trim().toLowerCase();
    if (!value) return;
    if (tags.includes(value)) {
      setTag("");
      return;
    }
    if (tags.length === 5) return;
    setTags([...tags, value]);
    setTag("");
  }

  async function postQuestion() {
    if (!user) return;
    setPosting(true);
    setError("");
    try {
      await axiosInstance.post("/question/ask", {
        postquestiondata: {
          questionTitle: title.trim(),
          questionBody: details.trim(),
          questionTags: tags,
          userpoted: user.name,
          userID: user._id,
        },
      });
      setPosted(true);
      toast.success("Question posted successfully");
    } catch {
      setError("Could not post your question. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl text-[#232629]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}>
      <h1 className="mb-6 text-2xl">Ask a question</h1>

      {posted ? (
        <div className="rounded-md border border-gray-200 p-6">
          <h2 className="mb-3 text-lg">Your question has been posted.</h2>
          <Link href="/" className="text-sm text-[#0074CC] hover:underline">Back to home</Link>
        </div>
      ) : review ? (
        <section className="space-y-5 rounded-md border border-gray-200 p-5">
          <h2 className="text-xl">Review your question</h2>
          <h3 className="break-words text-lg font-semibold">{title}</h3>
          <div className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-gray-50 p-4 text-sm leading-6">{details}</div>
          <div className="flex flex-wrap gap-2">
            {tags.map((item) => <span key={item} className="rounded-sm bg-[#e3ecf3] px-2 py-1 text-xs text-[#39739D]">{item}</span>)}
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {!user && <p className="text-sm"><Link href="/auth" className="text-[#0074CC] hover:underline">Log in</Link> to post your question.</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={posting} onClick={() => setReview(false)} className="rounded border border-gray-300 px-4 py-2 text-sm">Edit question</button>
            <button type="button" disabled={posting || !user} onClick={postQuestion} className="rounded bg-[#1A75CF] px-4 py-2 text-sm text-white hover:bg-[#11589e] disabled:opacity-50">
              {posting ? "Posting..." : "Post your question"}
            </button>
          </div>
        </section>
      ) : (
        <form className="space-y-5" onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim() || !details.trim() || tags.length === 0) {
            setError("Add a title, question details, and at least one tag.");
            return;
          }
          if (tag.trim()) {
            setError("Press Enter to add your tag, or clear the tag field before reviewing.");
            return;
          }
          setError("");
          setReview(true);
        }}>
          <div className="rounded-md border border-gray-200 p-5">
            <label htmlFor="question-title" className="block font-semibold">Title</label>
            <p className="mt-1 mb-3 text-xs text-gray-500">Be specific and imagine you&apos;re asking a question to another person.</p>
            <input id="question-title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. How do I update state in React?" className="w-full rounded border border-gray-300 p-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="rounded-md border border-gray-200 p-5">
            <label htmlFor="question-details" className="block font-semibold">What are the details of your question?</label>
            <p className="mt-1 mb-3 text-xs text-gray-500">Explain the problem, what you tried, and include any relevant code.</p>
            <textarea id="question-details" required rows={12} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Write your question and paste your code here..." className="w-full rounded border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="rounded-md border border-gray-200 p-5">
            <label htmlFor="question-tags" className="block font-semibold">Tags</label>
            <p className="mt-1 mb-3 text-xs text-gray-500">Type a tag and press Enter to add it. Add up to 5 tags.</p>
            <input id="question-tags" value={tag} disabled={tags.length === 5} onChange={(event) => setTag(event.target.value)} onKeyDown={(event) => {
              if (event.key === "Enter") { event.preventDefault(); addTag(); }
            }} placeholder={tags.length === 5 ? "5 tags added" : "e.g. reactjs"} className="w-full rounded border border-gray-300 p-2 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50" />
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((item) => (
                <button key={item} type="button" aria-label={`Remove ${item}`} onClick={() => setTags(tags.filter((value) => value !== item))} className="rounded-sm bg-[#e3ecf3] px-2 py-1 text-xs text-[#39739D]">{item} ×</button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">{tags.length}/5 tags</p>
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded bg-[#1A75CF] px-4 py-3 text-sm text-white hover:bg-[#11589e]">Review your question</button>
        </form>
      )}
    </div>
  );
}
