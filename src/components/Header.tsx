import React, { useState, useEffect } from "react";
import { Leaf, Info, Sparkles, TrendingDown } from "lucide-react";

const HOLISTIC_TIPS = [
  "Switching to cold water cycles saves about 75-90% of your laundry machine's energy footprint per load.",
  "Replacing just one beef meal a week with a vegetarian alternative saves around 300 kg of CO2e annually.",
  "A single mature tree absorbs roughly 22 kg (48 lbs) of carbon dioxide from the atmosphere each year.",
  "Using public bus transit saves approximately 60% of emissions compared to driving a standard gasoline car solo.",
  "Inflating your vehicle tires to their correct PSI rating can improve gas mileage by up to 3%, cutting tailpipe emissions.",
  "Phantom energy loads ('vampire power') from standby electronics comprise up to 10% of total home electricity utility bills."
];

export default function Header() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % HOLISTIC_TIPS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-emerald-50/40 border-b border-emerald-100/60 py-6 px-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand details */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0 animate-pulse">
            <Leaf className="w-5 h-5 flex items-center justify-center" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-emerald-950 font-sans">
                Carbon Footprint Monitor
              </h1>
              <span className="text-[9px] bg-emerald-600 text-white font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                PRO
              </span>
            </div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              Carbon Intelligence Suite
            </p>
          </div>
        </div>

        {/* Dynamic Tip Ticker */}
        <div className="md:max-w-md w-full bg-white border border-emerald-100 rounded-2xl p-3 flex items-start gap-2.5 shadow-xs">
          <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-0.5">
              <span>Smart Eco-Ticker</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed transition-all duration-500 line-clamp-2">
              &ldquo;{HOLISTIC_TIPS[tipIndex]}&rdquo;
            </p>
          </div>
        </div>

        {/* Streak indicator badge */}
        <div className="flex items-center gap-3 bg-white p-2.5 px-4 rounded-2xl shadow-xs border border-emerald-150/60 shrink-0">
          <div className="text-right">
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Current Streak</div>
            <div className="text-xs font-black text-emerald-600 mt-1">14 Days Sustainable</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 border-2 border-white shadow-sm shrink-0"></div>
        </div>

      </div>
    </header>
  );
}
