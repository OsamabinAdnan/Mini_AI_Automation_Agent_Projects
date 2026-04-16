from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agents import Runner
import json
from typing import Optional
from tenacity import AsyncRetrying, stop_after_attempt, wait_exponential, retry_if_exception_type
from fastapi.middleware.cors import CORSMiddleware

from agent import get_meeting_agent, get_available_providers

app = FastAPI(title="Meeting Notes Processor", description="AI-powered meeting notes to action items converter")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MeetingNotesRequest(BaseModel):
    transcript: str
    provider: Optional[str] = None  # Optional: specify preferred provider

class ActionItem(BaseModel):
    task: str
    owner: str
    deadline: str
    priority: str

class MeetingSummary(BaseModel):
    summary: str
    action_items: list[ActionItem]
    decisions: list[str]
    attendees: list[str]

async def _run_agent_with_retry(agent, transcript: str):
    """Run agent with retry logic"""
    async for attempt in AsyncRetrying(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((Exception,))
    ):
        with attempt:
            result = await Runner.run(agent, transcript)
            return result

@app.post("/process-notes", response_model=MeetingSummary)
async def process_meeting_notes(request: MeetingNotesRequest):
    """
    Process meeting transcript and extract action items, decisions, and summary
    Supports multiple providers with fallback
    """
    try:
        # Get agent with preferred provider or fallback to first available
        meeting_agent = get_meeting_agent(request.provider)

        if not meeting_agent:
            raise HTTPException(status_code=500, detail="No providers available")

        # 🧪 Run the agent with the meeting transcript (with retry)
        result = await _run_agent_with_retry(meeting_agent, request.transcript)

        # Parse the response
        response_content = result.final_output

        # Extract JSON from the response
        start_brace = response_content.find('{')
        end_brace = response_content.rfind('}')

        if start_brace != -1 and end_brace != -1 and start_brace < end_brace:
            json_str = response_content[start_brace:end_brace+1]
            result_data = json.loads(json_str)
        else:
            result_data = json.loads(response_content)

        # Validate the structure
        summary = MeetingSummary(**result_data)

        return summary

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response as JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "meeting-notes-processor"}

@app.get("/providers")
async def get_providers():
    """Get list of available providers"""
    providers = get_available_providers()
    return {"providers": providers}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)