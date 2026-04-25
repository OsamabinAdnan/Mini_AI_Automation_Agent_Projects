# AI Proposal Writer 2.0 - Cyberpunk Edition 🤖⚡

An advanced, AI-powered freelance proposal generator with a high-fidelity Cyberpunk 2.0 aesthetic. Built with Next.js, FastAPI, and Supabase.

![Cyberpunk UI](https://img.shields.io/badge/UI-Cyberpunk_2.0-cyan)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black)
![Supabase](https://img.shields.io/badge/Database-Supabase-blue)

## 🌌 Project Overview

AI Proposal Writer 2.0 is designed for modern freelancers who want to stand out. It uses state-of-the-art Large Language Models (LLMs) to transform job descriptions into winning proposals tailored to your unique expertise and a specific communication tone.

### Key Features
- **Neural Provider Switcher**: Toggle between **Google Gemini (Gemma 4)**, **Cohere (Command A)**, and **OpenRouter (Gemma 3)** in real-time.
- **Tone Protocol**: Generate proposals in **Professional**, **Friendly**, or **Direct** styles.
- **Personalized Context**: Save your core expertise and achievements to guide the AI for more accurate matching.
- **Cyberpunk UI**: Immersive terminal-style interface with glowing neon effects, animated grids, and scan-line overlays.
- **Smart History**: Track all your generated proposals, mark your best ones as **Favorites**, or purge old data.
- **Credit-Based System**: Integrated usage tracking via Supabase RPC functions.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS 4 with custom Cyberpunk palette
- **Animations**: Framer Motion, GSAP, and Three.js (Fiber/Drei)
- **Icons**: Lucide React
- **Auth/DB**: Supabase SSR & Client SDK
- **Feedback**: Sonner for neural link notifications

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **AI Engine**: OpenAI Agents SDK
- **Provider Support**: Gemini, Cohere, OpenRouter (OpenAI-compatible endpoints)
- **Database**: Supabase (PostgreSQL with RLS and PL/pgSQL Triggers)
- **Containerization**: Docker-ready for Hugging Face Spaces

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- Supabase Account
- API Keys for AI Providers (Gemini, Cohere, or OpenRouter)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd ai_project_proposal_writer
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   # Install dependencies
   pip install -r requirements.txt
   # Setup .env file (see .env.example)
   python main.py
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Setup .env.local with Supabase credentials
   npm run dev
   ```

## 📂 Project Structure

```text
ai_project_proposal_writer/
│
├── backend/                  # FastAPI Application
│   ├── agent/                # AI Agent Logic (OpenAI SDK wrapper)
│   │   └── proposal_agent.py # System prompts and model provider configuration
│   ├── models/               # Pydantic Schemas
│   │   └── schemas.py        # Request/Response data models
│   ├── routes/               # API Endpoints
│   │   ├── generate.py       # Proposal generation logic & credit tracking
│   │   └── history.py        # History, favorites, and deletion endpoints
│   ├── main.py               # Application entry point & CORS configuration
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Hugging Face Spaces deployment config
│
├── frontend/                 # Next.js 14 Application
│   ├── app/                  # App Router & Pages
│   │   ├── (auth)/           # Login, Signup, and Profile pages
│   │   ├── dashboard/        # Main generator interface
│   │   ├── features/         # Features showcase page
│   │   ├── layout.tsx        # Root layout & global providers
│   │   └── page.tsx          # Animated cyberpunk landing page
│   ├── components/           # React Components
│   │   ├── animations/       # Typewriter text, 3D backgrounds
│   │   ├── dashboard/        # History sidebar, etc.
│   │   ├── layout/           # Navbar, Footer
│   │   └── ui/               # Reusable cyberpunk UI elements (CyberButton, etc.)
│   ├── lib/                  # Utilities
│   │   └── supabase.ts       # Supabase client initialization
│   ├── globals.css           # Custom Tailwind utilities & Cyberpunk variables
│   └── package.json          # Node dependencies
│
├── supabase/                 # Database configuration
│   └── migrations/           # SQL scripts
│       └── reset_app_tables.sql # Tables, RLS policies, and RPC triggers
│
├── .gitignore                # Security & cache exclusions
└── README.md                 # Project documentation
```

---

## 🔐 Security & Environment

This project uses a professional security configuration:
- **CORS Lockdown**: Backend only allows requests from authorized frontend domains defined in `.env`.
- **Secret Management**: All API keys and database credentials are strictly managed via environment variables and excluded from version control via `.gitignore`.
- **Row Level Security (RLS)**: User data is protected at the database layer; users can only see and modify their own proposals.

---

## 🚢 Deployment

### Backend (Hugging Face Spaces)
The backend is pre-configured with a `Dockerfile` and `requirements.txt` for easy deployment to Hugging Face:
- Uses `python:3.12-slim`
- Runs on port `7860`
- Fully automated build process

### Frontend (Vercel)
The frontend is standard Next.js and can be deployed directly to Vercel or any similar provider.

---

## 📝 Tone Protocol Definitions
- **Professional**: Formal, authoritative, focus on ROI and precision.
- **Friendly**: Warm, approachable, uses inclusive language, focus on partnership.
- **Direct**: Concise, no fluff, focus on immediate action and technical clarity.

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

**System Status**: `ONLINE` | **Neural Link**: `ESTABLISHED` | **Protocol**: `V2.0`
