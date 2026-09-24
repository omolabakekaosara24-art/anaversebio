import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Shield } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { isPending } = useCurrentUserState();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-navy text-paper">
      <div className="pointer-events-none absolute inset-0 hall-wash" />
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
        <BrandMark compact />
        <div className="min-h-8">
          {isPending ? (
            <div className="h-8 w-28 animate-pulse rounded-sm bg-navy-soft" />
          ) : (
            <UserButton />
          )}
        </div>
      </header>

      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-8 text-center sm:pt-16">
        <div className="mb-8 h-px w-24 bg-gold" />
        <BrandMark className="items-center" />
        <p className="mt-8 max-w-xl font-display text-2xl font-medium leading-snug text-paper sm:text-3xl">
          Welcome to Anaverse CBT — practice smarter, score higher.
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-gold-soft">
          A quiet exam hall for one sitting. Students see only their own result.
          The tutor sees the class board.
        </p>

        <div className="mt-12 grid w-full max-w-xl gap-4 sm:grid-cols-2">
          <Link to="/login" search={{ role: "student" }} className="block">
            <div className="group h-full rounded-xl border border-gold/30 bg-navy-mid p-6 text-left transition-colors duration-200 hover:border-gold">
              <GraduationCap className="size-6 text-gold" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-2xl text-paper">Student entrance</h2>
              <p className="mt-2 text-sm leading-relaxed text-gold-soft">
                Sign in with your name and Gmail. One paper. One sitting. Fifteen minutes.
              </p>
              <div className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-gold font-medium text-navy">
                Enter hall
              </div>
            </div>
          </Link>
          <Link to="/login" search={{ role: "tutor" }} className="block">
            <div className="group h-full rounded-xl border border-gold/20 bg-navy-deep p-6 text-left transition-colors duration-200 hover:border-gold">
              <Shield className="size-6 text-gold" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-2xl text-paper">Tutor desk</h2>
              <p className="mt-2 text-sm leading-relaxed text-gold-soft">
                Open the class board. See every score. Students never see each other.
              </p>
              <div className="mt-6 flex h-12 w-full items-center justify-center rounded-md border border-gold/40 font-medium text-paper">
                Open desk
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
