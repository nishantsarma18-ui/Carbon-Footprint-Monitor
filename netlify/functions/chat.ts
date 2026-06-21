import { GoogleGenAI } from "@google/genai";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: CORS_HEADERS }
    );
  }

  try {
    const body = await req.json();
    const { message, footprintData } = body;

    const client = getGeminiClient();

    let systemInstruction = "You are 'Eco-Advisor', a helpful, professional, and cheerful AI sustainability consultant. " +
      "Your mission is to guide users with concrete, actionable steps to measure, manage, and reduce their carbon footprint. " +
      "You always explain things in simple, encouraging, and clear terms. Use metric comparisons where useful (e.g., equivalents in trees planted or car-miles driven). " +
      "Always be practical, scientifically accurate, and supportive. Avoid climate doomerism; promote realistic, uplifting micro-habits.";

    if (footprintData) {
      systemInstruction += ` The user has current carbon footprint metrics: Transportation: ${footprintData.transport} kg, Energy: ${footprintData.energy} kg, Food: ${footprintData.food} kg, Consumption: ${footprintData.consumption} kg, total: ${footprintData.total} kg CO2e/year. Use these specific numbers when answering questions about their own footprint or habits.`;
    }

    const chat = client.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const response = await chat.sendMessage({ message });
    return new Response(JSON.stringify({ reply: response.text }), { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("Netlify Chat Function API Error:", error);
    const fallbackReply = {
      reply: "To keep our planet green, simple swaps go a long way! If you want to lower transport carbon, walking for trips under 2 miles is amazing. If you're asking about household power, switching to cold water washes saves ~150kg emissions a year. What other eco-tips can I help with?"
    };
    return new Response(JSON.stringify(fallbackReply), { status: 200, headers: CORS_HEADERS });
  }
};
