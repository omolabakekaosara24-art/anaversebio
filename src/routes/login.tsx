import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { SignInGate, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { upsertProfile, getHallState } from "@/lib/cbt/actions";
import { getDeviceId } from "@/lib/cbt/device";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: search.role === "tutor" ? ("tutor" as const) : ("student" as const),
  }),
  component: LoginPage,
});

function LoginPage() {
  const { role } = Route.useSearch();
  return (
    <main className="min-h-dvh bg-navy px-5 py-8 text-paper sm:px-8">
      <div className="mx-auto flex max-w-md flex-col">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="text-gold-soft hover:text-gold">
            <BrandMark compact />
          </Link>
          <UserButton />
        </div>
        <div className="rounded-xl border border-gold/25 bg-paper p-6 text-ink sm:p-8">
          <p className="text-xs font-semibold tracking-[0.28em] text-gold-deep uppercase">
            {role === "tutor" ? "Tutor desk" : "Student entrance"}
          </p>
          <h1 className="mt-2 font-display text-3xl text-navy">
            {role === "tutor" ? "Sign in to the class board" : "Candidate registration"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {role === "tutor"
              ? "Use your name and Gmail. After signing in you will enter the tutor code."
              : "Enter your full name and Gmail. This sitting can be taken once on this device."}
          </p>
          <SignInGate fallback={<AuthForm role={role} />}>
            <ProfileForm role={role} />
          </SignInGate>
        </div>
      </div>
    </main>
  );
}

function AuthForm({ role }: { role: "student" | "tutor" }) {
  const [mode, setMode] = useState<"register" | "return">("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "register") {
        const { error: err } = await authClient.signUp.email({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        });
        if (err) throw new Error(err.message ?? "Could not register.");
        await authClient.getSession();
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
        });
        if (err) throw new Error(err.message ?? "Could not sign in.");
        await authClient.getSession();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 space-y-5">
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
              minLength={2}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="As it should appear on the result"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Gmail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Access password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <p className="text-xs text-muted">
            Keeps your result private if you return later.
          </p>
        </div>
        {error && <p className="text-sm text-wrong">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy} variant="navy">
          {busy ? "Please wait…" : mode === "register" ? "Register and continue" : "Sign in"}
        </Button>
      </form>

      <button
        type="button"
        className="text-sm text-ink-soft underline-offset-4 hover:underline"
        onClick={() => setMode(mode === "register" ? "return" : "register")}
      >
        {mode === "register" ? "Already registered? Sign in" : "New candidate? Register"}
      </button>

      {authEnabled && (
        <div className="space-y-2 border-t border-line pt-4">
          <p className="text-xs tracking-[0.2em] text-muted uppercase">Or continue with</p>
          {GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              variant="ghost"
              className="w-full border-navy/20 text-navy hover:bg-paper-2"
              onClick={() =>
                signIn(p.providerId, {
                  callbackURL: `/login?role=${role}`,
                })
              }
            >
              Continue with {p.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileForm({ role }: { role: "student" | "tutor" }) {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName((name) => name || user.displayName || "");
    setEmail((mail) => mail || user.primaryEmail || "");
    void getHallState({ data: { deviceId: getDeviceId() } })
      .then((state) => {
        if (!state.profile) return;
        return navigate({ to: role === "tutor" ? "/tutor" : "/exam" });
      })
      .catch(() => {
        /* stay on the form if hall state is unavailable */
      });
  }, [user, role, navigate]);

  if (isPending) {
    return <div className="mt-6 h-40 animate-pulse rounded-md bg-paper-2" />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await upsertProfile({
        data: { fullName: fullName.trim(), email: email.trim().toLowerCase() },
      });
      await navigate({ to: role === "tutor" ? "/tutor" : "/exam" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save details.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="candidateName">Full name</Label>
        <Input
          id="candidateName"
          required
          minLength={2}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="candidateEmail">Gmail</Label>
        <Input
          id="candidateEmail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-wrong">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy} variant="navy">
        {busy ? "Saving…" : role === "tutor" ? "Continue to tutor desk" : "Continue to the paper"}
      </Button>
    </form>
  );
}
