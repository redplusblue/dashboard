import React from "react";
import ProgressBar from "./ProgressBar";
import "../styles/Dashboard.css";
import PropTypes from "prop-types";

const Dashboard = ({ systemData }) => {
  return (
    <>
      <div className="system-container">
        {systemData && (
          <div className="server-sys">
            <div className="table-wrapper">
              <div className="row">
                <div className="col">CPU:</div>
                <div>
                  <ProgressBar
                    percentage={systemData.cpuUsage.currentLoad}
                    temp={systemData.temperatures.main}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">Memory:</div>
                <div>
                  <ProgressBar percentage={systemData.memory.usagePercentage} />
                </div>
              </div>
              <div className="row">
                <div className="col">Disk:</div>
                <div>
                  {systemData.disk.length > 0 && (
                    <div>
                      <ProgressBar
                        percentage={systemData.disk[0].usagePercentage}
                      />
                    </div>
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

export default Dashboard;
