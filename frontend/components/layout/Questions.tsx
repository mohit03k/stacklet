"use client"
import { ChevronDown, ListFilter } from "lucide-react"
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";

const DefaultFilter = ["Newest", "Active", "Bountied", "Unanswered", "More"]

interface Question {
  _id: string;
  questionTitle: string;
  questionBody: string;
  questionTags?: string[];
  numberOfAnswer?: number;
  upvote?: string[];
  downvote?: string[];
  userpoted?: string;
  askedon?: string;
}

function QuestionCard({ question }: { question: Question }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 px-2 py-4 sm:flex-row sm:gap-3">
      {/* Left: Question stats */}
      <div className="flex shrink-0 items-center gap-3 text-xs sm:w-20 sm:flex-col sm:items-end sm:gap-1 sm:pt-1">
        <span className="text-gray-900">
          {(question.upvote?.length ?? 0) - (question.downvote?.length ?? 0)} votes
        </span>

        <span
          className={
            (question.numberOfAnswer ?? 0) > 0
              ? "rounded-sm border border-green-700 px-1.5 py-0.5 text-green-700"
              : "text-gray-500"
          }
        >
          {question.numberOfAnswer ?? 0} answers
        </span>

      </div>

      {/* Right: Question details */}
      <div className="min-w-0 flex-1">
        <h3
          onClick={() => {
            router.push(`/questions/${question._id}`)
          }}
          className="mb-1 cursor-pointer break-words text-base leading-6 text-[#0074CC] hover:text-[#0A95FF]">
          {question.questionTitle}
        </h3>

        <p className="mb-2 line-clamp-2 break-words text-[13px] leading-5 text-gray-700">
          {question.questionBody}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {(question.questionTags ?? []).map((tag) => (
              <span
                key={tag}
                className="max-w-full cursor-pointer break-all rounded-sm bg-[#E3ECF3] px-1.5 py-0.5 text-xs text-[#39739D] hover:bg-[#D0E3F1]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* User information */}
          <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-xs">
            {question.userpoted && (
              <span className="text-[#0074CC]">{question.userpoted}</span>
            )}
            {question.askedon && (
              <span className="text-gray-500">
                asked {new Date(question.askedon).toLocaleDateString("en-US", { timeZone: "UTC" })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const QuestionsNav = ({ title }: { title?: string }) => {
  const pathname = usePathname();
  return <div className="flex flex-wrap justify-between gap-3 px-2 py-4 items-center"
    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}
  >
    <div className="text-2xl">
      {pathname === "/" ? "Newest Questions" : title}
    </div>
    <div>
      <Link href="/ask" className="inline-block bg-[#1A75CF] text-white p-3 border rounded-sm text-xs cursor-pointer hover:bg-[#11589e]">Ask question</Link>
    </div>
  </div>
}

export function FiltersNav({ count = 0 }: { count?: number }) {
  return <div className="flex flex-wrap justify-between gap-3 px-2 py-4 items-center"
    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}
  >
    <div>
      {count.toLocaleString()} questions
    </div>

    <div className="flex items-center">
      <ul className="flex gap-2 text-[13px] cursor-pointer border rounded-sm border-gray-300 p-1">
        {
          DefaultFilter.map((f, i) => {
            return f == "More" ? (
              <li key={i} className="hover:bg-gray-100 p-1 px-2 rounded-sm flex items-center">
                {f}<ChevronDown size="12" className="ml-1 mt-1" />
              </li>
            ) : f == "Newest" ? (
              <li key={i} className="bg-gray-300 p-1 px-2 rounded-sm" >
                {f}
              </li>
            ) : (
              < li key={i} className="hover:bg-gray-100 px-2 p-1 rounded-sm" >
                {f}
              </li>
            )
          })
        }
      </ul>
      <div className="ml-4">
        <button className="p-2 px-3 flex items-center border border-blue-600 rounded-sm text-[13px] text-blue-700 cursor-pointer hover:bg-blue-100">
          <ListFilter size="15" />Filter</button>
      </div>
    </div>
  </div >
}

export const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get<{ data: Question[] }>("/question/getallquestion");
        if (active) setQuestions(res.data.data);
      } catch {
        if (active) setError("Could not load questions. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchQuestions();
    return () => { active = false; };
  }, []);

  return (
    <div className="w-full"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif',
      }}
    >
      <QuestionsNav />
      <FiltersNav count={questions.length} />
      <hr className="border-gray-300" />
      <div>
        {loading && <p className="p-6 text-center text-sm text-gray-500">Loading questions...</p>}
        {error && <p role="alert" className="p-6 text-center text-sm text-red-600">{error}</p>}
        {!loading && !error && questions.length === 0 && <p className="p-6 text-center text-sm text-gray-500">No questions found.</p>}
        {questions.map((question) => (
          <QuestionCard
            key={question._id}
            question={question}
          />
        ))}
      </div>
    </div>
  )

}
