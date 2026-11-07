"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";

interface User {
  _id: string;
  name: string;
  tags?: string[];
}

interface GetUsersResponse {
  data: User[];
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get<GetUsersResponse>('/user/getallusers');
        setUsers(res.data.data)
      } catch (e) {
        console.error(e)
        setError("Could not load users. Please try again later.");
      } finally {
        setLoading(false)
      }

    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    )
  }
  if (error) return <p className="mt-4 text-center text-sm text-red-600">{error}</p>;

  if (users.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">No users found.</div>
    );
  }


  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}>
      <h1 className="mb-6 text-2xl font-semibold text-[#3b4045]">Users</h1>

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="pointer-events-none absolute top-2.5 left-3 text-gray-400" />
        <input
          type="search"
          aria-label="Filter by user"
          placeholder="Filter by user"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9 w-full rounded-md border border-gray-200 pr-3 pl-10 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="min-w-0 py-2">
            <div className="flex items-start gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-[#0074CC]"><Link href={`/user/${user._id}`} className="hover:underline">{user.name}</Link></h2>
                <p className="mt-1 text-[11px] text-[#0074CC]">{user.tags?.join(", ")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredUsers.length === 0 && <p className="py-6 text-sm text-gray-500">No users found.</p>}
    </div>
  );
}
