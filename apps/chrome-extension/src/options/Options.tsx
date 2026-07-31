import React, { useEffect, useState } from "react";
import { getPreferences, savePreferences, StoragePreferences } from "../storage";

export function Options() {
  const [prefs, setPrefs] = useState<Partial<StoragePreferences>>({
    workspaceUrl: "http://localhost:3000",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    workAuth: "authorized"
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getPreferences().then((loaded) => {
      setPrefs((prev) => ({ ...prev, ...loaded }));
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePreferences(prefs).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <div className="w-full max-w-[580px] flex flex-col gap-6 p-10 bg-[#070d1f] text-[#f1f5f9] font-sans">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Extension Preferences
        </h1>
        <p className="text-xs text-[#94a3b8] mt-1">
          Configure local synchronization and auto-fill credentials for job tracking and mock interviews.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] animate-pulse">
          Preferences saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#0d162f]/65 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
        <div className="text-sm font-semibold border-b border-blue-500/20 pb-2 text-blue-400">
          Workspace Configuration
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#94a3b8]">Workspace Server Endpoint URL</label>
          <input
            type="url"
            name="workspaceUrl"
            value={prefs.workspaceUrl}
            onChange={handleChange}
            placeholder="http://localhost:3000"
            required
            className="bg-white/5 border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="text-sm font-semibold border-b border-blue-500/20 pb-2 text-blue-400">
          Auto-Fill Personal Profile
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#94a3b8]">First Name</label>
            <input
              type="text"
              name="firstName"
              value={prefs.firstName}
              onChange={handleChange}
              placeholder="John"
              className="bg-white/5 border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#94a3b8]">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={prefs.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="bg-white/5 border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#94a3b8]">Email Address</label>
            <input
              type="email"
              name="email"
              value={prefs.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              className="bg-white/5 border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#94a3b8]">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={prefs.phone}
              onChange={handleChange}
              placeholder="+1 (555) 019-2834"
              className="bg-white/5 border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#94a3b8]">LinkedIn URL</label>
          <input
            type="url"
            name="linkedin"
            value={prefs.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="bg-white/5 border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#94a3b8]">GitHub Profile URL</label>
          <input
            type="url"
            name="github"
            value={prefs.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
            className="bg-white/5 border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#94a3b8]">Portfolio Website URL</label>
          <input
            type="url"
            name="portfolio"
            value={prefs.portfolio}
            onChange={handleChange}
            placeholder="https://john-doe.dev"
            className="bg-white/5 border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#94a3b8]">Work Authorization Status</label>
          <select
            name="workAuth"
            value={prefs.workAuth}
            onChange={handleChange}
            className="bg-[#070d1f] border border-blue-500/20 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
          >
            <option value="authorized">Authorized to work in USA/Local</option>
            <option value="visa_required">Requires visa sponsorship</option>
            <option value="not_specified">Not Specified</option>
          </select>
        </div>

        <button
          type="submit"
          className="self-end py-2.5 px-6 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all transform active:scale-[0.98] mt-3"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}
