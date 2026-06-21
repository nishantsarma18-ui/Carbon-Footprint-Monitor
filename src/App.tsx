import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import InputsSection from "./components/InputsSection";
import AIAdvisor from "./components/AIAdvisor";
import HistoryLogs from "./components/HistoryLogs";
import Diagnostics from "./components/Diagnostics";

import { FootprintState, SavedLogEntry, FootprintResult } from "./types";
import { DEFAULT_FOOTPRINT, calculateTotalFootprint } from "./utils/carbonFormulas";
import { 
  BarChart3, 
  Sparkles, 
  FolderHeart, 
  Cpu, 
  Globe, 
  Leaf, 
  ArrowRight,
  TrendingDown,
  Info
} from "lucide-react";

export default function App() {
  // Master state parameters
  const [inputs, setInputs] = useState<FootprintState>(() => {
    const saved = localStorage.getItem("ecotracer_inputs");
    return saved ? JSON.parse(saved) : DEFAULT_FOOTPRINT;
  });

  // Checklist / Task custom offset points (subtracted from score)
  const [specialOffset, setSpecialOffset] = useState<number>(0);

  // Active Main tab on the right: "dashboard" | "ai" | "history" | "testing"
  const [activeTab, setActiveTab] = useState<"dashboard" | "ai" | "history" | "testing">("dashboard");

  // Journal Records history
  const [savedLogs, setSavedLogs] = useState<SavedLogEntry[]>(() => {
    const saved = localStorage.getItem("ecotracer_logs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Return a default demo log to make the history look pristine on first visit
    return [
      {
        id: "demo-1",
        timestamp: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), // 30 days ago
        name: "Standard National Baseline",
        inputs: DEFAULT_FOOTPRINT,
        scores: calculateTotalFootprint(DEFAULT_FOOTPRINT)
      }
    ];
  });

  // Persistent syncing
  useEffect(() => {
    localStorage.setItem("ecotracer_inputs", JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    localStorage.setItem("ecotracer_logs", JSON.stringify(savedLogs));
  }, [savedLogs]);

  // Handle live inputs adjustment callback
  const handleInputsChange = (newInputs: FootprintState) => {
    setInputs(newInputs);
  };

  // Calculate scores
  const calculatedScore = calculateTotalFootprint(inputs);
  
  // Apply special ticked offsets
  const finalScore: FootprintResult = {
    ...calculatedScore,
    total: Math.max(0, calculatedScore.total - specialOffset)
  };

  const handleApplySpecialOffset = (offsetAmountKg: number) => {
    setSpecialOffset(prev => prev + offsetAmountKg);
  };

  // Saved Logs controllers
  const handleSaveLog = (name: string) => {
    const newEntry: SavedLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      name,
      inputs: { ...inputs },
      scores: { ...finalScore }
    };
    setSavedLogs(prev => [newEntry, ...prev]);
  };

  const handleLoadLog = (savedInputs: FootprintState) => {
    setInputs({ ...savedInputs });
    setActiveTab("dashboard");
  };

  const handleDeleteLog = (id: string) => {
    setSavedLogs(prev => prev.filter(item => item.id !== id));
  };

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to delete all saved entries in your log list? This action cannot be undone.")) {
      setSavedLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 flex flex-col justify-between">
      
      {/* Visual Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-1">
        
        {/* Bento grid layout: Sliders on left, outputs/tabs on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Sliding configuration panel (Sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-6">
            <div className="bg-emerald-950 text-emerald-50 rounded-[40px] p-6 shadow-md border border-emerald-800/20 space-y-3 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-800/25 rounded-full blur-xl"></div>
              <div className="flex items-center gap-2 text-emerald-300 relative z-10">
                <Leaf className="w-5 h-5 shrink-0 animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-widest font-mono">Simulate Baseline</h2>
              </div>
              <h3 className="text-base font-extrabold font-sans tracking-tight leading-snug relative z-10">
                Adjust Variables to Simulate Dynamic Changes
              </h3>
              <p className="text-xs text-emerald-100/85 leading-relaxed relative z-10 font-medium">
                Sliding transportation, heating fuel index, or changing diet settings updates emission gauges instantly. Click <strong>Checklists</strong> to set active goals.
              </p>
            </div>

            <InputsSection 
              state={inputs} 
              onChange={handleInputsChange} 
            />

            {/* Micro FAQ helper */}
            <div className="bg-white border border-emerald-100/60 rounded-3xl p-5 shadow-sm flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-emerald-950 block leading-none">Standard Metrics CO2e</span>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Values indicate &lsquo;carbon dioxide equivalent&rsquo; integrating methane and nitrous oxide impacts defined by IPC criteria.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Navigation tabs and viewport widgets */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual View-Selection Rail slider */}
            <div className="bg-white border border-emerald-100/60 p-2 rounded-3xl shadow-sm flex flex-wrap gap-1.5">
              {[
                { id: "dashboard", name: "Overview", icon: BarChart3 },
                { id: "ai", name: "AI Checklist", icon: Sparkles },
                { id: "history", name: "Metrics Journal", icon: FolderHeart },
                { id: "testing", name: "Diagnostics Studio", icon: Cpu },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 min-w-[124px] flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs font-bold font-sans transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200" 
                        : "text-slate-500 hover:text-emerald-800 hover:bg-emerald-50/40"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* VIEWPORT AREA: Active Screen Renderer */}
            <div className="transition-all duration-300">
              
              {activeTab === "dashboard" && (
                <div className="animate-fade-in">
                  <Dashboard score={finalScore} inputs={inputs} />
                </div>
              )}

              {activeTab === "ai" && (
                <div className="animate-fade-in">
                  <AIAdvisor 
                    score={calculatedScore} 
                    inputs={inputs} 
                    onApplySpecialOffset={handleApplySpecialOffset}
                  />
                </div>
              )}

              {activeTab === "history" && (
                <div className="animate-fade-in">
                  <HistoryLogs 
                    currentInputs={inputs}
                    currentScore={finalScore}
                    savedLogs={savedLogs}
                    onSaveLog={handleSaveLog}
                    onLoadLog={handleLoadLog}
                    onDeleteLog={handleDeleteLog}
                    onClearLogs={handleClearLogs}
                  />
                </div>
              )}

              {activeTab === "testing" && (
                <div className="animate-fade-in">
                  <Diagnostics />
                </div>
              )}

            </div>

          </div>

        </div>

      </main>

      {/* Persistent Decorative Footer */}
      <footer className="bg-emerald-950 text-emerald-100/60 border-t border-emerald-900 py-6 px-4 text-center mt-12 shrink-0">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-mono">
            &ldquo;We do not inherit the Earth from our ancestors, we borrow it from our children.&rdquo;
          </p>
          <p className="text-[10px] uppercase tracking-widest font-bold">
            Carbon Footprint Monitor &copy; 2026 | Built for Google AI Studio Web Applets
          </p>
        </div>
      </footer>

    </div>
  );
}
