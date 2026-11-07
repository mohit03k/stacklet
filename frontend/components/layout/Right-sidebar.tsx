import { Layers, MessageSquare, Pencil } from "lucide-react"
const hotQuestions = [
  {
    icon: "🗞️",
    title: 'What is the LXX translation of Daniel 9:26 after the words "cut off"?',
  },
  {
    icon: "🥇",
    title: "Esthetically Pleasing On/off Patterns (4×4)",
  },
  {
    icon: "💎",
    title:
      "How to reply to a manager who makes accusations when I have evidence it happened differently?",
  },
  {
    icon: "💥",
    title: "Negative function not evaluating",
  },
];

function OverflowCard() {
  return (
    <div className="w-75 overflow-hidden rounded-sm border border-yellow-300 bg-[#FDF7E7]">
      {/* First section */}
      <div className="p-3">
        <h2 className="pl-2 font-bold">The Overflow Card</h2>

        <ul className="text-[13px]">
          <li className="flex w-full cursor-pointer gap-2 px-2 py-2">
            <Pencil className="mt-1 size-4 shrink-0" fill="black" color="white" />
            <a>
              {"Survey says: You'll swap the model, but everything you build around it is..."}
            </a>
          </li>

          <li className="flex w-full cursor-pointer gap-2 px-2 py-2">
            <Pencil className="mt-1 size-4 shrink-0" fill="black" color="white" />
            <a>{"Rumors of the SaaS demise are greatly exaggerated"}</a>
          </li>
        </ul>
      </div>

      {/* Divider spans the entire card */}
      <div className="border-t border-yellow-300" />

      {/* Second section */}
      <div className="p-3">
        <h2 className="pl-2 font-bold">Featured on Meta</h2>

        <ul className="text-[13px]">
          <li className="flex w-full cursor-pointer gap-2 px-2 py-2">
            <MessageSquare className="mt-1 size-4 shrink-0" color="#46A2D9" />
            <a>
              {"We’ve reworked automatic question deletion. Let’s talk about why"}
            </a>
          </li>

          <li className="flex w-full cursor-pointer gap-2 px-2 py-2">
            <MessageSquare className="mt-1 size-4 shrink-0" color="#46A2D9" />
            <a>{"How can we improve duplicate handling?"}</a>
          </li>
          <li className="flex w-full cursor-pointer gap-2 px-2 py-2">
            <Layers className="mt-1 size-4 shrink-0" color="black" />
            <a>
              {"You're doing it wrong: A plea for sanity in close voting"}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Questions() {
  return (
    <section className="w-full py-3 pl-2 w-75">
      <h2 className="mb-3 text-lg font-normal text-[#3b4045]">
        Hot Network Questions
      </h2>

      <ul className="space-y-2 w-75">
        {hotQuestions.map((question, index) => (
          <li key={index}>
            <a
              href="#"
              className="flex items-start gap-1 text-[13px] leading-[1.35] text-[#1674d1] hover:text-[#0b4f8a]"
            >
              <span className="w-5 shrink-0 pt-0.5 text-sm leading-5">
                {question.icon}
              </span>
              <span>{question.title}</span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#"
        className="mt-3 inline-block pl-6 text-[13px] text-[#1674d1]"
      >
        more hot questions
      </a>
    </section>);
}
export const RightSidebar = () => {
  return (
    <div className="w-120 p-10"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}
    >
      <OverflowCard />
      <Questions />
    </div>
  )
}
