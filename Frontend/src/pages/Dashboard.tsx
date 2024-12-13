import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../utils/axiosInstance";
import L from "leaflet";

// Define a type for Robot data
interface Robot {
  id: string; // maps to robot_id
  online: boolean; // maps to online_status
  battery: number; // maps to battery_percentage
  cpu_usage: number; // maps to cpu_usage
  ram_consumption: number; // maps to ram_consumption
  last_updated: string; // maps to last_updated (ISO format)
  location: [number, number]; // maps to location_coordinates
}

const Dashboard: React.FC = () => {
  const [robots, setRobots] = useState<Robot[]>([]);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await axiosInstance.get("/robots");
        const data = response.data.map((robot: any) => ({
          id: robot.robot_id,
          online: robot.online_status,
          battery: robot.battery_percentage,
          cpu_usage: robot.cpu_usage,
          ram_consumption: robot.ram_consumption,
          last_updated: robot.last_updated,
          location: robot.location_coordinates,
        }));
        setRobots(data);
      } catch (error) {
        console.error("Failed to fetch robots:", error);
      }
    };

    fetchRobots();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Robot Fleet Monitoring Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your fleet of robots in real-time</p>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Robot Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Robot Details</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Robot ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Battery (%)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">CPU (%)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">RAM (%)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {robots.map((robot) => (
                <tr
                  key={robot.id}
                  className={`${
                    robot.online
                      ? robot.battery < 20
                        ? "bg-red-100"
                        : ""
                      : "bg-gray-100"
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-2">{robot.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{robot.online ? "Online" : "Offline"}</td>
                  <td className="border border-gray-300 px-4 py-2">{robot.battery}%</td>
                  <td className="border border-gray-300 px-4 py-2">{robot.cpu_usage}%</td>
                  <td className="border border-gray-300 px-4 py-2">{robot.ram_consumption}%</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(robot.last_updated).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Map View */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Robot Locations</h2>
          <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true} style={{ height: "500px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
            {robots.map((robot) => (
              <Marker
                key={robot.id}
                position={robot.location}
                title={`Robot ID: ${robot.id}`}
                icon={new L.Icon({
                  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                  shadowSize: [41, 41],
                })}
              >
                <Popup>
                  <p><strong>ID:</strong> {robot.id}</p>
                  <p><strong>Status:</strong> {robot.online ? "Online" : "Offline"}</p>
                  <p><strong>Battery:</strong> {robot.battery}%</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
