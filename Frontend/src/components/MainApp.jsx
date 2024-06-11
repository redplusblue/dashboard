import { useState, useEffect } from "react";
import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";
import "../styles/media.css";

const MainApp = () => {
  const [statuses, setStatuses] = useState([-1, -1, -1, -1, -1]);
  const [systemData, setSystemData] = useState(null);

  useEffect(() => {
    // Function to fetch server statuses from the server
    const fetchServerStatuses = async () => {
      try {
        const response = await fetch("/api/server-status");
        if (response.ok) {
          const serverStatuses = await response.json();
          setStatuses([...serverStatuses]);
        } else {
          console.error("[SERVERS] Failed to fetch server statuses");
        }
      } catch (error) {
        console.error("Error fetching server statuses:", error);
      }
    };
    // Function to fetch system data from the server
    const fetchData = async () => {
      try {
        const response = await fetch("/api/system");
        if (response.ok) {
          const data = await response.json();
          setSystemData(data);
        } else {
          console.error("[SYSTEM] Failed to fetch system data");
        }
      } catch (error) {
        console.error("Error fetching system data:", error);
      }
    };
    fetchServerStatuses();
    fetchData();
    // Poll for server statuses, data every 10 seconds
    const interval = setInterval(() => {
      fetchServerStatuses();
      fetchData();
    }, 10000);

    // Cleanup function to clear interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <>
      <App statuses={statuses} />
      <Dashboard systemData={systemData}></Dashboard>
    </>
  );
};

export default MainApp;
