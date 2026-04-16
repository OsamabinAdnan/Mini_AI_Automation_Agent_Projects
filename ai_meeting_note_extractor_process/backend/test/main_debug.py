from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agents import Runner
import json
from typing import Optional
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

        # 🧪 Run the agent with the meeting transcript (without retry to debug)
        print(f"Running agent: {meeting_agent.name}")
        result = Runner.run_sync(meeting_agent, request.transcript)
        print(f"Agent result received: {len(result.final_output)} chars")

        # Parse the response
        response_content = result.final_output
        print(f"Response content: {response_content[:200]}...")

        # Extract JSON from the response
        start_brace = response_content.find('{')
        end_brace = response_content.rfind('}')

        if start_brace != -1 and end_brace != -1 and start_brace < end_brace:
            json_str = response_content[start_brace:end_brace+1]
            print(f"Extracted JSON string: {json_str}")
            result_data = json.loads(json_str)
        else:
            print(f"Parsing full response as JSON")
            result_data = json.loads(response_content)

        # Validate the structure
        summary = MeetingSummary(**result_data)

        return summary

    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        print(f"Response was: {response_content if 'response_content' in locals() else 'not defined'}")
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response as JSON: {str(e)}")
    except Exception as e:
        print(f"Processing error: {e}")
        import traceback
        traceback.print_exc()
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