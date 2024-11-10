const express = require("express");
const si = require("systeminformation");
const app = express();
const portEnv = process.env.PORT;
const port = portEnv ? parseInt(portEnv) : 1234;

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
    const memData = await si.mem();
    const actuallyUsed =
      memData.total - memData.free - memData.buffers - memData.cached;

    const systemData = {
      serverName: "HomeServer",
      os: await si.osInfo(),
      cpu: await si.cpu(),
      cpuUsage: await si.currentLoad().then((data) => ({
        currentLoad: data.currentLoad.toFixed(2),
        coreLoads: data.cpus.map((cpu) => cpu.load.toFixed(2)),
      })),
      memory: {
        total: (memData.total / 1024 / 1024 / 1024).toFixed(2),
        used: (actuallyUsed / 1024 / 1024 / 1024).toFixed(2),
        usagePercentage: ((actuallyUsed / memData.total) * 100).toFixed(2),
        cached: (memData.cached / 1024 / 1024 / 1024).toFixed(2),
        buffers: (memData.buffers / 1024 / 1024 / 1024).toFixed(2),
      },
      disk: await si.fsSize().then((data) =>
        data.map((disk) => ({
          fs: disk.fs,
          type: disk.type,
          size: (disk.size / 1024 / 1024 / 1024).toFixed(2),
          used: (disk.used / 1024 / 1024 / 1024).toFixed(2),
          usagePercentage: ((disk.used / disk.size) * 100).toFixed(2),
        }))
      ),
      uptime: si.time().uptime,
      processes: await si.processes().then((data) => ({
        all: data.all,
        running: data.running,
        blocked: data.blocked,
        sleeping: data.sleeping,
      })),
      network: await si.networkStats().then((data) =>
        data.map((iface) => ({
          iface: iface.iface,
          rxBytes: (iface.rx_bytes / 1024 / 1024).toFixed(2),
          txBytes: (iface.tx_bytes / 1024 / 1024).toFixed(2),
        }))
      ),
      temperatures: await si.cpuTemperature(),
      services: await si.services("*"),
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
