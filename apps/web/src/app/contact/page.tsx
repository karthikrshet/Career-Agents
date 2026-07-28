// apps/web/src/app/contact/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Mail, MessageSquare, Shield, HelpCircle, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", type: "General Inquiries", msg: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.msg) {
      toast.error("Please fill out all required fields.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Message transmitted successfully. An engineer will reach out shortly.");
      setFormData({ name: "", email: "", type: "General Inquiries", msg: "" });
      setSending(false);
    }, 1200);
  };

  const channels = [
    { icon: HelpCircle, label: "General Support", desc: "candidate-success@career-agents.com" },
    { icon: MessageSquare, label: "Enterprise Sales", desc: "enterprise-licensing@career-agents.com" },
    { icon: Shield, label: "Security & Bug Bounty", desc: "coordinated-disclosure@career-agents.com" },
    { icon: Mail, label: "Developer Partnerships", desc: "maintainers@career-agents.com" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative py-20">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white transition mb-12">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to landing
        </Link>

        <div className="max-w-2xl mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Need enterprise deployments, security reports support, or help contributing? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 border border-slate-900 bg-slate-950/40 p-8 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-6">Transmit Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">Name</label>
                  <Input
                    type="text"
                    placeholder="Candidate Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-semibold text-slate-500">Email Address</label>
                  <Input
                    type="email"
                    placeholder="candidate@work.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-slate-500">Inquiry Channel</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-slate-700"
                >
                  <option>General Inquiries</option>
                  <option>Support Query</option>
                  <option>Enterprise Sales</option>
                  <option>Security & Vulnerability Report</option>
                  <option>Sponsorship & Open Source</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-slate-500">Details</label>
                <textarea
                  rows={5}
                  placeholder="How can our engineering team assist you?"
                  value={formData.msg}
                  onChange={e => setFormData({ ...formData, msg: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-3 text-slate-300 focus:outline-none focus:border-slate-700 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-2.5 rounded-lg"
              >
                {sending ? "Transmitting..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Direct Channels</h3>
              <div className="space-y-4">
                {channels.map(ch => (
                  <div key={ch.label} className="flex gap-3">
                    <ch.icon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-300">{ch.label}</h4>
                      <p className="text-[10px] text-slate-500">{ch.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-900">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Global Operations</h3>
              <div className="space-y-3 text-[10px] text-slate-500">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  San Francisco, CA & Bangalore, IN
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  Mon - Fri · 9:00 AM - 6:00 PM (GMT)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
