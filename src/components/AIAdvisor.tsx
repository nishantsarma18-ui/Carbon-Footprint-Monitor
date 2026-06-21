import React, { useState, useEffect, useRef } from "react";
import { FootprintResult, FootprintState, ActionItem, ChatMessage, GeminiInsights } from "../types";
import { 
  Sparkles, 
  Send, 
  CheckSquare, 
  Square, 
  Award, 
  Activity,
  Trees, 
  Compass, 
  Bot, 
  User, 
  Loader2, 
  ArrowRight,
  TrendingDown
} from "lucide-react";

interface AIAdvisorProps {
  score: FootprintResult;
  inputs: FootprintState;
  onApplySpecialOffset: (offsetAmountKg: number) => void;
}

export default function AIAdvisor({ score, inputs, onApplySpecialOffset }: AIAdvisorProps) {
  // Insights State
  const [insights, setInsights] = useState<GeminiInsights | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState<boolean>(false);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your AI Eco-Advisor. I've analyzed your household profiles and transport. Ask me anything about how to optimize carbon savings, switch suppliers, or understand offsetting!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll Chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchAIInsights = async () => {
    setIsInsightsLoading(true);
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transport: score.transportation,
          energy: score.energy,
          food: score.food,
          consumption: score.consumption,
          total: score.total
        })
      });
      const data = await response.json();
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInsightsLoading(false);
    }
  };

  // Run on first load to make sure they have personalization immediately
  useEffect(() => {
    fetchAIInsights();
  }, []);

  const handleActionCheck = (actionIndex: number, action: ActionItem) => {
    const key = `${action.category}-${actionIndex}`;
    const wasCompleted = !!completedActions[key];
    setCompletedActions(prev => ({
      ...prev,
      [key]: !wasCompleted
    }));

    // Parse estimated savings in the impact string (e.g., Saves ~150 kg)
    const impactNum = parseInt(action.impact.replace(/[^0-9]/g, "")) || 100;
    
    // Apply simulated real-time deduction to the general footprint
    if (!wasCompleted) {
      onApplySpecialOffset(impactNum);
    } else {
      onApplySpecialOffset(-impactNum); // subtract back offset if unchecked
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const messageToSend = customText || chatInput;
    if (!messageToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSend,
          footprintData: {
            transport: score.transportation,
            energy: score.energy,
            food: score.food,
            consumption: score.consumption,
            total: score.total
          }
        })
      });
      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply || "I apologize, I've run into an environment roadblock.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickQuestions = [
    "How do I optimize utility electric carbon footprint?",
    "Why is flying so bad for atmospheric warmth?",
    "Give me standard meatless recipe carbon comparisons",
    "How does recycling plastic save manufacturing energy?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-800 animate-fade-in">
      
      {/* Actionable Insights Panel */}
      <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-[40px] p-6 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-50 pb-4">
            <div>
              <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                Personalized AI Checklists
              </h3>
              <p className="text-xs text-slate-400 font-medium">Gemini model-generated lifestyle action items customized for your footprint.</p>
            </div>
            <button
              onClick={fetchAIInsights}
              disabled={isInsightsLoading}
              className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-150 px-3 py-1.5 rounded-xl hover:bg-emerald-100 hover:text-emerald-900 transition-colors flex items-center gap-1 font-bold disabled:opacity-50 cursor-pointer shadow-3xs"
            >
              {isInsightsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
              <span>Recalculate</span>
            </button>
          </div>

          {isInsightsLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4 animate-pulse">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-900">Consulting carbon data layers...</p>
                <p className="text-xs text-gray-400 max-w-xs">Building custom reduction guides based on your travel metrics and food inputs.</p>
              </div>
            </div>
          ) : insights ? (
            <div className="space-y-5 animate-fade-in text-left">
              {/* Executive Summary */}
              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50">
                <h4 className="text-xs font-bold text-emerald-900 uppercase font-mono tracking-wider mb-1 flex items-center gap-1">
                  <Bot className="w-4 h-4 text-emerald-600" />
                  Eco-Advisor Analysis
                </h4>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  {insights.summary}
                </p>
              </div>

              {/* Achievements banner */}
              {insights.achievements && insights.achievements.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider block">Achievements In Progress</span>
                  <div className="flex flex-wrap gap-2">
                    {insights.achievements.map((ach, id) => (
                      <span key={id} className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/50 border border-emerald-200 py-1 px-2.5 rounded-full">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        {ach}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Priority Checklist */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider block">Recommended Actions (Check to apply simulated offsets)</span>
                <div className="space-y-2.5">
                  {insights.actions?.map((action, idx) => {
                    const isChecked = !!completedActions[`${action.category}-${idx}`];
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleActionCheck(idx, action)}
                        className={`border rounded-xl p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked 
                            ? "border-emerald-500 bg-emerald-50/30" 
                            : "border-gray-100 bg-white hover:border-emerald-200 shadow-3xs"
                        }`}
                      >
                        <button type="button" className="shrink-0 mt-0.5 text-emerald-600 focus:outline-none" title={isChecked ? "Undo Action" : "Complete Action"}>
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-300 hover:text-emerald-400" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className={`text-xs font-bold leading-tight ${isChecked ? "line-through text-gray-400" : "text-emerald-950"}`}>
                              {action.title}
                            </h5>
                            <span className={`text-[9px] font-black uppercase font-mono px-1.5 py-0.5 rounded-md ${
                              action.priority === "High" ? "bg-red-50 text-red-700" : action.priority === "Medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                            }`}>
                              {action.priority} Priority
                            </span>
                            <span className="text-[9px] font-bold font-mono bg-gray-50 border text-gray-600 px-1.5 py-0.5 rounded-md ml-auto shrink-0">
                              {action.impact}
                            </span>
                          </div>
                          <p className={`text-[10px] leading-relaxed ${isChecked ? "text-gray-400" : "text-gray-500"}`}>
                            {action.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quote Footer bar */}
              {insights.motivation && (
                <div className="border-t border-dashed border-gray-100 pt-4 text-center">
                  <span className="inline-block text-[11px] font-semibold italic text-emerald-800/80 bg-emerald-50/30 border border-emerald-100 px-3 py-1 rounded-full">
                    🎄 {insights.motivation}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 text-xs">
              Unable to load insights logs. Please try recalculating.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Chat Advisor sandbox */}
      <div className="lg:col-span-5 bg-white border border-emerald-100 rounded-[40px] shadow-sm flex flex-col justify-between overflow-hidden h-[540px]">
        {/* Chat Header */}
        <div className="bg-emerald-600/10 p-4 border-b border-emerald-100/60 h-[64px] flex items-center gap-2 bg-emerald-50/40 shrink-0">
          <div className="bg-emerald-600 text-white rounded-xl p-1.5 shadow-sm shadow-emerald-250">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-950 font-sans tracking-wide">
              Sustainability sandbox
            </h4>
            <span className="text-[9px] font-bold text-emerald-600 font-mono tracking-wider flex items-center gap-1.5 leading-none mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              ECO-ADVISOR (GEMINI 3.5 FLASH)
            </span>
          </div>
        </div>

        {/* Message Panel Contextualized wrapper */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 flex flex-col min-h-0">
          {chatMessages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`p-1.5 rounded-md ${msg.sender === "user" ? "bg-emerald-600 text-white" : "bg-white border border-emerald-100 text-emerald-950"}`}>
                {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-3xs ${
                  msg.sender === "user" 
                    ? "bg-emerald-600 text-white rounded-tr-none font-medium" 
                    : "bg-white border border-gray-100 text-emerald-950 rounded-tl-none font-medium"
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[9px] text-gray-400 mt-1 block font-mono ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isChatLoading && (
            <div className="flex items-start gap-2.5 max-w-[80%] mr-auto animate-pulse">
              <div className="p-1.5 bg-white border border-emerald-100 text-emerald-950 rounded-md">
                <Bot className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              </div>
              <div className="bg-white border border-gray-100 text-gray-400 p-3 rounded-2xl text-xs rounded-tl-none font-mono">
                Eco-Advisor is researching formula parameters...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input panel & Quick Suggestion chips */}
        <div className="border-t border-gray-100 bg-white p-3 space-y-2.5 shrink-0">
          
          {/* Quick chips - only show if chat history is short or static */}
          {chatMessages.length < 5 && (
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {quickQuestions.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(chip)}
                  className="bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-800 rounded-lg px-2.5 py-1 whitespace-nowrap hover:bg-emerald-100 hover:text-emerald-900 transition-colors shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about grid emissions, food chain offsets, flight carbon..."
              className="flex-1 text-xs border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium text-emerald-950"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="bg-emerald-600 text-white rounded-xl p-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Send Message"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
