import ProgressBar from "./ProgressBar";
import "../styles/Dashboard.css";
import PropTypes from "prop-types";

const Dashboard = ({ systemData }) => {
  // Function to count the number of TCP sockets with a specific state
  const countSocketsByState = (sockets, state) => {
    return sockets.filter((socket) => socket.state === state).length;
  };

  // Function to calculate uptime in days and hours
  const calculateUptime = (uptimeInSeconds) => {
    const days = Math.floor(uptimeInSeconds / (3600 * 24));
    const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
    return `${days} days, ${hours} hours`;
  };

  return (
    <>
      <h2>System Dashboard</h2>
      <div className="system-container">
        {systemData && (
          <div className="server">
            <div className="table-wrapper">
              <div className="row">
                <div className="col">Server Name:</div>
                <div className="name">{systemData.serverName}</div>
              </div>
              <div className="row">
                <div className="col">OS:</div>
                <div className="name">
                  {"("}
                  {systemData.os.platform}
                  {") "} {systemData.os.distro} {systemData.os.release}{" "}
                  {systemData.os.arch}
                </div>
              </div>
              <div className="row">
                <div className="col">Memory:</div>
                <div>
                  <ProgressBar percentage={systemData.memoryUsage} />
                </div>
              </div>
              <div className="row">
                <div className="col">Disk:</div>
                <div>
                  <ProgressBar percentage={systemData.diskUsage} />
                </div>
              </div>
              <div className="row">
                <div className="col">Uptime:</div>
                <div>{calculateUptime(systemData.uptime)}</div>
              </div>
              <div className="row">
                <div className="col">Listening TCP Sockets:</div>
                <div>
                  {countSocketsByState(systemData.networkConnections, "LISTEN")}
                </div>
              </div>
              <div className="row">
                <div className="col">Established TCP Sockets:</div>
                <div>
                  {countSocketsByState(
                    systemData.networkConnections,
                    "ESTABLISHED"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
Dashboard.propTypes = {
  systemData: PropTypes.object,
};

/* 
<div className="row">
                <div className="col">Kernel:</div>
                <div className="name">
                  {systemData.os.kernel} {systemData.os.codename}
                </div>
              </div>
              <div className="row">
                <div className="col">CPU</div>
                <div className="name">
                  {systemData.cpu.manufacturer} {systemData.cpu.brand} {"("}
                  {systemData.cpu.physicalCores}
                  {"C/"}
                  {systemData.cpu.cores}
                  {"T) @"}
                  {systemData.cpu.speed}
                  {"GHz"}
                </div>
              </div>
*/

export default Dashboard;
