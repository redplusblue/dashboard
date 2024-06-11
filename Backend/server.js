const express = require("express");
const si = require("systeminformation");
const app = express();
const port = 1234;

// Check server status script
const { checkServerStatus } = require("./serverStatus");
const {
  startMinecraftServer,
  stopMinecraftServer,
  isServerRunning,
  isAnyServerRunning,
  sendCustomCommand,
} = require("./minecraftController");
const path = require("path");

// Middleware to parse JSON data
app.use(express.json());

// ALlow access to static files for all apps
// Dashboard from ./Dashboard/dist
app.use(express.static(__dirname + "/Frontend/dist"));
// MinecraftControl from ./MinecraftControl/dist -> Not added here yet
app.use(express.static(__dirname + "/Minecraft/dist"));

// HomeServer Dashboard from ./Dashboard/dist
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Frontend/dist/index.html");
});

// Server button
app.get("/minecraft", (req, res) => {
  res.sendFile(__dirname + "/Minecraft/dist/index.html");
});

app.get("/minecraft/status/:name", (req, res) => {
  try {
    const { name } = req.params;
    const serverStatus = isServerRunning(name);
    res.json({ serverStatus });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start custom server
app.post("/minecraft/start/:name", (req, res) => {
  try {
    const { name } = req.params;
    startMinecraftServer(name);
    if (isServerRunning(name)) {
      res.status(200).json({ message: "Server started successfully." });
    } else {
      res.status(500).json({ error: "Failed to start server." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/minecraft/stop/:name", async (req, res) => {
  try {
    const { name } = req.params;
    await stopMinecraftServer(name);
    res.status(200).json({ message: "Server stopped successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route handler to fetch server statuses
app.get("/api/server-status", async (req, res) => {
  try {
    // Call the function to check server statuses
    checkServerStatus().then((serverStatus) => {
      // Send the server statuses as a JSON response
      res.json(serverStatus);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// System API
app.get("/api/system", async (req, res) => {
  try {
    const systemData = {
      serverName: "Some Server Name",
      os: await si.osInfo(),
      cpuUsage: await si.currentLoad().then((data) => data.currentload),
      memoryUsage: await si
        .mem()
        .then((data) => ((data.used / data.total) * 100).toFixed(2)),
      diskUsage: await si
        .fsSize()
        .then((data) => ((data[0].used / data[0].size) * 100).toFixed(2)),
      uptime: si.time().uptime,
      totalProcesses: await si.processes().then((data) => data.all.length),
      system: await si.system(),
      cpu: await si.cpu(),
      networkConnections: await si.networkConnections(),
    };
    res.json(systemData);
  } catch (error) {
    console.error("Error fetching system data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// SSL
app.set("trust proxy", true);

// Start the server
app.listen(port, () => {
  console.log(`node.js server running at http://localhost:${port}`);
});
