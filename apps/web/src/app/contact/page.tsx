"use client";

import { useState } from "react";
import { ArrowLeft, Mail, MessageSquare, Shield, HelpCircle, Send, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", type: "General Inquiries", msg: "" });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.msg) {
      toast.error("Please fill out all required fields.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSubmitted(true);
      toast.success("Message transmitted successfully. We will reach out shortly.");
      setSending(false);
    }, 800);
  };

  const channels = [
    { icon: HelpCircle, label: "General Support", email: "support@career-agents.com" },
    { icon: MessageSquare, label: "Enterprise & Cohorts", email: "enterprise@career-agents.com" },
    { icon: Shield, label: "Security & Bug Bounty", email: "security@career-agents.com" },
    { icon: Mail, label: "Open Source Maintainers", email: "maintainers@career-agents.com" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans py-20 px-4 sm:px-6 lg:px-8 relative overflow-y-auto z-10">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-sky-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Direct Support &amp; Partnerships
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Get in <span className="text-sky-400">Touch</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            Need enterprise deployment support, security inquiries, custom MCP tool integrations, or help contributing? We respond within 24 hours.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#070b14] border border-white/10 space-y-6">
            <h2 className="text-base font-bold text-white">Send a Direct Message</h2>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Message Transmitted</h3>
                <p className="text-xs text-slate-300">
                  Thank you! Our engineering team will review your inquiry and follow up at {formData.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Inquiry Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="General Inquiries" className="bg-[#070b14]">General Inquiries</option>
                    <option value="Enterprise & Cohorts" className="bg-[#070b14]">Enterprise &amp; Cohort Licensing</option>
                    <option value="Security Report" className="bg-[#070b14]">Security &amp; Bug Bounty</option>
                    <option value="Open Source Contributing" className="bg-[#070b14]">Open Source Contributing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help your team?"
                    value={formData.msg}
                    onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  size="sm"
                  className="w-full bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs py-2.5 rounded-lg transition-all"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>{sending ? "Transmitting..." : "Send Message"}</span>
                </Button>
              </form>
            )}
          </div>

          {/* Contact Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-base font-bold text-white">Direct Communication Channels</h2>
            <div className="space-y-2.5">
              {channels.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.label}
                    className="p-4 rounded-xl bg-[#070b14] border border-white/10 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Icon className="w-4 h-4 text-sky-400" />
                      <span>{c.label}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 pl-6">
                      {c.email}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
