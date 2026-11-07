"use client";

// the navbar for stackoverflow
import { useAuth } from "@/lib/AuthContext";
import { Search, Layers } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { user, Logout } = useAuth();
  return (
    <header
      className="border-t-4 border-t-orange-500 border-b border-b-gray-300 bg-gray-50"
      // font fontFamily copied from stackoverflow
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}
    >
      <nav aria-label="Main navigation" className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center gap-2 px-3 py-2 text-sm text-gray-600 sm:flex-nowrap sm:gap-4">
        <Link href="/" className="flex items-center gap-1 text-xl text-gray-800">
          <Layers className="text-orange-500" size={28} />
          <span>Stack<span className="font-bold">let</span></span>
        </Link>

        <button type="button" className="hidden rounded-full px-3 py-2 hover:bg-gray-200 md:block cursor-pointer">
          About
        </button>
        <button type="button" className="rounded-full px-3 py-2 hover:bg-gray-200 cursor-pointer">
          Products
        </button>

        <div className="relative order-last w-full sm:order-none sm:min-w-0 sm:flex-1">
          <Search size={18} className="pointer-events-none absolute left-3 top-2.5 text-gray-500" />
          <input
            type="search"
            aria-label="Search"
            placeholder="Search..."
            className="h-9 w-full rounded border border-gray-400 bg-white pl-9 pr-3 text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="ml-auto flex shrink-0 gap-2">
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-rows-3 preview-icon">
              <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M21 9H3" /><path d="M21 15H3" /></svg>
          </button>
          {user ? (
            <>
            <div
              role="img"
              aria-label={`${user.name || "User"} profile`}
              title={user.name || "User"}
              className="flex size-9 items-center justify-center rounded-full bg-[#e3ecf3] font-semibold text-[#39739D]"
            >
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <button type="button" onClick={Logout} className="cursor-pointer rounded border border-blue-600 px-3 py-2 text-blue-600 hover:bg-blue-50">
              Log out
            </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="rounded border border-blue-600 px-3 py-2 text-blue-600 hover:bg-blue-50">
                Log in
              </Link>
              <Link href="/signup" className="rounded border border-blue-600 bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
