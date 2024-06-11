const fs = require("fs").promises;
const http = require("http");

const PATH_TO_SERVER_INFO = "./Dashboard/src/data/serverInfo.json";
// Change if Minecraft server is running on a different port
const MINECRAFT_PORT = 25565;

async function checkServerStatus() {
  try {
    // Asynchronously read file
    let serverInfo = await fs.readFile(PATH_TO_SERVER_INFO, "utf8");
    serverInfo = JSON.parse(serverInfo);

    // Timeout duration in milliseconds
    const timeoutDuration = 5000; // 5 seconds

    // Array to hold promises of server status checks
    const statusPromises = serverInfo.map((server) => {
      // Special Case: Minecraft Server
      if (server.Server === "Minecraft Server") {
        return checkMinecraftServerStatus();
      }
      return new Promise((resolve) => {
        // Create a new request
        const request = http.request(
          server.Link,
          { method: "HEAD" },
          (response) => {
            // If the request was successful, resolve with 1
            if (response.statusCode === 200) {
              resolve(1);
            } else {
              // If the request was not successful, resolve with 0
              resolve(0);
            }
            // Close the connection after receiving a response
            request.end();
          }
        );

        // Handle errors during the request
        request.on("error", () => {
          // Reject the promise with -1
          resolve(0);
          // Close the connection in case of error
          request.end();
        });

        // Set a timeout for the request
        request.setTimeout(timeoutDuration, () => {
          // Resolve with -1 if the request times out
          resolve(0);
          // Abort the request to close the connection
          request.abort();
        });

        // End the request
        request.end();
      });
    });

    // Await all promises
    const serverStatus = await Promise.all(statusPromises);
    return serverStatus;
  } catch (error) {
    console.error("Error:", error);
    // Return an empty array if there's an error
    return [];
  }
}

async function checkMinecraftServerStatus() {
  try {
    // Timeout duration in milliseconds
    const timeoutDuration = 5000; // 5 seconds

    // Create a new request
    const request = http.request(`http://localhost:${MINECRAFT_PORT}`, {
      method: "HEAD",
    });

    // Return a promise to handle the server status
    return new Promise((resolve) => {
      // Set a timeout for the request
      request.setTimeout(timeoutDuration, () => {
        // Resolve with -1 if the request times out
        // resolve(-1);
        // Abort the request to close the connection
        request.abort();
      });

      // Handle response from the server
      request.on("response", (response) => {
        if (response.statusCode === 200) {
          // If the request was successful, resolve with 1
          resolve(1);
        } else if (response.statusCode === 52) {
          // If the server is active but returns an empty reply, resolve with 0
          resolve(0);
        }
        // Close the connection after receiving a response
        request.end();
      });

      // Handle errors during the request
      request.on("error", (error) => {
        if (error.code === "ECONNRESET") {
          // If the connection was reset by the server, resolve with 1
          resolve(1);
        } else if (error.code === "ECONNREFUSED") {
          // If the connection was refused, resolve with 0
          resolve(0);
        } else {
          // For other errors, reject the promise with -1
          console.error("Error:", error);
        }
        // Close the connection in case of error
        request.end();
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { checkServerStatus, checkMinecraftServerStatus };
