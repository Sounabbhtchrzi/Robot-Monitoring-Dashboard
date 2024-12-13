from fastapi import APIRouter
from app.services.data_loader import load_robot_data
from app.utils.data_store import robots_store

router = APIRouter(prefix="/robots", tags=["Robots"])

# Load robot data on startup
load_robot_data()

@router.get("/")
def get_all_robots():
    """Fetch all robot telemetry data."""
    return robots_store[0:10]

@router.get("/{robot_id}")
def get_robot_by_id(robot_id: str):
    """Fetch a single robot's telemetry data."""
    robot = next((robot for robot in robots_store if robot.robot_id == robot_id), None)
    if not robot:
        return {"error": "Robot not found"}
    return robot
