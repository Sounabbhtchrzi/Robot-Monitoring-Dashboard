from fastapi import FastAPI
from app.routes.robots import router as robots_router
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get frontend URL from the environment variable
frontend_url = os.getenv("FRONTEND_URL") 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],  
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include robot routes
app.include_router(robots_router)

@app.get("/")
def root():
    return {"message": "Robot Monitoring API is running!"}
