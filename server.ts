import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Initialize Gemini client lazily to handle cases where API Key might be missing on boot
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

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Carbon footprint personalization endpoint using Gemini
  app.post("/api/ai/insights", async (req, res) => {
    try {
      const client = getGeminiClient();
      const { transport, energy, food, consumption, total, unit = "kg CO2e" } = req.body;

      const prompt = `
Analyze the following personal carbon footprint data and provide a highly personalized, structured response with carbon-saving actions.
Data:
- Transportation: ${transport} ${unit}
- Household Energy/Utilities: ${energy} ${unit}
- Food & Diet: ${food} ${unit}
- Consumption & Shopping: ${consumption} ${unit}
- Total Footprint: ${total} ${unit}

Global averages:
- Target sustainable level to meet Paris Climate goals: ~2000 kg (2 tons) CO2e/year
- High country average: ~15000 kg (15 tons) CO2e/year
- Global average: ~4800 kg (4.8 tons) CO2e/year

Your response must be returned in standard JSON format containing the exact schema structure:
{
  "summary": "A 2-3 sentence overview analyzing how this footprint compares to averages and where they are doing well or poorly.",
  "achievements": ["1-2 positive milestones or praises, e.g., 'Low meat dietary footprint', 'Efficient transit choice'"],
  "actions": [
    {
      "priority": "High" | "Medium" | "Low",
      "category": "Transportation" | "Energy" | "Food" | "Consumption",
      "title": "A short actionable title (e.g., 'Switch to LED lighting')",
      "impact": "Estimated annual savings (e.g. 'Saves ~200 kg CO2/year')",
      "description": "A brief actionable description explaining exactly how to perform this reduction or habit change."
    }
  ],
  "motivation": "A brief, highly encouraging and inspiring close statement or quote of the week."
}

Generate exactly 3 to 5 highly structured, realistic, and practical actions tailored to their highest carbon sector.
If any category is surprisingly low, acknowledge and reward that.
Return ONLY valid raw JSON without markdown formatting backticks, so that it can be parsed immediately.
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const cleaned = responseText.trim();
      res.json(JSON.parse(cleaned));
    } catch (error: any) {
      console.error("Gemini Insights API Error:", error);
      // Serve a high-quality fallback so the user always has a seamless, functional experience
      res.status(500).json({
        error: error.message || "Failed to generate AI insights",
        fallback: true,
        summary: "We have compiled a fallback analysis based on your carbon footprint. Lowering transportation emissions and switching to renewable energy sources are critical next steps for your profile.",
        achievements: ["You are actively tracking your footprints, which is the absolute first step! Praise your dedication."],
        actions: [
          {
            priority: "High",
            category: "Transportation",
            title: "Commute Visually & Use Public Transit",
            impact: "Saves up to 1,200 kg CO2e/year",
            description: "Switching from driving solo to telecommuting, ridesharing, or using standard public transport even 2 days a week drastically slashes carbon emissions."
          },
          {
            priority: "Medium",
            category: "Energy",
            title: "Transition to Smart Smart Sockets",
            impact: "Saves ~180 kg CO2e/year",
            description: "Up grading to LED lighting and putting high-draw appliances on smart plugs to defeat 'vampire' energy drains can lower home energy bills and emissions instantly."
          },
          {
            priority: "High",
            category: "Food",
            title: "Initiate Vegan or Vegetarian Mondays",
            impact: "Saves ~450 kg CO2e/year",
            description: "Transitioning to plant-based options one or two days a week saves massive land and water agricultural costs, bypassing heavy bovine emissions."
          }
        ],
        motivation: "Every green habit adds up. 'Unless someone like you cares a whole awful lot, nothing is going to get better. It's not.' — Dr. Seuss"
      });
    }
  });

  // Conversations API / Chatbot
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const client = getGeminiClient();
      const { message, footprintData } = req.body;

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
      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({
        reply: "To keep our planet green, simple swaps go a long way! If you want to lower transport carbon, walking for trips under 2 miles is amazing. If you're asking about household power, switching to cold water washes saves ~150kg emissions a year. What other eco-tips can I help with?"
      });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Express server failed to start", err);
});
