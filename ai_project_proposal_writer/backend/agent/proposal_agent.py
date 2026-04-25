import os
import re
from typing import Literal, Optional
from openai import AsyncOpenAI
from agents import Agent, Runner, OpenAIChatCompletionsModel, function_tool, RunContextWrapper, set_tracing_disabled
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
set_tracing_disabled(True)

# Provider configuration
PROVIDERS = {
    "cohere": {
        "model": "command-a-03-2025",
        "base_url": "https://api.cohere.ai/compatibility/v1",
        "api_key_env": "COHERE_API_KEY"
    },
    "openrouter": {
        "model": "google/gemma-3-4b-it:free",
        "base_url": "https://openrouter.ai/api/v1",
        "api_key_env": "OPENROUTER_API_KEY"
    },
    "gemini": {
        "model": "gemma-4-26b-a4b-it",
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai",
        "api_key_env": "GEMINI_API_KEY"
    }
}

def get_agent_for_provider(provider_key: str) -> Agent:
    config = PROVIDERS.get(provider_key, PROVIDERS["gemini"])
    
    # Initialize custom client for this provider
    client = AsyncOpenAI(
        api_key=os.getenv(config["api_key_env"]),
        base_url=config["base_url"]
    )
    
    # Initialize the model using the custom client
    model = OpenAIChatCompletionsModel(
        model=config["model"],
        openai_client=client
    )
    
    return Agent(
        name="Proposal Writer Agent",
        instructions=_get_system_prompt(),
        model=model,
        tools=[analyze_job_description]
    )

def _get_system_prompt() -> str:
    return """You write freelance proposals. Output ONLY the proposal text. No thoughts, no planning, no preamble, no markdown.

Structure your proposal in exactly 3 paragraphs with double line breaks between them. Do not use headers or labels.

TONE PROTOCOL:
- professional: Formal, authoritative, focus on ROI and precision.
- friendly: Warm, approachable, uses inclusive language, focus on partnership.
- direct: Concise, no fluff, focus on immediate action and technical clarity.

PARAGRAPH 1 - Opening Hook:
- One compelling sentence that references a specific detail from the job description
- One sentence showing personalization and understanding of the client's unique goal or passion

PARAGRAPH 2 - Body (2-4 sentences):
- Clear understanding of the task in your own words
- Relevant experience with the placeholder [YOUR EXPERIENCE HERE] exactly once
- Your approach (mini plan) - steps you will take
- Unique value/differentiator - what sets you apart
- Results-oriented language - measurable outcomes or benefits

PARAGRAPH 3 - Closing:
- One smart, open-ended question about the project that shows deep engagement
- One clear call-to-action inviting the client to reply or take the next step

Rules: Max 180 words total. Active voice. Adapt your vocabulary to the specified TONE. Output plain text only. Preserve double line breaks between paragraphs."""

@function_tool
async def analyze_job_description(context: RunContextWrapper, text: str) -> dict:
    skills_keywords = ["React", "Next.js", "Python", "FastAPI", "JavaScript", "TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL", "Tailwind"]
    found_skills = [skill for skill in skills_keywords if skill.lower() in text.lower()]
    return {"skills": found_skills[:5], "word_count": len(text.split())}

def _sanitize_output(text: str) -> str:
    """Strip any <thought>...</thought> blocks or other preamble from model output while preserving structure."""
    # Remove <thought>...</thought> blocks (greedy, handles multiline)
    text = re.sub(r'<thought>.*?</thought>', '', text, flags=re.DOTALL)
    # Remove any remaining XML-like tags
    text = re.sub(r'<[^>]+>', '', text)
    # Just return the trimmed text - don't strip internal whitespace/newlines
    return text.strip()

async def generate_proposal(job_description: str, tone: str, user_context: str = None, provider: str = "gemini") -> tuple[str, dict]:
    agent = get_agent_for_provider(provider)

    context_prompt = f"\n\nUSER BACKGROUND:\n{user_context}" if user_context else ""
    prompt = f"TONE: {tone}{context_prompt}\n\nJOB DESCRIPTION:\n{job_description}"
    result = await Runner.run(agent, prompt)

    cleaned = _sanitize_output(result.final_output)
    return cleaned, {"provider": provider, "timestamp": datetime.now().isoformat()}
