from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import generate, history
import os
from datetime import datetime

load_dotenv()

app = FastAPI(
    title="AI Proposal Writer API",
    description="AI-powered freelance proposal generation system with cyberpunk theme",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Allowed origins for CORS
frontend_dev_url = os.getenv("NEXT_FRONTEND_DEVELOPMENT_URL", "http://localhost:3000")
frontend_prod_url = os.getenv("NEXT_FRONTEND_PRODUCTION_URL", "")

allowed_origins = [frontend_dev_url]
if frontend_prod_url:
    allowed_origins.append(frontend_prod_url)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router)
app.include_router(history.router)

@app.get("/")
async def root():
    """Root endpoint with project information and API documentation."""
    return {
        "project": "AI Proposal Writer",
        "version": "2.0.0",
        "description": "AI-powered freelance proposal generation system with cyberpunk theme",
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "health": "GET /health - Check API health status",
            "generate": "POST /api/generate/ - Generate a proposal from job description",
            "history": "GET /api/history/ - Get user's proposal history",
            "delete_proposal": "DELETE /api/history/{id} - Delete a proposal",
            "toggle_favorite": "PATCH /api/history/{id}/favorite - Toggle favorite status",
            "docs": "GET /docs - Interactive API documentation (Swagger UI)",
            "redoc": "GET /redoc - Alternative API documentation (ReDoc)"
        },
        "providers": {
            "gemini": "Google Gemini (Gemma 4) - Fast, reliable",
            "cohere": "Cohere (Command A) - Professional quality",
            "openrouter": "OpenRouter (Gemma 3) - Free tier available"
        },
        "features": [
            "Three tone options: professional, friendly, direct",
            "Multi-provider support (Gemini, Cohere, OpenRouter)",
            "Proposal history with favorites",
            "User authentication via Supabase",
            "Credit-based usage tracking",
            "Cyberpunk-themed UI"
        ],
        "documentation": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}
