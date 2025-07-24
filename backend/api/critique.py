from fastapi import APIRouter, HTTPException
from schemas.critique import TextToCritique, CritiqueResponse
from core.llm_service import get_critique_from_llm

router = APIRouter()

@router.post("/critique", response_model=CritiqueResponse)
async def get_critique(text_to_critique: TextToCritique):
    try:
        return await get_critique_from_llm(text_to_critique)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while getting critiques: {e}") 