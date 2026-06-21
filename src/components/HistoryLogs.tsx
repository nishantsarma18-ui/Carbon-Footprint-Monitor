import React, { useState } from "react";
import { FootprintState, SavedLogEntry, FootprintResult } from "../types";
import { 
  FolderHeart, 
  Trash2, 
  Download, 
  RotateCcw, 
  Calendar, 
  Sparkles, 
  Plus, 
  UploadCloud 
} from "lucide-react";

interface HistoryLogsProps {
  currentInputs: FootprintState;
  currentScore: FootprintResult;
  savedLogs: SavedLogEntry[];
  onSaveLog: (name: string) => void;
  onLoadLog: (inputs: FootprintState) => void;
  onDeleteLog: (id: string) => void;
  onClearLogs: () => void;
}

export default function HistoryLogs({
  currentInputs,
  currentScore,
  savedLogs,
  onSaveLog,
  onLoadLog,
  onDeleteLog,
  onClearLogs,
}: HistoryLogsProps) {
  const [newLogName, setNewLogName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogName.trim()) return;
    onSaveLog(newLogName.trim());
    setNewLogName("");
  };

  const handleExportJSON = () => {
    if (savedLogs.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ecotracer-carbon-history.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white border border-emerald-100 rounded-[40px] p-6 shadow-sm space-y-6 text-slate-800 animate-fade-in">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-50 pb-4">
        <div>
          <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-emerald-600" />
            Emissions Journal & History
          </h3>
          <p className="text-xs font-medium text-slate-400">Save different lifestyle configurations to track goals over seasons.</p>
        </div>

        {savedLogs.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="text-xs text-slate-700 bg-white border border-emerald-100 hover:border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold shadow-3xs cursor-pointer transition-colors"
              title="Download backup"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Baseline JSON</span>
            </button>
            <button
              onClick={onClearLogs}
              className="text-xs text-red-700 bg-red-50/50 hover:bg-red-55 border border-red-100 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
              title="Wipe state journals"
            >
              <span>Wipe History</span>
            </button>
          </div>
        )}
      </div>

      {/* Snapshot/Saving Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-emerald-50/20 border border-emerald-100/60 rounded-2xl p-4">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-bold text-emerald-950 block font-mono">Snapshot Label Name</label>
          <input
            type="text"
            required
            value={newLogName}
            onChange={(e) => setNewLogName(e.target.value)}
            placeholder="e.g., Summer 2026 Baseline, Low Meat Diet Goal, Solar Swivel Setup"
            className="w-full text-xs bg-white border border-emerald-100 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 outline-none text-emerald-950 font-medium shadow-3xs"
          />
        </div>
        <div className="flex flex-col justify-end shrink-0">
          <button
            type="submit"
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2.5 flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save active metrics ({currentScore.total.toLocaleString()} kg)</span>
          </button>
        </div>
      </form>

      {/* Logs display */}
      {savedLogs.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-gray-100 rounded-xl text-center text-gray-400 text-xs">
          Your Emissions Journal is blank. Create a baseline snapshot above to preserve your tracking configurations.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {savedLogs.map((log) => {
            const sum = log.scores.total;
            const transPct = Math.round((log.scores.transportation / sum) * 100);
            const energyPct = Math.round((log.scores.energy / sum) * 100);
            const foodPct = Math.round((log.scores.food / sum) * 100);
            const consPct = Math.round((log.scores.consumption / sum) * 100);

            return (
              <div 
                key={log.id}
                className="border border-gray-100 rounded-xl p-4 hover:border-emerald-250 transition-all bg-white relative shadow-3xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 leading-tight">
                        {log.name}
                      </h4>
                      <span className="text-[9px] text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(log.timestamp).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-emerald-950 font-mono block">
                        {sum.toLocaleString()} kg
                      </span>
                      <span className="text-[9px] text-emerald-600 font-bold font-mono">
                        {(sum / 1000).toFixed(2)} tons / yr
                      </span>
                    </div>
                  </div>

                  {/* Tiny segmented bar representing category mix */}
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex mb-4">
                    <div className="h-full bg-emerald-500" style={{ width: `${transPct}%` }} title={`Transportation: ${transPct}%`}></div>
                    <div className="h-full bg-amber-500" style={{ width: `${energyPct}%` }} title={`Energy: ${energyPct}%`}></div>
                    <div className="h-full bg-teal-500" style={{ width: `${foodPct}%` }} title={`Food: ${foodPct}%`}></div>
                    <div className="h-full bg-blue-500" style={{ width: `${consPct}%` }} title={`Retail: ${consPct}%`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                  <button
                    onClick={() => onLoadLog(log.inputs)}
                    className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50/50 border border-emerald-100 rounded-lg py-1.5 px-2.5 flex items-center gap-1 transition-colors"
                    title="Load inputs back to sliders"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: "12s" }} />
                    <span>Load Slider Settings</span>
                  </button>

                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="text-red-700 bg-red-50/40 hover:bg-red-50 border border-red-150 rounded-lg p-1.5 shrink-0 transition-colors"
                    title="Delete saved Baseline entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
