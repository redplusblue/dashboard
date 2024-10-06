import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

const Header = ({ systemData }) => {
  const [digitalTime, setDigitalTime] = useState("00:00:00");
  const [binaryTime, setBinaryTime] = useState({
    hours: "000000",
    minutes: "000000",
    seconds: "000000",
  });

  const calculateUptime = (uptimeInSeconds) => {
    const days = Math.floor(uptimeInSeconds / (3600 * 24));
    const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    return `${days} days, ${hours} hours & ${minutes} minutes`;
  };

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      // const hours = date.getHours().toString().padStart(2, "0");
      //hours in 12-hour format
      const hours = (((date.getHours() + 11) % 12) + 1)
        .toString()
        .padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      // const seconds = date.getSeconds().toString().padStart(2, "0");
      const AMorPM = date.getHours() >= 12 ? "PM" : "AM";

      setDigitalTime(`${hours}:${minutes} ${AMorPM}`);

      const binaryHours = date.getHours().toString(2).padStart(6, "0");
      const binaryMinutes = date.getMinutes().toString(2).padStart(6, "0");
      const binarySeconds = date.getSeconds().toString(2).padStart(6, "0");

      setBinaryTime({
        hours: binaryHours,
        minutes: binaryMinutes,
        seconds: binarySeconds,
      });
    };

    updateTime(); // Initial call to set the time immediately
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="header">
      <div className="logo-container">
        <div className="logo">HomeServer</div>
        <div className="logo-subtitle">
          {systemData.os.distro} {systemData.os.release} ({systemData.os.arch}){" "}
          {systemData.os.kernel}
        </div>
        <div className="logo-subtitle">
          Uptime: {calculateUptime(systemData.uptime)}
        </div>
        <div className="logo-subtitle">
          Proc: Total: {systemData.processes.all}, Running:{" "}
          {systemData.processes.running}; Serv: Running:{" "}
          {systemData.services.filter((service) => service.running).length}{" "}
        </div>
      </div>
      <div className="right">
        <div className="time">
          <div className="digital-clock">{digitalTime}</div>
          <div className="binary-clock">
            <table className="dashboard-clock-binary">
              <tbody>
                <tr className="hours">
                  {binaryTime.hours.split("").map((bit, index) => (
                    <td key={`h${index}`} className={`num${bit}`}></td>
                  ))}
                </tr>
                <tr className="minutes">
                  {binaryTime.minutes.split("").map((bit, index) => (
                    <td key={`m${index}`} className={`num${bit}`}></td>
                  ))}
                </tr>
                <tr className="seconds">
                  {binaryTime.seconds.split("").map((bit, index) => (
                    <td key={`s${index}`} className={`num${bit}`}></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <Dashboard systemData={systemData} />
        </div>
      </div>
    </div>
  );
};

export default Header;
