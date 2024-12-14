import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../utils/axiosInstance";
import L from "leaflet";
import { PieChart } from "react-minimal-pie-chart";

// Define a type for Robot data
interface Robot {
  id: string; 
  online: boolean; 
  battery: number; 
  cpu_usage: number; 
  ram_consumption: number; 
  last_updated: string; 
  location: [number, number];
}

const Dashboard: React.FC = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterOnline, setFilterOnline] = useState<boolean | null>(null); // Filter by online status
  const [filterBattery, setFilterBattery] = useState<number>(0);
  const [filterRobotId, setFilterRobotId] = useState("");

  const robotsPerPage = 10;

  const filteredRobots = robots.filter((robot) =>
  (filterOnline === null || robot.online === filterOnline) &&
  robot.battery >= filterBattery &&
  (filterRobotId === "" || robot.id.includes(filterRobotId))
);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRobots.length / robotsPerPage);

  // Determine robots to display for the current page
  const currentRobots = filteredRobots.slice(
    (currentPage - 1) * robotsPerPage,
    currentPage * robotsPerPage
  );

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

    const interval = setInterval(fetchRobots, 5000);

    return () => clearInterval(interval);

  }, []);

  const getBatteryColor = (battery: number) => {
    if (battery < 15) return "bg-red-600";
    if (battery < 50) return "bg-yellow-600";
    return "bg-green-600";
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-200 min-h-screen">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-100">Robot Fleet Monitoring Dashboard</h1>
       
      </header>

       {/* <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8"> */}
        <div className="flex flex-wrap items-center space-x-4 mb-4">

          {/* Robot ID Search */}
          <div>
            <label className="text-gray-400">Search Robot ID:</label>
            <input
              type="text"
              className="ml-2 bg-gray-700 text-gray-300 rounded px-2 py-1"
              placeholder="Enter Robot ID"
              value={filterRobotId}
              onChange={(e) => setFilterRobotId(e.target.value)}
            />
          </div>

          {/* Online Status Filter */}
          <div>
            <label className="text-gray-400">Online Status:</label>
            <select
              className="ml-2 bg-gray-700 text-gray-300 rounded px-2 py-1"
              value={filterOnline === null ? "" : filterOnline.toString()}
              onChange={(e) =>
                setFilterOnline(
                  e.target.value === ""
                    ? null
                    : e.target.value === "true"
                )
              }
            >
              <option value="">All</option>
              <option value="true">Online</option>
              <option value="false">Offline</option>
            </select>
          </div>

          {/* Battery Filter */}
          <div>
            <label className="text-gray-400">Min Battery:</label>
            <input
              type="number"
              className="ml-2 bg-gray-700 text-gray-300 rounded px-2 py-1 w-16"
              value={filterBattery}
              onChange={(e) => setFilterBattery(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          
        </div>
      {/* </div> */}

      {/* Robot Details */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Robot Details</h2>
          
          <div className="space-y-6">
            {currentRobots.map((robot, index) => (
              <div
                key={robot.id}
                className="p-4 border border-gray-700 rounded-md shadow-sm grid grid-cols-[50px_repeat(5,1fr)] gap-4 bg-gray-850"
              >
                {/* Serial Number */}
                <div className="text-center">
                  <h3 className="text-gray-400 font-semibold mb-10">Sl No</h3>
                  <p className="text-gray-200 font-medium">{(currentPage - 1) * robotsPerPage + index + 1}</p>
                </div>

                {/* Robot ID */}
                <div className="text-center">
                  <h3 className="text-gray-400 font-semibold mb-10">Robot ID</h3>
                  <p className="text-gray-200 font-medium">{robot.id}</p>
                </div>

                {/* Online Status */}
                <div className="text-center">
                  <h3 className="text-gray-400 font-semibold mb-10">Online Status</h3>
                  <div
                    className={`text-center font-bold px-4 py-2 rounded-lg text-white ${
                      robot.online ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {robot.online ? "Online" : "Offline"}
                  </div>
                </div>

                {/* Battery */}
                <div className="text-center">
                  <h3 className="text-gray-400 font-semibold mb-10">Battery</h3>
                  <div className="relative inline-block w-6 h-20 bg-gray-700 rounded-lg overflow-hidden">
                    <div
                      className={`${getBatteryColor(robot.battery)} absolute bottom-0 left-0 w-full`}
                      style={{ height: `${robot.battery}%` }}
                    ></div>
                  </div>
                  <span className="block mt-1 text-sm font-medium text-gray-400">{robot.battery}%</span>
                </div>

                {/* CPU Usage */}
                <div className="text-center">
                  <h3 className="text-gray-400 font-semibold">CPU Usage</h3>
                  <PieChart
                    data={[{ value: robot.cpu_usage, color: "#3182CE" }]}
                    totalValue={100}
                    lineWidth={15}
                    rounded
                    animate
                    label={({ dataEntry }) => `${dataEntry.value}%`}
                    labelStyle={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      fill: "#D1D5DB",
                    }}
                    labelPosition={0}
                  />
                </div>

                {/* RAM Consumption */}
                <div className="text-center">
                  <h3 className="text-gray-400 font-semibold">RAM Consumption</h3>
                  <PieChart
                    data={[{ value: robot.ram_consumption, color: "#F6AD55" }]}
                    totalValue={10000}
                    lineWidth={15}
                    rounded
                    animate
                    label={({ dataEntry }) => `${dataEntry.value}`}
                    labelStyle={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      fill: "#D1D5DB",
                    }}
                    labelPosition={0}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>


      {/* Map View */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Robot Locations</h2>
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
        {currentRobots.map((robot) => (
          <Marker
            key={robot.id}
            position={robot.location}
            title={`Robot ID: ${robot.id}`}
            icon={new L.Icon({
              iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
              iconSize: [15, 25],
              iconAnchor: [7.5, 25],
              popupAnchor: [1, -20],
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
              shadowSize: [25, 25],
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
  );
};

export default Dashboard;
