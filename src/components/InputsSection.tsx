import React, { useState } from "react";
import { FootprintState } from "../types";
import { 
  Car, 
  Home, 
  Leaf, 
  ShoppingBag, 
  Plane, 
  Zap, 
  Trash2, 
  CheckCircle2, 
  HelpCircle 
} from "lucide-react";

interface InputsSectionProps {
  state: FootprintState;
  onChange: (newState: FootprintState) => void;
}

export default function InputsSection({ state, onChange }: InputsSectionProps) {
  const [activeTab, setActiveTab] = useState<"transport" | "energy" | "food" | "consumption">("transport");

  const updateTransport = (field: string, value: number) => {
    onChange({
      ...state,
      transportation: {
        ...state.transportation,
        [field]: value
      }
    });
  };

  const updateEnergy = (field: string, value: number) => {
    onChange({
      ...state,
      energy: {
        ...state.energy,
        [field]: value
      }
    });
  };

  const updateFood = (field: string, value: any) => {
    onChange({
      ...state,
      food: {
        ...state.food,
        [field]: value
      }
    });
  };

  const updateConsumption = (field: string, value: any) => {
    onChange({
      ...state,
      consumption: {
        ...state.consumption,
        [field]: value
      }
    });
  };

  const tabs = [
    { id: "transport", name: "Transportation", icon: Car, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { id: "energy", name: "Household Energy", icon: Home, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { id: "food", name: "Food & Diet", icon: Leaf, color: "text-teal-600 bg-teal-50 border-teal-200" },
    { id: "consumption", name: "Retail & Consumption", icon: ShoppingBag, color: "text-blue-600 bg-blue-50 border-blue-200" },
  ];

  return (
    <div className="bg-white border border-emerald-100/80 rounded-3xl shadow-sm overflow-hidden text-slate-800">
      
      {/* Visual Navigation Tabs */}
      <div className="flex border-b border-emerald-50 bg-emerald-50/10 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-4 px-3 text-xs font-bold font-sans border-b-2 text-center transition-all ${
                isActive 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-100/25" 
                  : "border-transparent text-slate-500 hover:text-emerald-800 hover:bg-emerald-50/40"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 md:p-8">
        {/* Transportation Sub-Form */}
        {activeTab === "transport" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Gasoline Car Mileage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    Gas/Diesel Car travel (annual miles)
                  </label>
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                    {state.transportation.carFuelMiles.toLocaleString()} mi
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="500"
                  value={state.transportation.carFuelMiles}
                  onChange={(e) => updateTransport("carFuelMiles", parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Annual miles in gasoline or diesel automobile"
                />
                <p className="text-[10px] text-gray-400">Main source of automotive carbon. Average US driver drives ~13,500 miles/year.</p>
              </div>

              {/* Electric Car Mileage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    Electric Car travel (annual miles)
                  </label>
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                    {state.transportation.carElectricMiles.toLocaleString()} mi
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="500"
                  value={state.transportation.carElectricMiles}
                  onChange={(e) => updateTransport("carElectricMiles", parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Annual miles in electric vehicle"
                />
                <p className="text-[10px] text-gray-400">Calculates grid footprint based on national utility supply averages (~70% savings over gas).</p>
              </div>

              {/* Bus Miles */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    Bus Public Transit (annual miles)
                  </label>
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                    {state.transportation.busMiles.toLocaleString()} mi
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={state.transportation.busMiles}
                  onChange={(e) => updateTransport("busMiles", parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Annual miles in standard motor buses"
                />
                <p className="text-[10px] text-gray-400">Buses have low emissions per passenger. Great alternative to solo driving!</p>
              </div>

              {/* Train Miles */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    Trains & Subways (annual miles)
                  </label>
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                    {state.transportation.trainMiles.toLocaleString()} mi
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={state.transportation.trainMiles}
                  onChange={(e) => updateTransport("trainMiles", parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Annual subway, metro, or regional rail miles"
                />
                <p className="text-[10px] text-gray-400">Subways and electric regional trains are the lowest carbon transit options (90% cleaner than cars).</p>
              </div>

              {/* Plane Travel Hours */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-emerald-700 inline" />
                    Commercial Flying Hours (yearly total)
                  </label>
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                    {state.transportation.flightHours} hours (~{(state.transportation.flightHours * 130).toLocaleString()} kg CO2e)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="1"
                  value={state.transportation.flightHours}
                  onChange={(e) => updateTransport("flightHours", parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Total air travel flight hours per year"
                />
                <p className="text-[10px] text-gray-400">High-altitude aviation emissions release nitrogen oxides and contrails, magnifying global warming potential.</p>
              </div>

            </div>
          </div>
        )}

        {/* Energy Sub-Form */}
        {activeTab === "energy" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Electricity usage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500 inline" />
                    Monthly Grid Electricity Consumed
                  </label>
                  <span className="font-mono text-xs font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
                    {state.energy.electricityKwh} kWh/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="20"
                  value={state.energy.electricityKwh}
                  onChange={(e) => updateEnergy("electricityKwh", parseInt(e.target.value) || 0)}
                  className="w-full accent-amber-500 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Average monthly household electricity usage in kilowatt-hours"
                />
                <p className="text-[10px] text-gray-400 font-mono">
                  Annualized: {(state.energy.electricityKwh * 12).toLocaleString()} kWh | Impact: ~{Math.round(state.energy.electricityKwh * 12 * 0.38).toLocaleString()} kg CO2e/yr
                </p>
              </div>

              {/* Natural Gas usage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    Monthly Natural Gas (Heating/Stove)
                  </label>
                  <span className="font-mono text-xs font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
                    {state.energy.gasTherms} Therms/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={state.energy.gasTherms}
                  onChange={(e) => updateEnergy("gasTherms", parseInt(e.target.value) || 0)}
                  className="w-full accent-amber-500 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Monthly gas therm usage (1 therm = 100,000 BTU)"
                />
                <p className="text-[10px] text-gray-400 font-mono">
                  Annualized: {(state.energy.gasTherms * 12).toLocaleString()} Therms | Impact: ~{Math.round(state.energy.gasTherms * 12 * 5.3).toLocaleString()} kg CO2e/yr
                </p>
              </div>

              {/* Solar production offset */}
              <div className="space-y-2 md:col-span-2 bg-emerald-50/20 border border-emerald-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Green Solar Generation Offset (re-injected to grid)
                  </label>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    &minus;{state.energy.solarKwhOffset} kWh/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="20"
                  value={state.energy.solarKwhOffset}
                  onChange={(e) => updateEnergy("solarKwhOffset", parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Monthly grid-exported solar generation"
                />
                <p className="text-[10px] text-emerald-800 mt-1">
                  Generates clean electrical credits! Saves up to <strong>{Math.round(state.energy.solarKwhOffset * 12 * 0.38).toLocaleString()} kg CO2e/year</strong> by offsetting fossil fuel plants.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Food Sub-Form */}
        {activeTab === "food" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Diet choice */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">
                Primary Dietary Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { id: "heavy-meat", label: "Heavy Meat", sub: "Frequent beef/lamb", foot: "~2,500 kg CO2/yr", desc: "Heavy ruminant emissions" },
                  { id: "medium-meat", label: "Medium Meat", sub: "Standard mixed diet", foot: "~1,850 kg CO2/yr", desc: "Moderate poultry/pork" },
                  { id: "vegetarian", label: "Vegetarian", sub: "Egg & dairy, no meat", foot: "~1,250 kg CO2/yr", desc: "No bovine carcass impact" },
                  { id: "vegan", label: "Vegan", sub: "Crops and plants only", foot: "~900 kg CO2/yr", desc: "Clean, ultra-sustainable" },
                ].map((diet) => {
                  const selected = state.food.dietStyle === diet.id;
                  return (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => updateFood("dietStyle", diet.id)}
                      className={`border p-4 rounded-xl text-left transition-all flex flex-col justify-between ${
                        selected 
                          ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20" 
                          : "border-gray-100 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">{diet.label}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 leading-tight">{diet.sub}</span>
                      </div>
                      <div className="mt-4 border-t border-dashed border-gray-100 pt-2 text-right">
                        <span className="text-[10px] font-mono font-bold text-emerald-800 block">{diet.foot}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Food waste */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-gray-700 block">
                Typical Organic Household Waste
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { id: "none", label: "Zero Waste", multiplier: "1.00x", desc: "Compost or complete usage" },
                  { id: "low", label: "Low Waste (~10%)", multiplier: "1.05x", desc: "Scraps thrown occasionally" },
                  { id: "medium", label: "Medium (~25%)", multiplier: "1.15x", desc: "Spoiled produce in trash" },
                  { id: "high", label: "High (~40%)", multiplier: "1.30x", desc: "Regular leftovers discarded" },
                ].map((waste) => {
                  const selected = state.food.foodWasteLevel === waste.id;
                  return (
                    <button
                      key={waste.id}
                      type="button"
                      onClick={() => updateFood("foodWasteLevel", waste.id)}
                      className={`border p-3.5 rounded-xl text-left transition-all ${
                        selected 
                          ? "border-emerald-600 bg-emerald-50/50" 
                          : "border-gray-100 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-900">{waste.label}</span>
                        <span className="font-mono text-[9px] font-bold bg-gray-100 text-gray-700 px-1 py-0.5 rounded">
                          {waste.multiplier}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">{waste.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Consumption Sub-Form */}
        {activeTab === "consumption" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Apparel Items */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    New Clothing Purchased (approx. items/month)
                  </label>
                  <span className="font-mono text-xs font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md">
                    {state.consumption.newClothesMonthly} items/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={state.consumption.newClothesMonthly}
                  onChange={(e) => updateConsumption("newClothesMonthly", parseInt(e.target.value) || 0)}
                  className="w-full accent-blue-500 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Average new shirts, pants, jackets bought monthly"
                />
                <p className="text-[10px] text-gray-400">Fast fashion represents a heavy carbon chain in manufacturing, transport, and waste.</p>
              </div>

              {/* Electronics Items */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    New Major Electronics Purchased (annual items)
                  </label>
                  <span className="font-mono text-xs font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md">
                    {state.consumption.electronicsYearly} units/yr
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={state.consumption.electronicsYearly}
                  onChange={(e) => updateConsumption("electronicsYearly", parseInt(e.target.value) || 0)}
                  className="w-full accent-blue-500 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="Annual major electronics (phones, computers, appliances)"
                />
                <p className="text-[10px] text-gray-400">Silicon smelting and aggregate supply paths make consumer electronics highly carbon-intensive.</p>
              </div>

              {/* Other goods monthly */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    Other Durable Purchases (books, toys, house fittings)
                  </label>
                  <span className="font-mono text-xs font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md">
                    {state.consumption.otherGoodsMonthly} items/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={state.consumption.otherGoodsMonthly}
                  onChange={(e) => updateConsumption("otherGoodsMonthly", parseInt(e.target.value) || 0)}
                  className="w-full accent-blue-500 h-2 bg-gray-100 rounded-lg cursor-pointer"
                  title="All other substantial physical material acquisitions weekly/monthly"
                />
                <p className="text-[10px] text-gray-400">Includes packaging processing, distribution footprint, and direct raw materials.</p>
              </div>

              {/* Recycling Offsets */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 block">
                  Active Recycling habits
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "none", label: "No recycling", saving: "0 kg" },
                    { id: "partial", label: "Recycle Paper/Glass", saving: "&minus;120 kg" },
                    { id: "full", label: "Compost & Full Sort", saving: "&minus;350 kg" },
                  ].map((rec) => {
                    const selected = state.consumption.recyclingLevel === rec.id;
                    return (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => updateConsumption("recyclingLevel", rec.id)}
                        className={`border p-2.5 rounded-xl text-center transition-all flex flex-col justify-between items-center ${
                          selected 
                            ? "border-blue-600 bg-blue-50/50" 
                            : "border-gray-100 bg-white hover:border-blue-100"
                        }`}
                      >
                        <span className="text-[11px] font-bold text-gray-900 leading-none">{rec.label}</span>
                        <span 
                          className="text-[10px] font-mono font-bold text-blue-600 mt-2 block"
                          dangerouslySetInnerHTML={{ __html: rec.saving }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
