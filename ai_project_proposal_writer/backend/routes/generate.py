from fastapi import APIRouter, HTTPException, Request
from agent.proposal_agent import generate_proposal, PROVIDERS
from models.schemas import GenerateRequest, GenerateResponse
import asyncio
import time
import os
from supabase import create_client, Client
from datetime import datetime # Import datetime

router = APIRouter(prefix="/api/generate", tags=["generate"])

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Supabase URL and Service Key must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

@router.post("/", response_model=GenerateResponse)
async def generate_proposal_endpoint(request: Request, generate_request: GenerateRequest):
    user_id = None
    try:
        # Extract user_id from the Authorization header (JWT)
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            # Use `auth.get_user()` to get the user object from the token
            # Note: This requires the JWT secret to be configured for the Supabase client if it's not the default
            user_response = supabase.auth.get_user(token)
            if user_response and user_response.user:
                user_id = user_response.user.id
            else:
                raise HTTPException(status_code=401, detail="Unauthorized: Invalid token or user not found")
        else:
            raise HTTPException(status_code=401, detail="Unauthorized: No token provided")

        # 1. Credit check
        if user_id:
            # Call the stored procedure to decrement credits
            credit_decrement_result = supabase.rpc('decrement_credits', {'user_id_input': str(user_id)}).execute()

            if not credit_decrement_result.data: # Data will be an empty list if false is returned
                raise HTTPException(
                    status_code=403,
                    detail="Daily credit limit reached. Please try again tomorrow."
                )
        else:
            raise HTTPException(status_code=401, detail="User not authenticated.")


        start_time = time.time()
        # Generate proposal
        proposal_text, metadata = await asyncio.wait_for(
            generate_proposal(
                job_description=generate_request.job_description,
                user_context=generate_request.user_context,
                tone=generate_request.tone,
                provider=generate_request.provider
            ),
            timeout=60.0  # Increased timeout for LLM generation
        )
        latency_ms = int((time.time() - start_time) * 1000)

        # Record proposal and metadata in DB
        selected_model = PROVIDERS[generate_request.provider]['model']

        # First, insert job description
        job_description_insert_result = supabase.table('job_descriptions').insert({
            'user_id': user_id,
            'original_text': generate_request.job_description,
            'word_count': len(generate_request.job_description.split()),
            'provider_used': generate_request.provider,
            'updated_at': datetime.now().isoformat()
        }).execute()

        # Assuming `data` contains the inserted row(s) and the `id`
        job_id = job_description_insert_result.data[0]['id'] 

        # Then, insert proposal
        supabase.table('proposals').insert({
            'user_id': user_id,
            'job_id': job_id,
            'generated_text': proposal_text,
            'tone': generate_request.tone,
            'word_count': len(proposal_text.split()),
            'is_favorite': False, # Default to false
            'model_used': selected_model,
            'latency_ms': latency_ms,
            'updated_at': datetime.now().isoformat()
        }).execute()

        return GenerateResponse(
            success=True,
            proposal=proposal_text,
            metadata={**metadata, "model_used": selected_model, "latency_ms": latency_ms}
        )

    except asyncio.TimeoutError:
        # If timeout, and credits were decremented, attempt to rollback
        if user_id and 'credit_decrement_result' in locals() and credit_decrement_result.data:
            try:
                supabase.rpc('increment_credits', {'user_id_input': str(user_id)}).execute()
            except Exception:
                pass
        raise HTTPException(
            status_code=504,
            detail="AI generation timed out. Try again or select a faster provider."
        )
    except HTTPException as e:
        # Re-raise FastAPI HTTPExceptions
        raise e
    except Exception as e:
        # If any other error occurs after credit decrement, attempt to rollback
        if user_id and 'credit_decrement_result' in locals() and credit_decrement_result.data:
            try:
                supabase.rpc('increment_credits', {'user_id_input': str(user_id)}).execute()
            except Exception:
                pass
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
