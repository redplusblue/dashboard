import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/ServerStatus.css";

function ServerStatus({ server, statuses }) {
  const [status, setStatus] = useState("Checking...");

  // Update status whenever statuses change
  useEffect(() => {
    // Function to update server status
    const updateStatus = () => {
      if (statuses[server] === 1) {
        setStatus("Online");
      } else if (statuses[server] === 0) {
        setStatus("Offline");
      } else {
        setStatus("Checking...");
      }
    };
    updateStatus();
  }, [server, statuses]);

  return (
    <div className={getStatusClass(status) + "-text"}>
      <span className={"dot " + getStatusClass(status)}></span>
      {" " + status}
    </div>
  );
}

// Function to get status class
const getStatusClass = (status) => {
  if (status.toLowerCase() === "online" || status.toLowerCase() === "offline") {
    return status.toLowerCase();
  } else {
    return "";
  }
};
ServerStatus.propTypes = {
  server: PropTypes.number.isRequired,
  statuses: PropTypes.array.isRequired,
};

export default ServerStatus;
