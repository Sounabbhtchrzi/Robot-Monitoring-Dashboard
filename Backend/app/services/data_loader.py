import json
from pathlib import Path
from app.models.robot import Robot
from app.utils.data_store import robots_store

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "fake_robot_data.json"

def load_robot_data():
    """Load robot data from robot_data.json file."""
    with open(DATA_PATH, "r") as file:
        data = json.load(file)
    for entry in data:
        robot = Robot(
            robot_id=entry["robot_id"],
            online_status=entry["online_status"],
            battery_percentage=entry["battery_percentage"],
            cpu_usage=entry["cpu_usage"],
            ram_consumption=entry["ram_consumption"],
            last_updated=entry["last_updated"],
            location_coordinates=tuple(entry["location_coordinates"]),
        )
        robots_store.append(robot)
