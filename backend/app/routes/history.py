"""
GET /history
────────────
Returns paginated prediction history records from Supabase.

Query params:
  limit  – number of records to return (default 20, max 100)
  offset – pagination offset (default 0)
"""

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.response_schema import HistoryResponse, HistoryRecord, ErrorResponse
from app.services.supabase_service import fetch_history
from app.utils.logger import logger

router = APIRouter()


@router.get(
    "/history",
    response_model=HistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve prediction history",
    description="Returns previous disease risk prediction records, newest first.",
    responses={
        500: {"model": ErrorResponse, "description": "Database error"},
    },
)
async def get_history(
    limit:  int = Query(default=20, ge=1, le=100, description="Records per page"),
    offset: int = Query(default=0,  ge=0,         description="Pagination offset"),
):
    logger.info(f"History request | limit={limit}, offset={offset}")

    try:
        rows = fetch_history(limit=limit, offset=offset)

        records = [HistoryRecord(**row) for row in rows]

        return HistoryResponse(
            message="History retrieved successfully",
            count=len(records),
            data=records,
        )

    except Exception as exc:
        logger.error(f"History fetch error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
