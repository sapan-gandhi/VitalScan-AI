"""
run.py — Works for both local dev and production (Render/Railway)
"""
import os
import uvicorn
from app.config.settings import get_settings

if __name__ == "__main__":
    settings = get_settings()
    port = int(os.environ.get("PORT", settings.app_port))
    uvicorn.run(
        "app.main:app",
        host=settings.app_host,
        port=port,
        reload=(settings.app_env == "development"),
        log_level="info",
    )
