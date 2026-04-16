import os
from dotenv import load_dotenv
from agents import (
    Agent,
    OpenAIChatCompletionsModel,
    set_tracing_disabled
)
from openai import AsyncOpenAI
from typing import Optional, Dict, Any

# Load environment variables
load_dotenv()

set_tracing_disabled(True)

class MultiProviderAgent:
    def __init__(self):
        self.providers = self._setup_providers()

    def _setup_providers(self) -> list:
        """Setup available providers with their configurations"""
        providers = []

        # OpenRouter Provider (using OPENAI_BASE_URL per your .env)
        openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        openrouter_base_url = os.getenv("OPENAI_BASE_URL") or os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        if openrouter_api_key:
            providers.append({
                "name": "openrouter",
                "api_key": openrouter_api_key,
                "base_url": openrouter_base_url,
                "model": os.getenv("OPENROUTER_MODEL", "openrouter/elephant-alpha"),
                "client": AsyncOpenAI(api_key=openrouter_api_key, base_url=openrouter_base_url)
            })

        # Qwen Provider
        qwen_api_key = os.getenv("QWEN_API_KEY")
        if qwen_api_key:
            providers.append({
                "name": "qwen",
                "api_key": qwen_api_key,
                "base_url": os.getenv("QWEN_BASE_URL", "https://portal.qwen.ai/v1"),
                "model": os.getenv("QWEN_MODEL", "qwen3-coder-plus"),
                "client": AsyncOpenAI(api_key=qwen_api_key, base_url=os.getenv("QWEN_BASE_URL", "https://portal.qwen.ai/v1"))
            })

        # Cohere Provider
        cohere_api_key = os.getenv("COHERE_API_KEY")
        if cohere_api_key:
            providers.append({
                "name": "cohere",
                "api_key": cohere_api_key,
                "base_url": os.getenv("COHERE_BASE_URL", "https://api.cohere.ai/v1"),
                "model": os.getenv("COHERE_MODEL", "command-a-03-2025"),
                "client": AsyncOpenAI(api_key=cohere_api_key, base_url=os.getenv("COHERE_BASE_URL", "https://api.cohere.ai/v1"))
            })

        # Groq Provider
        groq_api_key = os.getenv("GROQ_API_KEY")
        if groq_api_key:
            providers.append({
                "name": "groq",
                "api_key": groq_api_key,
                "base_url": os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1"),
                "model": os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
                "client": AsyncOpenAI(api_key=groq_api_key, base_url=os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1"))
            })

        return providers

    def get_meeting_agent(self, preferred_provider: Optional[str] = None):
        """Get an agent with fallback capability"""
        if not self.providers:
            raise Exception("No API keys configured. Please set at least one provider API key.")

        # If preferred provider is specified, try it first
        if preferred_provider:
            for provider in self.providers:
                if provider["name"] == preferred_provider:
                    return self._create_agent(provider)

        # Otherwise, return agent with first available provider
        if self.providers:
            return self._create_agent(self.providers[0])

        raise Exception("No providers available")

    def _create_agent(self, provider_config: Dict[str, Any]) -> Agent:
        """Create an agent with the given provider configuration"""
        model: OpenAIChatCompletionsModel = OpenAIChatCompletionsModel(
            model=provider_config["model"],
            openai_client=provider_config["client"]
        )

        # 🤖 Create agent for processing meeting notes
        agent: Agent = Agent(
            name=f"MeetingAssistant-{provider_config['name']}",
            instructions=(
                "You are an expert meeting assistant. Analyze the following meeting transcript and extract: "
                "1. A brief summary of the meeting "
                "2. Action items with specific owners, deadlines, and priorities "
                "3. Key decisions made during the meeting "
                "4. Attendees mentioned in the meeting "
                "Respond ONLY in valid JSON format with the structure: "
                "{"
                '  "summary": "Brief summary", '
                '  "action_items": [{"task": "...", "owner": "...", "deadline": "...", "priority": "..."}], '
                '  "decisions": ["..."], '
                '  "attendees": ["..."]'
                "}"
            ),
            model=model,
        )

        return agent

    def get_available_providers(self) -> list:
        """Return list of configured providers"""
        return [provider["name"] for provider in self.providers]

# Global instance
multi_agent = MultiProviderAgent()

def get_meeting_agent(preferred_provider: Optional[str] = None):
    return multi_agent.get_meeting_agent(preferred_provider)

def get_available_providers():
    return multi_agent.get_available_providers()
