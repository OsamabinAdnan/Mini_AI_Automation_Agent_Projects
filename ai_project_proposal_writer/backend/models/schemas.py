from pydantic import BaseModel, Field
from typing import Optional, Literal

class GenerateRequest(BaseModel):
    job_description: str = Field(..., min_length=20, max_length=10000)
    user_context: Optional[str] = Field(None, max_length=5000)
    tone: Literal["professional", "friendly", "direct"] = "professional"
    provider: Optional[Literal["cohere", "openrouter", "gemini"]] = "gemini"

class GenerateResponse(BaseModel):
    success: bool
    proposal: str
    metadata: dict
