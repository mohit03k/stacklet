import { Bot, BuildingComplex, House, MessageSquareIcon, Newspaper, Tags, UsersRound } from "lucide-react"

export const LeftSidebar = () => {
  return (
    <div className="py-6 text-sm border-r w-64 h-screen"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}
    >
      <ul className="space-y-1 ml-20">
        <li className="flex items-center gap-2 cursor-pointer pl-2 pr-4 py-2 w-full rounded-l-sm hover:bg-gray-200">
          <House className="size-[18px]" />Home
        </li>
        <li className="flex items-center gap-2 cursor-pointer pl-2 pr-4 py-2 w-full rounded-l-sm hover:bg-gray-200">
          <MessageSquareIcon className="size-[18px]" />Questions
        </li>
        <li className="flex items-center gap-2 cursor-pointer pl-2 pr-4 py-2 w-full rounded-l-sm hover:bg-gray-200">
          <Bot className="size-[18px]" />AI Assist
        </li>
        <li className="flex items-center gap-2 cursor-pointer pl-2 pr-4 py-2 w-full rounded-l-sm hover:bg-gray-200">
          <Tags className="size-[18px]" />Tags
        </li>
        <li className="flex items-center gap-2 cursor-pointer pl-2 pr-4 py-2 w-full rounded-l-sm hover:bg-gray-200">
          <Newspaper className="size-[18px]" />Articles
        </li>
        <li className="flex items-center gap-2 cursor-pointer pl-2 pr-4 py-2 w-full rounded-l-sm hover:bg-gray-200">
          <UsersRound className="size-[18px]" />Users
        </li>
        <li className="flex items-center gap-2 cursor-pointer pl-2 pr-4 py-2 w-full rounded-l-sm hover:bg-gray-200">
          <BuildingComplex className="size-[18px]" />Companies
        </li>
      </ul>
    </div>
  )
}
