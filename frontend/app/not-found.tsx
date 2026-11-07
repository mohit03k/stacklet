import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-white p-6 text-center text-gray-800">
      <h1 className="text-5xl font-bold">404</h1>
      <h2 className="text-xl">Page not found</h2>
      <p className="text-sm text-gray-500">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-2 rounded-sm bg-[#1A75CF] px-4 py-2 text-sm text-white hover:bg-[#11589e]">
        Back to home
      </Link>
    </div>
  );
}
