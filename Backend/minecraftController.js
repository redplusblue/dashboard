const { spawn } = require("child_process");
// Import ntfy from Alert.js
const ntfy = require("./Alert");

const defaultDir = "/home/minecraft"; // Directory where Minecraft server is located
const minecraftJar = "minecraft_server_1.20.4.jar"; // Minecraft server JAR file, varies
const javaArgs = ["-Xms1024M", "-Xmx16G", "-jar", minecraftJar, "nogui"]; // Arguments for Java process with memory allocation in the range of 1GB to 16GB (can be changed)

let serverProcesses = {}; // Object to store server processes

// Function to start the Minecraft server
const startMinecraftServer = (name) => {
  let minecraftDir = defaultDir + "/" + name;
  let serverProcess = null;
  // Send a notification that the server is starting
  ntfy(
    "misc",
    "Starting server " + name,
    3,
    "Minecraft Server Starting",
    "burrito "
  );
  return new Promise((resolve, reject) => {
    serverProcess = spawn("/usr/bin/java", javaArgs, {
      cwd: minecraftDir, // Set the current working directory
    });

    serverProcess.stdout.on("data", (data) => {
      // Prints out server logs
      // console.log(`[Minecraft Server] ${data}`);
    });

    serverProcess.stderr.on("data", (data) => {
      console.error(`[Minecraft Server Error] ${data}`);
    });

    serverProcess.on("close", (code) => {
      console.log(`[Minecraft Server] Exited with code ${code}`);
      serverProcess = null;
      resolve();
    });

    serverProcess.on("error", (err) => {
      console.error("[Minecraft Server] Error:", err);
      serverProcess = null;
      reject(err);
    });

    serverProcesses[name] = serverProcess;
  });
};

// Function to stop the Minecraft server
const stopMinecraftServer = (name) => {
  let serverProcess = serverProcesses[name];
  // Send a notification that the server is stopping
  ntfy(
    "misc",
    "Stopping server " + name,
    3,
    "Minecraft Server Stopping",
    "yawning_face"
  );
  return new Promise((resolve, reject) => {
    if (serverProcess !== null) {
      serverProcess.stdin.write("/stop\n");
      serverProcess.stdin.end();

      serverProcess.on("exit", () => {
        serverProcess = null;
        serverProcesses[name] = null;
        resolve();
      });
    } else {
      reject(new Error("Server is not running."));
    }
  });
};

// Function to check if the Minecraft server is running
const isServerRunning = (name) => {
  let serverProcess = serverProcesses[name];
  return serverProcess !== undefined && serverProcess !== null;
};

const isAnyServerRunning = () => {
  return Object.keys(serverProcesses).length > 0;
};

// Function to send a custom command to the Minecraft server
const sendCustomCommand = (name, command) => {
  let serverProcess = serverProcesses[name];
  return new Promise((resolve, reject) => {
    if (serverProcess !== null) {
      serverProcess.stdin.write(`${command}\n`);
      resolve();
    } else {
      reject(new Error("Server is not running."));
    }
  });
};

module.exports = {
  startMinecraftServer,
  stopMinecraftServer,
  isServerRunning,
  isAnyServerRunning,
  sendCustomCommand,
};
