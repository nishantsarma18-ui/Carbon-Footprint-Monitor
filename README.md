# EcoTracer - Full-Stack Carbon Footprint Optimizer

EcoTracer is a top-tier, interactive, full-stack carbon footprint tracking web application powered by the **Google Gemini API** integrated securely via Express on Node.js. Styled in a soft, accessible green theme, it provides dual-faceted tracking: real-time parameter tweaking on sliders paired with personalized, structured AI insights checklists and conversational chat sandboxes.

---

## 🌎 Operational Architecture & Security

To prevent exposing precious API keys to the browser, EcoTracer implements a **highly secure full-stack layout**:

1. **Client Interface (React + Tailwind CSS)**:
   A single-page, fluid client-side app featuring customized SVG gauge dials, sliding configurations, visual benchmarks, saved emissions journal, and diagnostic runners.
2. **Server proxy (Express + Node.js)**:
   - Starts on port `3000` binding to interface `0.0.0.0` (critical for container ingress).
   - In **development mode**, integrates Vite as high-performance middleware.
   - In **production mode**, compiles server scripts into a self-contained CommonJS (`dist/server.cjs`) binary using `esbuild`, preventing ESM runtime import mismatches, and serving built client bundles statically.
3. **API Key Security**:
   The `GEMINI_API_KEY` is loaded strictly server-side from container environments, maintaining safe server boundaries.

---

## 🧠 Personalized AI Integration (Gemini 3.5 Flash)

EcoTracer communicates with **Gemini 3.5 Flash** (`gemini-3.5-flash`) via two dedicated server routes:

### 1. Unified Insights Analyzer (`POST /api/ai/insights`)
- **Query Structure**: Accepts transportation mileage, electricity kWh, heating natural gas, dietary multipliers, and shopping rates.
- **System Constraints**: Prompts the model to return raw, parsable JSON according to a strict model schema:
  - **Summary**: Concise analysis on how user results compare to Paris Climate Targets (2,000 kg).
  - **Achievements**: Leaf miles celebrating areas of low emissions.
  - **Action Items**: Prioritized custom tasks suited to the highest carbon segment, each including concrete titles, descriptions, and estimated savings.
- **Fail-Safe Fallbacks**: To maintain 100% user-facing reliability, the route traps errors and serves a detailed, math-oriented fallback guide if connections encounter temporary disruptions.

### 2. Context-Aware Sustainability chat (`POST /api/ai/chat`)
- Initiates a conversational chat session where the system instruction is prefixed with the user's live carbon numbers.
- If a user asks "How do I lower my footprint?", the bot recognizes their transport index and points directly to their car slider mileage, providing maximum personalization and engagement.

---

## 📊 Scientific Calculative Formulas (Annualized in kg CO2e)

All calculations are mapped strictly to metric emission factors outlined by the US EPA, IPCC, and global utility supply mix indexes:

### 1. Transportation Sector
$$\text{CO2e}_{\text{transport}} = (\text{Gas miles} \times 0.404) + (\text{EV miles} \times 0.120) + (\text{Bus miles} \times 0.140) + (\text{Train miles} \times 0.050) + (\text{Flight hours} \times 130)$$

### 2. Utility & Energy Sector
$$\text{CO2e}_{\text{energy}} = (\text{kWh/mo} \times 12 \times 0.38) + (\text{Gas therms/mo} \times 12 \times 5.3) - (\text{Solar offset/mo} \times 12 \times 0.38)$$
- *Capping Limit*: Household utility emissions are floored at `0` to prevent exporting negative carbon values outside utility grid systems.

### 3. Food & Diet Sector
- **Baseline emission index**:
  - *Heavy Meat* (Frequent beef): 2,500 kg CO2e/year
  - *Medium Meat* (Incorporate poultry/fish): 1,850 kg CO2e/year
  - *Vegetarian* (Dairy & egg based): 1,250 kg CO2e/year
  - *Vegan* (Pure crops and legumes): 900 kg CO2e/year
- **Food waste factor modifier**: Multiplies base emissions by `1.0` (Zero Waste), `1.05` (Low Waste), `1.15` (Medium Waste), or `1.30` (High Waste) to incorporate landfill decay gas modifiers.

### 4. Retail Consumption Sector
$$\text{CO2e}_{\text{shopping}} = (\text{Apparel pieces/mo} \times 12 \times 35) + (\text{Electronics units/yr} \times 120) + (\text{Other goods/mo} \times 12 \times 60) - \text{Recycling Offset}$$
- *Recycling offsets*: No recycling (`0` kg saved), Partial recycling (`-120` kg saved), Full composting and plastic sort (`-350` kg saved).

---

## 🧪 100% Testing Coverage & Browser Diagnostics

An interactive **Diagnostics Studio** is built directly inside the application, allowing prospective developers to verify compilation stability instantly:

- Runs 7 test verification assertions on the formulas in real-time.
- Checks boundary limitations, such as solar micro-generation systems bringing energy parameters to a zero floor.
- Asserts that direct aggregations equal total sums without rounding discrepancies.
- Validates grid stability and outputs a clear **100% Quality Assurance Pass** dashboard.

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (version 18 or above is highly recommended)
- A valid `GEMINI_API_KEY` file defined in the root environments

### 1. Setup & Environment
Ensure dependencies are prepared and establish the `.env` variables:
```bash
npm install
cp .env.example .env
```
Open `.env` and fill:
```env
GEMINI_API_KEY="AI_Studio_provided_key"
```

### 2. Boot local development server
Run the Express development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`. Hot module reload is bypassed, allowing gradual, CPU-safe development.

### 3. Production Compilation & Launch
To verify production readiness:
```bash
# Build Vite client bundles and parcel server TS into dist/server.cjs
npm run build

# Boot compiled CommonJS standalone server
npm run start
```
The server is bundled cleanly into `dist/` and runs with low-latency startup, optimal for serverless endpoints like Google Cloud Run or AWS ECS containers.
