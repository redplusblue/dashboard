import "../styles/App.css";
import PropTypes from "prop-types";
import serverInfo from "../data/serverInfo.json";
import ServerStatus from "./ServerStatus";
import * as icons from "../scripts/icons";

const App = ({ statuses }) => {
  const serverStatuses = serverInfo.map((server) => {
    return {
      Server: server.Server,
      Link: server.Link,
      Name: server.Name,
      Status: server.Status,
    };
  });

  return (
    <>
      <div className="server-container">
        {serverStatuses.map((server, index) => (
          <div
            key={index}
            className={"server " + (statuses[index] == 0 ? "down" : "up")}
            title={server.Server}
          >
            <img src={icons[server.Name]} alt={server.Name} />
            <div className="server-info">
              <div className="table-wrapper">
                <div className="row">
                  <div className="col">Hostname:</div>
                  <div className="name">{server.Name}</div>
                </div>
                <div className="row">
                  <div className="col">Status:</div>
                  <div className="status">
                    <ServerStatus server={index} statuses={statuses} />
                  </div>
                </div>
                <div className="row">
                  <div className="col">Address:</div>
                  <div className="link">
                    <a href={server.Link}>{server.Name}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
// Prop validation
App.propTypes = {
  statuses: PropTypes.array.isRequired,
};

export default App;
