from fastapi import APIRouter, HTTPException, Request, Query, Body
import os
from supabase import create_client, Client

router = APIRouter(prefix="/api/history", tags=["history"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Supabase URL and Service Key must be set in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


@router.get("/")
async def get_history(request: Request, limit: int = Query(default=20, ge=1, le=100)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: No token provided")

    token = auth_header.split(" ")[1]
    user_response = supabase.auth.get_user(token)
    if not user_response or not user_response.user:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid token or user not found")

    user_id = str(user_response.user.id)

    try:
        result = (
            supabase
            .table("proposals")
            .select("id, generated_text, tone, model_used, created_at, is_favorite, job_descriptions(original_text, provider_used)")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )

        return {"success": True, "history": result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


@router.delete("/{proposal_id}")
async def delete_proposal(request: Request, proposal_id: str):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = auth_header.split(" ")[1]
    user_response = supabase.auth.get_user(token)
    if not user_response or not user_response.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        # Delete from DB (RLS will ensure only owner can delete)
        supabase.table("proposals").delete().eq("id", proposal_id).execute()
        return {"success": True, "message": "Proposal deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{proposal_id}/favorite")
async def toggle_favorite(request: Request, proposal_id: str, payload: dict = Body(...)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = auth_header.split(" ")[1]
    user_response = supabase.auth.get_user(token)
    if not user_response or not user_response.user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    is_favorite = payload.get("is_favorite", False)

    try:
        supabase.table("proposals").update({"is_favorite": is_favorite}).eq("id", proposal_id).execute()
        return {"success": True, "is_favorite": is_favorite}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
