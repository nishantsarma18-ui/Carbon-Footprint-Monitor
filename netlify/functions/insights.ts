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
  // Handle preflight CORS request
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
    const { transport, energy, food, consumption, total, unit = "kg CO2e" } = body;

    const client = getGeminiClient();

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
    return new Response(cleaned, { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("Netlify Insights Function API Error:", error);
    
    // Support the exact fallback schema defined in the custom Node server
    const fallbackResponse = {
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
    };

    return new Response(JSON.stringify(fallbackResponse), { status: 200, headers: CORS_HEADERS });
  }
};
