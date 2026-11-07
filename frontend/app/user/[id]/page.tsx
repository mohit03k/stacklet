"use client";

import { CalendarDays } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";

interface User {
  _id: string;
  name: string;
  about?: string;
  tags?: string[];
  joinDate?: string;
}

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState({ name: "", about: "", tags: [] as string[] });
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  function addTag() {
    const value = tag.trim();
    if (value && !form.tags.includes(value)) {
      setForm({ ...form, tags: [...form.tags, value] });
    }
    setTag("");
  }

  useEffect(() => {
    let active = true;
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      setUser(null);
      try {
        const res = await axiosInstance.get<{ data: User }>(`/user/getuser/${id}`);
        if (active) setUser(res.data.data);
      } catch (error) {
        const status = (error as { response?: { status: number } } | null)?.response?.status;
        if (active) setError(status === 404
          ? "User not found."
          : "Could not load user. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchUser();
    return () => { active = false; };
  }, [id]);

  if (loading) return <p className="py-10 text-center text-gray-500">Loading profile...</p>;
  if (error || !user) return <p className="py-10 text-center text-gray-500">{error || "User not found."}</p>;

  return (
    <div
      className="text-[#232629]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}
    >
      <header className="mb-8 flex flex-wrap items-center gap-5">
        <div className="flex size-32 shrink-0 items-center justify-center rounded-lg bg-[#e3ecf3] text-4xl text-[#39739D] shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="mb-3 text-3xl font-normal sm:text-4xl">{user.name}</h1>
          <div className="min-h-10 text-[13px] text-gray-500">
            {user.joinDate && (
              <span className="flex items-center gap-1">
                <CalendarDays size={17} /> Joined {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}
              </span>
            )}
          </div>
        </div>
        {loggedInUser?._id === user._id && <button type="button" onClick={() => {
          setForm({ name: user.name, about: user.about ?? "", tags: user.tags ?? [] });
          setTag("");
          setSaveError("");
          dialog.current?.showModal();
        }} className="ml-auto self-start rounded-sm border border-gray-300 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
          Edit profile
        </button>}
      </header>

      <div className="grid gap-7 lg:grid-cols-[220px_1fr]">
        <aside>
          <h2 className="mb-3 text-xl">Top Tags</h2>
          <div className="flex min-h-24 flex-wrap content-start gap-2 rounded-md border border-gray-300 p-4">
            {(user.tags ?? []).map((tag) => (
              <span key={tag} className="rounded-sm bg-[#e3ecf3] px-2 py-1 text-xs text-[#39739D]">
                {tag}
              </span>
            ))}
          </div>

          <h2 className="mt-6 mb-3 text-xl">Communities</h2>
          <div className="flex items-center justify-between rounded-md border border-gray-300 p-4 text-sm">
            <span className="text-[#0074CC]">Stacklet</span>
          </div>
        </aside>

        <section className="min-w-0">
          <h2 className="mb-3 text-xl">About</h2>
          <div className="min-h-32 whitespace-pre-wrap text-[15px] leading-7">
            {user.about}
          </div>
        </section>
      </div>

      <dialog ref={dialog} onCancel={(event) => { if (saving) event.preventDefault(); }} className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 text-gray-800 shadow-lg backdrop:bg-black/40">
        <h2 className="mb-5 text-xl">Edit profile</h2>
        <form className="space-y-4" onSubmit={async (event) => {
          event.preventDefault();
          if (!form.name.trim()) return;
          setSaving(true);
          setSaveError("");
          try {
            const res = await axiosInstance.patch<{ data: User }>(`/user/update/${id}`, {
              editForm: { ...form, name: form.name.trim() },
            });
            setUser(res.data.data);
            dialog.current?.close();
          } catch {
            setSaveError("Could not save profile. Please try again.");
          } finally {
            setSaving(false);
          }
        }}>
          <div>
            <label htmlFor="display-name" className="mb-2 block text-sm">Display name</label>
            <input id="display-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded border border-gray-300 p-2 text-sm" />
          </div>
          <div>
            <label htmlFor="about-me" className="mb-2 block text-sm">About me</label>
            <textarea id="about-me" rows={4} value={form.about} onChange={(event) => setForm({ ...form, about: event.target.value })} className="w-full rounded border border-gray-300 p-2 text-sm" />
          </div>
          <div>
            <label htmlFor="skills" className="mb-2 block text-sm">Skills and technology</label>
            <div className="flex gap-2">
              <input id="skills" value={tag} placeholder="Add a tag" onChange={(event) => setTag(event.target.value)} onKeyDown={(event) => {
                if (event.key === "Enter") { event.preventDefault(); addTag(); }
              }} className="min-w-0 flex-1 rounded border border-gray-300 p-2 text-sm" />
              <button type="button" onClick={addTag} aria-label="Add tag" className="rounded bg-[#1A75CF] px-4 text-lg text-white hover:bg-[#11589e]">+</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.tags.map((skill) => (
                <button key={skill} type="button" aria-label={`Remove ${skill}`} onClick={() => setForm({ ...form, tags: form.tags.filter((item) => item !== skill) })} className="rounded-sm bg-[#e3ecf3] px-2 py-1 text-xs text-[#39739D]">
                  {skill} ×
                </button>
              ))}
            </div>
          </div>
          {saveError && <p role="alert" className="text-sm text-red-600">{saveError}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" disabled={saving} onClick={() => dialog.current?.close()} className="rounded border border-gray-300 px-3 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={saving || !form.name.trim()} className="rounded bg-[#1A75CF] px-3 py-2 text-sm text-white disabled:opacity-50">{saving ? "Saving..." : "Save profile"}</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
