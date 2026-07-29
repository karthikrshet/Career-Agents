"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, GitBranch, Mail, Eye, EyeOff, Loader2, Shield, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGuestMode = () => {
    setProfile({
      id: generateId(),
      name: "Guest User",
      email: "guest@careeros.dev",
      targetRole: "Software Engineer",
      targetCompany: "FAANG",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    toast.success("Welcome! You're in guest mode. Your progress saves locally.");
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Email is required"); return; }
    setLoading(true);
    
    try {
      const res = await signIn("credentials", {
        email,
        name: name || email.split("@")[0],
        redirect: false
      });
      
      if (res?.error) {
        toast.error(res.error || "Authentication failed");
        setLoading(false);
        return;
      }
      
      setProfile({
        id: generateId(),
        name: name || email.split("@")[0],
        email,
        targetRole: "Software Engineer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success(`Welcome to Career Agents${name ? `, ${name}` : ""}!`);
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong during login");
    } finally {
      setLoading(false);
    }
  };

  const FEATURES = [
    "146 specialized AI career agents",
    "Real ATS resume analysis engine",
    "Live GitHub portfolio scoring",
    "AI-powered mock interviews",
    "Smart job application tracker",
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — Hero */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-sky-500/5 via-background to-indigo-500/5 border-r border-border">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-glow-sky">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">Career Agents</span>
            <span className="ml-2 text-xs text-muted-foreground">v2.0</span>
          </div>
        </div>

        {/* Main pitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold leading-tight">
            Your AI-Powered
            <br />
            <span className="text-gradient">Career Intelligence</span>
            <br />
            Platform
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Analyze resumes, audit GitHub, optimize LinkedIn, and crush interviews — all in one place with 146 specialized agents.
          </p>

          <div className="space-y-3 mt-8">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Star className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-sm text-muted-foreground">{feat}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats */}
        <div className="flex items-center gap-8 text-sm text-muted-foreground">
          <div><span className="text-foreground font-semibold">146</span> AI Agents</div>
          <div><span className="text-foreground font-semibold">12+</span> Modules</div>
          <div><span className="text-foreground font-semibold">100%</span> Local First</div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Career Agents</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {mode === "signin"
                ? "Sign in to continue to your Career Agents dashboard."
                : "Join Career Agents and start building your dream career."}
            </p>
          </div>

          {/* Auth form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "signin" && (
                <button type="button" className="text-xs text-primary hover:underline float-right mt-1">
                  Forgot password?
                </button>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-3">or continue with</span>
            </div>
          </div>

          {/* OAuth + Guest */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => toast.info("OAuth requires GitHub client ID in .env — use Guest Mode for now")}
              id="btn-github-oauth"
            >
              <GitBranch className="w-4 h-4" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => toast.info("OAuth requires Google client ID in .env — use Guest Mode for now")}
              id="btn-google-oauth"
            >
              <Mail className="w-4 h-4" />
              Continue with Google
            </Button>

            <div className="pt-1">
              <Button
                variant="ghost"
                className="w-full gap-2 border border-dashed border-border hover:border-primary/40 hover:bg-primary/5"
                onClick={handleGuestMode}
                id="btn-guest-mode"
              >
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Continue as Guest</span>
                <span className="text-xs text-muted-foreground/60 ml-1">(saves locally)</span>
              </Button>
            </div>
          </div>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
