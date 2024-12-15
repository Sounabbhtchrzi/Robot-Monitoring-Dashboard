# Robot Fleet Monitoring Dashboard

A comprehensive dashboard for monitoring robot fleets in real-time. It provides detailed information about each robot and visualizes their positions on a map.
- Live link: https://robot-monitoring-dashboard.netlify.app

## Features

- **Robot Details**: Displays the following details for each robot:
  - Robot ID
  - Online/offline status
  - Battery percentage
  - CPU usage
  - RAM consumption
  - Location coordinates
- **Real-time Updates**: Periodic polling ensures the dashboard stays up-to-date.
- **Map View**: Visualize the robots' current positions on a map using [Leaflet](https://leafletjs.com/).

## Technologies Used

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python
- **Data Handling**: FastAPI handles API endpoints to provide real-time data for the dashboard.

### Frontend
- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **Language**: TypeScript
- **Mapping Library**: [Leaflet](https://leafletjs.com/)

## Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js (LTS version recommended)
- npm or yarn

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Sounabbhtchrzi/Robot-Monitoring-Dashboard.git
   cd Robot-Monitoring-Dashboard/Backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv env
   source env/bin/activate # On Windows use `env\Scripts\activate`
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

5. Access the API documentation at `http://localhost:8000/docs`.

### Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the provided URL (e.g., `http://localhost:5173`).


