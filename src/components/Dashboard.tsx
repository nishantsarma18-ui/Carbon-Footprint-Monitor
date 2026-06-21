import React, { useState } from "react";
import { FootprintResult, FootprintState } from "../types";
import { 
  Car, 
  Home, 
  Flame, 
  ShoppingBag, 
  Globe, 
  Trees, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface DashboardProps {
  score: FootprintResult;
  inputs: FootprintState;
}

export default function Dashboard({ score, inputs }: DashboardProps) {
  const [sessionTrees, setSessionTrees] = useState<number>(0);
  const TREE_OFFSET_KG = 22; // annual carbon captured by one mature tree in kg
  
  const originalTotal = score.total;
  const treeOffsetTotal = Math.max(0, originalTotal - (sessionTrees * TREE_OFFSET_KG));
  const displayTons = (treeOffsetTotal / 1000).toFixed(2);
  const originalTons = (originalTotal / 1000).toFixed(2);
  
  // Calculate category percentages
  const getPercent = (value: number) => {
    if (originalTotal === 0) return 0;
    return Math.round((value / originalTotal) * 100);
  };

  const getDialColor = (val: number) => {
    if (val < 2000) return "stroke-emerald-500 text-emerald-600";
    if (val < 4800) return "stroke-lime-500 text-lime-600";
    if (val < 9000) return "stroke-amber-500 text-amber-600";
    return "stroke-red-500 text-red-600";
  };

  // SVG Semi-circular Gauge calculation
  // Radius: 50, Stroke-dasharray: 157 (pi * r) for half circle
  const scoreMax = 16000;
  const scoreClamped = Math.min(scoreMax, treeOffsetTotal);
  const percentageOfMax = scoreClamped / scoreMax;
  const dashOffset = 157 - (percentageOfMax * 157);
  
  // Find primary category emission
  const categories = [
    { title: "Transportation", value: score.transportation, color: "emerald", icon: Car, desc: "Vehicles, flights & public transit" },
    { title: "Household Energy", value: score.energy, color: "amber", icon: Home, desc: "Electricity, heating gas & solar offsets" },
    { title: "Food & Diet", value: score.food, color: "teal", icon: Flame, desc: "Meat frequency & landfill waste overhead" },
    { title: "Consumption & Goods", value: score.consumption, color: "blue", icon: ShoppingBag, desc: "Shopping, electronics & recycling levels" },
  ];

  const highestSector = [...categories].sort((a,b) => b.value - a.value)[0];

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      {/* Prime Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Half-Gauge Meter */}
        <div className="lg:col-span-5 bg-white border border-emerald-100 rounded-[40px] p-6 shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 text-emerald-800 rounded-bl-2xl text-xs font-bold flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Annualised Impact</span>
          </div>

          <div className="mb-2 mt-2">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-widest font-mono">
              Net CO2e Emissions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Your calculated carbon score</p>
          </div>

          {/* SVG Gauge */}
          <div className="relative w-56 h-36 flex items-center justify-center mt-3">
            <svg viewBox="0 0 120 70" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 10,60 A 50,50 0 0,1 110,60"
                fill="none"
                stroke="#f0fdf4"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Colored Indicator Arc */}
              <path
                d="M 10,60 A 50,50 0 0,1 110,60"
                fill="none"
                stroke={treeOffsetTotal < 2000 ? "#059669" : treeOffsetTotal < 4800 ? "#10b981" : treeOffsetTotal < 9000 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="157"
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Value Overlay */}
            <div className="absolute bottom-1 space-y-0.5">
              <span className="block text-3xl font-extrabold tracking-tight text-emerald-950 font-sans">
                {treeOffsetTotal.toLocaleString()}
              </span>
              <span className="block text-[10px] font-bold text-emerald-600 font-mono uppercase tracking-wider">
                kg CO2e / Year
              </span>
              <span className="block text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-100/60 rounded-full py-0.5 px-2.5 mt-1 inline-block">
                {displayTons} Metric Tons
              </span>
            </div>
          </div>

          {/* Environmental Multiplier Info */}
          <div className="w-full border-t border-emerald-50 pt-4 mt-2">
            {treeOffsetTotal <= 2000 ? (
              <div className="flex items-center gap-2 text-emerald-800 text-xs justify-center bg-emerald-50 rounded-2xl p-2 px-3 font-semibold border border-emerald-100">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paris Accords compliant. Excellent footprint!</span>
              </div>
            ) : treeOffsetTotal <= 4800 ? (
              <div className="flex items-center gap-2 text-emerald-700 text-xs justify-center bg-emerald-50/50 rounded-2xl p-2 px-3 font-semibold border border-emerald-100">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Below international average. You&apos;re keeping pace!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-800 text-xs justify-center bg-amber-50/70 border border-amber-100 rounded-2xl p-2 px-3 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Exceeds basic climate target. Tweak sliders to optimize!</span>
              </div>
            )}
          </div>
        </div>

        {/* Global Benchmark Bar chart */}
        <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-[40px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-emerald-950 text-base mb-1 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              Comparative Benchmarks
            </h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed mb-4">
              Rankings compared to global citizens with climate preservation goals.
            </p>
          </div>

          {/* Benchmark Rails */}
          <div className="space-y-4">
            
            {/* Goal Row */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-700">Paris 2030 Climate Goal</span>
                <span className="font-mono text-emerald-600 text-xs">2,000 kg</span>
              </div>
              <div className="h-3.5 w-full bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12.5%" }}></div>
              </div>
            </div>

            {/* Custom Interactive Score */}
            <div className="space-y-1 bg-emerald-50/30 p-3 rounded-2xl border border-emerald-100">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  Your Current Annual Footprint
                  {sessionTrees > 0 && <span className="text-[9px] bg-emerald-600 text-white rounded-md px-1.5 font-mono font-bold uppercase tracking-wider">Offset Active</span>}
                </span>
                <span className={`font-mono font-black text-xs ${treeOffsetTotal < 4800 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {treeOffsetTotal.toLocaleString()} kg
                </span>
              </div>
              <div className="h-3.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200 mt-1">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${treeOffsetTotal < 3500 ? 'bg-emerald-500' : treeOffsetTotal < 7000 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, (treeOffsetTotal / scoreMax) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Global average row */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Global Average Per Person</span>
                <span className="font-mono">4,800 kg</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>

            {/* High Country Row */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Western Country Average (US, CA)</span>
                <span className="font-mono">15,000 kg</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: "93.7%" }}></div>
              </div>
            </div>

          </div>

          {/* Quick Context Summary */}
          <div className="text-[11px] text-slate-500 font-medium leading-relaxed bg-emerald-50/10 p-3 rounded-2xl mt-4 flex items-start gap-2 border border-emerald-100/55">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Your footprint is heavily driven by <strong>{highestSector.title}</strong> ({getPercent(highestSector.value)}% of total). Check variables on slider panel or trigger personalized Gemini recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const pct = getPercent(cat.value);
          let colorTheme = "emerald";
          if (cat.color === "amber") colorTheme = "amber";
          if (cat.color === "teal") colorTheme = "teal";
          if (cat.color === "blue") colorTheme = "blue";
          
          const barColors = {
            emerald: "bg-emerald-500",
            amber: "bg-amber-500",
            teal: "bg-teal-500",
            blue: "bg-blue-500"
          };

          const borderColors = {
            emerald: "border-emerald-100/85 hover:border-emerald-300",
            amber: "border-amber-100/85 hover:border-amber-305",
            teal: "border-teal-100/85 hover:border-teal-305",
            blue: "border-blue-100/85 hover:border-blue-305"
          };

          const iconBackgrounds = {
            emerald: "bg-emerald-50 text-emerald-600",
            amber: "bg-amber-50 text-amber-600",
            teal: "bg-teal-50 text-teal-600",
            blue: "bg-blue-50 text-blue-600"
          };

          return (
            <div 
              key={idx} 
              className={`bg-white border ${borderColors[colorTheme]} rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md hover:shadow-emerald-50 transition-all relative overflow-hidden group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${iconBackgrounds[colorTheme]} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-gray-900 block">
                    {cat.value.toLocaleString()} kg
                  </span>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">
                    CO2e / Yr
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-950 block mb-0.5">
                  {cat.title}
                </span>
                <span className="text-[10px] text-gray-450 block mb-2 leading-tight font-medium">
                  {cat.desc}
                </span>

                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColors[colorTheme]}`} style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-gray-700">
                    {pct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tree Planting Carbon Offset Simulator: HIGH VIBRANCY DARK GREEN VERSION */}
      <div className="bg-emerald-900 text-white rounded-[40px] p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full -mr-16 -mt-16 opacity-40"></div>
        
        <div className="space-y-1.5 md:max-w-xl relative z-10">
          <h4 className="font-extrabold text-white text-base flex items-center gap-2 leading-none">
            <Trees className="w-5 h-5 text-emerald-300 animate-bounce" />
            Tree Planting Carbon Offset Simulator
          </h4>
          <p className="text-xs text-emerald-100 font-medium leading-relaxed">
            Planted mature trees capture around <strong>{TREE_OFFSET_KG} kg</strong> of carbon per year. Use this simulated toggle to offset environmental baseline totals in the active metrics journal instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-800/60 border border-emerald-75/50 p-3 rounded-2xl shrink-0 relative z-10">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest font-mono">Trees Planted</span>
            <div className="flex items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() => setSessionTrees(prev => Math.max(0, prev - 1))}
                className="w-8 h-8 rounded-xl bg-emerald-700/80 text-white font-bold text-lg flex items-center justify-center hover:bg-emerald-600 transition-colors"
                title="Decrease simulated tree plantings"
              >
                &minus;
              </button>
              <span className="text-lg font-black text-white w-8 text-center">{sessionTrees}</span>
              <button
                type="button"
                onClick={() => setSessionTrees(prev => Math.min(500, prev + 1))}
                className="w-8 h-8 rounded-xl bg-emerald-700/80 text-white font-bold text-lg flex items-center justify-center hover:bg-emerald-600 transition-colors"
                title="Increase simulated tree plantings"
              >
                &#43;
              </button>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-emerald-700 my-auto mx-2"></div>

          <div className="text-right flex flex-col justify-center">
            <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-widest font-mono">Offset Total</span>
            <span className="text-lg font-black text-emerald-400 block mt-0.5">
              &minus;{(sessionTrees * TREE_OFFSET_KG).toLocaleString()} kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
