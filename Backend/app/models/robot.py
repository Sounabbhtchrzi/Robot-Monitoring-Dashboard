from pydantic import BaseModel, Field
from typing import Tuple
from datetime import datetime

class Robot(BaseModel):
    robot_id: str = Field(..., title="Robot ID", description="Unique identifier for the robot")
    online_status: bool = Field(..., title="Online Status", description="True if the robot is online, False otherwise")
    battery_percentage: int = Field(..., ge=0, le=100, title="Battery Percentage", description="Battery level of the robot")
    cpu_usage: int = Field(..., ge=0, le=100, title="CPU Usage", description="CPU usage percentage")
    ram_consumption: int = Field(..., ge=0, title="RAM Consumption", description="RAM consumption in MB")
    last_updated: datetime = Field(..., title="Last Updated", description="Timestamp of the last update")
    location_coordinates: Tuple[float, float] = Field(..., title="Location Coordinates", description="Latitude and longitude of the robot's location")

    class Config:
        schema_extra = {
            "example": {
                "robot_id": "robot_123",
                "online_status": True,
                "battery_percentage": 85,
                "cpu_usage": 60,
                "ram_consumption": 2048,
                "last_updated": "2024-12-12T11:00:00",
                "location_coordinates": (34.0522, -118.2437),
            }
        }
