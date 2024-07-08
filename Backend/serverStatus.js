const fs = require("fs").promises;
const http = require("http");
const https = require("https");

// Links to bypass SSL verification for
const bypassSSLFor = [];

async function checkServerStatus() {
  try {
    let serverInfo = await fs.readFile(
      "/path/to/src/data/serverInfo.json",
      "utf8"
    );
    serverInfo = JSON.parse(serverInfo);
    const timeoutDuration = 5000; // 5 seconds

    const serverStatus = [];
    for (const server of serverInfo) {
      const shouldBypassSSL = bypassSSLFor.includes(server.Link);
      // console.log(`Checking ${server.Name}, Bypass SSL: ${shouldBypassSSL}`);

      if (server.Server === "Minecraft Server") {
        serverStatus.push(await checkMinecraftServerStatus());
      } else {
        serverStatus.push(
          await checkWebServerStatus(
            server.Link,
            timeoutDuration,
            0,
            shouldBypassSSL
          )
        );
      }
    }
    return serverStatus;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function checkMinecraftServerStatus() {
  try {
    const timeoutDuration = 5000; // 5 seconds

    return new Promise((resolve) => {
      const request = http.request("http://localhost:25565", {
        method: "HEAD",
      });

      request.setTimeout(timeoutDuration, () => {
        request.abort();
        resolve(0);
      });

      request.on("response", (response) => {
        if (response.statusCode === 200) {
          resolve(1);
        } else if (response.statusCode === 52) {
          resolve(0);
        }
        request.end();
      });

      request.on("error", (error) => {
        if (error.code === "ECONNRESET") {
          resolve(1);
        } else if (error.code === "ECONNREFUSED") {
          resolve(0);
        } else {
          console.error("Error:", error);
          resolve(0);
        }
        request.end();
      });

      request.end();
    });
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
}

async function checkWebServerStatus(
  url,
  timeout,
  redirectCount = 0,
  bypassSSL = false
) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith("http") || redirectCount > 5) {
      console.error("Invalid URL or too many redirects:", url);
      resolve(0);
      return;
    }

    // console.log(`Checking ${url}, Bypass SSL: ${bypassSSL}`);
    const protocol = url.startsWith("https") ? https : http;

    const options = {
      timeout: timeout,
      rejectUnauthorized: !bypassSSL, // Note the ! here
    };

    const request = protocol.get(url, options, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        const redirectUrl = new URL(response.headers.location, url).href;
        checkWebServerStatus(
          redirectUrl,
          timeout,
          redirectCount + 1,
          bypassSSL
        ).then(resolve);
      } else {
        resolve(response.statusCode === 200 ? 1 : 0);
      }
    });

    request.on("error", (error) => {
      console.error("Error at", url, ":", error.message);
      resolve(0);
    });

    request.on("timeout", () => {
      console.log("Timeout at", url);
      request.abort();
      resolve(0);
    });
  });
}

// Test serverStatus
// checkServerStatus().then((serverStatus) => {
//   console.log(serverStatus);
// });

module.exports = { checkServerStatus, checkMinecraftServerStatus };
