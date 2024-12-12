from fastapi import FastAPI
from app.routes.robots import router as robots_router

app = FastAPI()

# Include robot routes
app.include_router(robots_router)

@app.get("/")
def root():
    return {"message": "Robot Monitoring API is running!"}
