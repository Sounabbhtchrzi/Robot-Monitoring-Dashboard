import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
//import L from "leaflet";

// Define a type for Robot data
interface Robot {
  id: string;
  online: boolean;
  battery: number;
  cpu_usage: number;
  ram_consumption: number;
  last_updated: string; // ISO string for the timestamp
  location: [number, number]; // Latitude and Longitude
}

const Dashboard: React.FC = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await fetch("/robots");
        const data: Robot[] = await response.json();
        setRobots(data);
      } catch (error) {
        console.error("Failed to fetch robots:", error);
      }
    };

    fetchRobots();

    // const ws = new WebSocket("ws://localhost:8000/ws/robots");
    // setSocket(ws);

    // ws.onmessage = (event) => {
    //   try {
    //     const updatedRobots: Robot[] = JSON.parse(event.data);
    //     setRobots(updatedRobots);
    //   } catch (error) {
    //     console.error("Failed to parse WebSocket message:", error);
    //   }
    // };

    // return () => {
    //   if (ws) ws.close();
    // };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Robot Details */}
      <div className="col-span-2">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Robot ID</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Battery (%)</th>
              <th className="border border-gray-300 px-4 py-2">CPU (%)</th>
              <th className="border border-gray-300 px-4 py-2">RAM (%)</th>
              <th className="border border-gray-300 px-4 py-2">Last Updated</th>
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
                <td className="border border-gray-300 px-4 py-2">
                  {robot.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {robot.online ? "Online" : "Offline"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {robot.battery}%
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {robot.cpu_usage}%
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {robot.ram_consumption}%
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(robot.last_updated).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Map View */}
      <div className="col-span-1">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {robots.map((robot) => (
            <Marker
              key={robot.id}
              position={robot.location}
              title={`Robot ID: ${robot.id}`}
              icon={
                new L.Icon({
                  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                  shadowSize: [41, 41],
                })
              }
            >
              <Popup>
                <p>
                  <strong>ID:</strong> {robot.id}
                </p>
                <p>
                  <strong>Status:</strong> {robot.online ? "Online" : "Offline"}
                </p>
                <p>
                  <strong>Battery:</strong> {robot.battery}%
                </p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Dashboard;
