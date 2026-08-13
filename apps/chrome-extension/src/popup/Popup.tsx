import { useEffect, useState } from "react";
import { Settings, LayoutDashboard, Monitor } from "lucide-react";
import { getPreferences } from "../storage";

export function Popup() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [serverUrl, setServerUrl] = useState("http://localhost:3000");

  useEffect(() => {
    getPreferences().then((prefs) => {
      const url = prefs.workspaceUrl || "http://localhost:3000";
      setServerUrl(url);
      checkHealth(url);
    });
  }, []);

  const checkHealth = async (url: string) => {
    try {
      const res = await fetch(`${url}/api/system/health`);
      if (res.ok) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    } catch {
      setConnected(false);
    }
  };

  const handleOpenPanel = () => {
    chrome.windows.getCurrent((win) => {
      if (win.id !== undefined) {
        chrome.sidePanel.open({ windowId: win.id });
        window.close();
      }
    });
  };

  const handleGoDashboard = () => {
    chrome.tabs.create({ url: `${serverUrl}/dashboard` });
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-[320px] p-5 bg-[#070d1f] text-[#f1f5f9] flex flex-col gap-4 font-sans select-none">
      <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
        <h2 className="text-base font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Career Agents
        </h2>
        <div className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-blue-500/20">
          <span className={`w-2 h-2 rounded-full ${
            connected === true ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : 
            connected === false ? "bg-red-400 shadow-[0_0_8px_#ef4444]" : "bg-gray-400"
          }`} />
          <span>{connected === true ? "Connected" : connected === false ? "Offline" : "Checking..."}</span>
        </div>
      </div>

      <div className="bg-[#0d162f]/65 border border-blue-500/20 rounded-xl p-3.5 backdrop-blur-md">
        <h4 className="text-xs font-semibold mb-1 text-[#f1f5f9]">Browser Integration Active</h4>
        <p className="text-[10px] text-[#94a3b8] leading-relaxed">
          Navigate to LinkedIn, GitHub, Greenhouse, or Lever to run match analysis or auto-fill form applications.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleOpenPanel}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all transform active:scale-[0.98]"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Open Workspace Panel</span>
        </button>
        <button
          onClick={handleGoDashboard}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-white/5 border border-blue-500/20 hover:bg-white/10 text-white transition-all"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
          <span>Go to Web Dashboard</span>
        </button>
        <button
          onClick={handleOpenOptions}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-white/5 border border-blue-500/20 hover:bg-white/10 text-white transition-all"
        >
          <Settings className="w-3.5 h-3.5 text-blue-400" />
          <span>Extension Preferences</span>
        </button>
      </div>

      <div className="text-[9px] text-center text-[#94a3b8]">
        Career Agents Enterprise v11.1.0
      </div>
    </div>
  );
}
