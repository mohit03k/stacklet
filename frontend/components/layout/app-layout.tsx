"use client";
import { usePathname } from "next/navigation";
import { LeftSidebar } from "./Left-sidebar";
import { Navbar } from "./Navbar";
import { RightSidebar } from "./Right-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/auth") return <>{children}</>;
  if (pathname === "/signup") return <>{children}</>;

  return (
    <div className="min-h-screen"
    >
      <Navbar />

      <div className="mx-auto flex max-w-8xl">
        <LeftSidebar />
        <main className="min-w-0 flex-1 px-6 py-6">
          {children}
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}

