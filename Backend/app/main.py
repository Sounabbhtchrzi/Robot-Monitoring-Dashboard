from fastapi import FastAPI
from app.routes.robots import router as robots_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace '*' with the specific origin(s) you want to allow
    allow_methods=["http://localhost:5173"],
    allow_headers=["http://localhost:5173"],
)
# Include robot routes
app.include_router(robots_router)

@app.get("/")
def root():
    return {"message": "Robot Monitoring API is running!"}
