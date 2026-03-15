"""
Supabase Service
────────────────
All database I/O in one place.  Routes call these functions —
they never touch the Supabase client directly.
"""

import json
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.db.supabase_client import get_supabase_client
from app.utils.logger import logger

TABLE = "prediction_history"


# ─── Write ────────────────────────────────────────────────────────────────────

def save_prediction(payload: Dict[str, Any]) -> Optional[Dict]:
    """
    Insert one prediction record into `prediction_history`.
    Returns the inserted row or None on failure.
    """
    try:
        client = get_supabase_client()

        # Supabase expects JSON-serialisable types
        # Convert recommendations list → JSON string if needed
        if isinstance(payload.get("recommendations"), list):
            payload["recommendations"] = json.dumps(payload["recommendations"])

        response = client.table(TABLE).insert(payload).execute()

        if response.data:
            logger.info(f"Prediction saved to Supabase: id={response.data[0].get('id')}")
            return response.data[0]

        logger.warning("Supabase insert returned no data.")
        return None

    except Exception as exc:
        logger.error(f"Failed to save prediction: {exc}")
        return None


# ─── Read ─────────────────────────────────────────────────────────────────────

def fetch_history(limit: int = 50, offset: int = 0) -> List[Dict]:
    """
    Fetch prediction history records, newest first.
    Returns an empty list on failure so the API stays healthy.
    """
    try:
        client = get_supabase_client()

        response = (
            client.table(TABLE)
            .select("*")
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )

        rows = response.data or []

        # Parse recommendations back from JSON string → list
        for row in rows:
            if isinstance(row.get("recommendations"), str):
                try:
                    row["recommendations"] = json.loads(row["recommendations"])
                except json.JSONDecodeError:
                    row["recommendations"] = []

        logger.info(f"Fetched {len(rows)} history records from Supabase.")
        return rows

    except Exception as exc:
        logger.error(f"Failed to fetch history: {exc}")
        return []


def fetch_record_by_id(record_id: str) -> Optional[Dict]:
    """Fetch a single prediction record by its UUID primary key."""
    try:
        client = get_supabase_client()
        response = (
            client.table(TABLE)
            .select("*")
            .eq("id", record_id)
            .single()
            .execute()
        )
        return response.data
    except Exception as exc:
        logger.error(f"Failed to fetch record {record_id}: {exc}")
        return None
