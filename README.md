# DataMind AI — Schema-Agnostic Natural Language Data Analyst

DataMind AI is a React + TypeScript data-analysis application that lets users upload CSV/Excel files and ask natural-language questions about the actual dataset.

## Features

- CSV / XLSX / XLS upload
- Automatic schema and data-type profiling
- Heuristic semantic schema inference with optional Gemini enhancement
- Natural-language analysis planning
- Real-data calculations for totals, averages, min/max, counts, rankings, trends, percentages, correlation, and anomalies
- Data-quality scoring
- Interactive dashboard and reports
- Graceful offline fallback when Gemini is unavailable

## Run locally in VS Code

**Prerequisite:** Node.js 20+ recommended.

1. Open this folder in VS Code.
2. Open the VS Code terminal.
3. Install dependencies:

```bash
npm install
```

4. Optional: create `.env` from `.env.example` and add your Gemini API key:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

Gemini is optional. The app has a local heuristic fallback, so the core data analysis still works without an API key.

5. Start the application:

```bash
npm run dev
```

6. Open:

```text
http://localhost:3000
```

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm run clean
```

## Project structure

```text
src/
  components/     React UI pages and reusable components
  data/           Demo datasets
  services/       Backend API client and local fallback planner
  types/          Shared TypeScript types
  utils/          File parsing and real-data analysis engine
server.ts         Express + Vite development server and optional Gemini API
vite.config.ts    Vite configuration
```

## Important

- Never commit a real Gemini API key to GitHub.
- Use `.env` locally; `.env` is ignored by Git.
- Uploaded data is analyzed in memory by the client-side engine for calculations.
- AI responses are used for schema/planning/insight assistance; numerical results are computed from the dataset itself.
