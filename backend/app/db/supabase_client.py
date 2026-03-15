"""
Supabase client singleton.

Usage anywhere in the app:
    from app.db.supabase_client import get_supabase_client
    client = get_supabase_client()
"""

from supabase import create_client, Client
from app.config.settings import get_settings
from app.utils.logger import logger
from functools import lru_cache


@lru_cache()
def get_supabase_client() -> Client:
    """
    Create and cache a single Supabase client for the lifetime of the process.
    Raises a clear RuntimeError if credentials are missing.
    """
    settings = get_settings()

    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_KEY must be set in your .env file. "
            "Copy .env.example → .env and fill in your Supabase project credentials."
        )

    try:
        client: Client = create_client(settings.supabase_url, settings.supabase_key)
        logger.info("Supabase client initialised successfully.")
        return client
    except Exception as exc:
        logger.error(f"Failed to initialise Supabase client: {exc}")
        raise RuntimeError(f"Supabase connection error: {exc}") from exc
