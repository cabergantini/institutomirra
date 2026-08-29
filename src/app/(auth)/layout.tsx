import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <Link href="/" className="mb-8 text-plum">
        <Logo />
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
