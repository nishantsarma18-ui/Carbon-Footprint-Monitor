export interface TransportationData {
  carFuelMiles: number;
  carElectricMiles: number;
  busMiles: number;
  trainMiles: number;
  flightHours: number;
}

export interface EnergyData {
  electricityKwh: number;
  gasTherms: number;
  solarKwhOffset: number;
}

export interface FoodData {
  dietStyle: "heavy-meat" | "medium-meat" | "vegetarian" | "vegan";
  foodWasteLevel: "none" | "low" | "medium" | "high";
}

export interface ConsumptionData {
  newClothesMonthly: number;
  electronicsYearly: number;
  otherGoodsMonthly: number;
  recyclingLevel: "none" | "partial" | "full";
}

export interface FootprintState {
  transportation: TransportationData;
  energy: EnergyData;
  food: FoodData;
  consumption: ConsumptionData;
}

export interface FootprintResult {
  transportation: number;
  energy: number;
  food: number;
  consumption: number;
  total: number;
}

export interface SavedLogEntry {
  id: string;
  timestamp: string;
  name: string; // label e.g., 'May 2026 Baseline'
  scores: FootprintResult;
  inputs: FootprintState;
}

export interface ActionItem {
  priority: "High" | "Medium" | "Low";
  category: "Transportation" | "Energy" | "Food" | "Consumption";
  title: string;
  impact: string;
  description: string;
}

export interface GeminiInsights {
  summary: string;
  achievements: string[];
  actions: ActionItem[];
  motivation: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
