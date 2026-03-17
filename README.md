# AI Resume Analyzer

A full-stack starter for analyzing PDF resumes against a target job role.

## Tech stack

- Frontend: React + Vite in `client/`
- Backend: Node.js + Express in `server/`
- AI provider: Groq (OpenAI-compatible API)

## Project structure

```text
resume-analyzer/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   `-- services/
|-- server/
|   |-- src/
|   |   |-- routes/
|   |   |-- controllers/
|   |   |-- services/
|   |   `-- middleware/
|-- package.json
`-- README.md
```

## Setup

1. Install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

2. Create `server/.env` from `server/.env.example` and add your Groq key:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

## Run the app

Start both frontend and backend from the project root:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:server
npm run dev:client
```

## Available scripts

- `npm run dev` - runs server and client together
- `npm run dev:server` - runs the Express API
- `npm run dev:client` - runs the React app
- `npm run build` - builds the frontend
- `npm run start` - starts the backend in non-watch mode
- `npm run format` - formats project files with Prettier
- `npm run format:check` - checks project formatting with Prettier

## API endpoints

- `GET /api/health`
- `POST /api/analyze` - accepts multipart form-data with a `resume` PDF file

Example request:

Use `form-data` or the app UI:

- `resume`: PDF file
- `jobDescription`: optional text field

Example response:

```json
{
  "ok": true,
  "analysis": {
    "summary": "Strong frontend profile with clear React experience.",
    "strengths": ["React and TypeScript experience"],
    "gaps": ["Missing quantified impact"],
    "suggestions": ["Add metrics to project bullets"],
    "atsKeywords": ["React", "TypeScript", "REST APIs"],
    "matchScore": 78
  }
}
```
