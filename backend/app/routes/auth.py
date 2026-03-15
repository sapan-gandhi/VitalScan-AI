"""
Auth Routes — /api/v1/auth
──────────────────────────
Uses Supabase Auth (built-in) for:
  POST /api/v1/auth/register   — create account
  POST /api/v1/auth/login      — sign in, returns JWT
  POST /api/v1/auth/logout     — invalidate session
  GET  /api/v1/auth/me         — get current user profile
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from app.db.supabase_client import get_supabase_client
from app.utils.logger import logger

router = APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)


# ─── Request / Response schemas ───────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Minimum 6 characters")
    full_name: str = Field(..., min_length=2, max_length=100)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "secret123",
                "full_name": "John Doe"
            }
        }


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "secret123"
            }
        }


class AuthResponse(BaseModel):
    success: bool
    message: str
    user: dict = {}
    access_token: str = ""


# ─── Dependency: extract + verify JWT from Authorization header ───────────────

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please login.",
        )
    try:
        client = get_supabase_client()
        response = client.auth.get_user(credentials.credentials)
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token.",
            )
        return response.user
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Token verification failed: {exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed.",
        )


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post(
    "/auth/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(payload: RegisterRequest):
    logger.info(f"Register attempt: {payload.email}")
    try:
        client = get_supabase_client()

        # Create user in Supabase Auth
        response = client.auth.sign_up({
            "email": payload.email,
            "password": payload.password,
            "options": {
                "data": {"full_name": payload.full_name}
            }
        })

        if not response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed. Email may already be in use.",
            )

        logger.info(f"User registered: {response.user.id}")

        return AuthResponse(
            success=True,
            message="Account created successfully! You can now log in.",
            user={
                "id": response.user.id,
                "email": response.user.email,
                "full_name": payload.full_name,
            },
            access_token=response.session.access_token if response.session else "",
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Register error: {exc}")
        # Surface the Supabase error message cleanly
        msg = str(exc)
        if "already registered" in msg.lower() or "already been registered" in msg.lower():
            raise HTTPException(status_code=400, detail="This email is already registered.")
        raise HTTPException(status_code=400, detail=f"Registration failed: {msg}")


@router.post(
    "/auth/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Login and receive JWT",
)
async def login(payload: LoginRequest):
    logger.info(f"Login attempt: {payload.email}")
    try:
        client = get_supabase_client()

        response = client.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password,
        })

        if not response.user or not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        user_meta = response.user.user_metadata or {}
        logger.info(f"Login success: {response.user.id}")

        return AuthResponse(
            success=True,
            message="Login successful!",
            user={
                "id": response.user.id,
                "email": response.user.email,
                "full_name": user_meta.get("full_name", ""),
            },
            access_token=response.session.access_token,
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Login error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )


@router.post(
    "/auth/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout current session",
)
async def logout(current_user=Depends(get_current_user)):
    try:
        client = get_supabase_client()
        client.auth.sign_out()
        return {"success": True, "message": "Logged out successfully."}
    except Exception as exc:
        logger.error(f"Logout error: {exc}")
        return {"success": True, "message": "Logged out."}


@router.get(
    "/auth/me",
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user",
)
async def get_me(current_user=Depends(get_current_user)):
    meta = current_user.user_metadata or {}
    return {
        "success": True,
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": meta.get("full_name", ""),
            "created_at": str(current_user.created_at),
        }
    }
