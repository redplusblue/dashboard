let subtitle = document.querySelector(".subtitle");
let statusBtn = document.querySelector(".realBtn");
let statusBtnText = document.querySelector(".realStatus");
// Get reference to the select element
const serverSelect = document.getElementById("serverSelect");
// Get currently selected server
let selectedServer = "SERVER_NAME";

serverSelect.addEventListener("change", (event) => {
  selectedServer = event.target.value;
});

statusBtn.addEventListener("click", () => {
  // Loading state
  statusBtnText.innerHTML = "Loading...";
  getServerStatus().then((status) => {
    if (status) {
      stopServer();
    } else {
      startServer();
    }
  });
});

// Check server status every second (this needs to be current)
setInterval(() => {
  getServerStatus().then((status) => {
    if (status) {
      subtitle.innerHTML = "Server Online!";
      subtitle.classList.add("online");
      subtitle.classList.remove("offline");
      statusBtnText.innerHTML = "Stop Server";
    } else {
      subtitle.innerHTML = "Server Offline!";
      subtitle.classList.add("offline");
      subtitle.classList.remove("online");
      statusBtnText.innerHTML = "Start Server";
    }
  });
}, 1000);

async function getServerStatus() {
  let status = await fetch(`/minecraft/status/${selectedServer}`).then((res) =>
    res.json()
  );
  return status.serverStatus;
}

function startServer() {
  fetch(`/minecraft/start/${selectedServer}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => console.log(data.message))
    .catch((error) => console.error(error));
}

function stopServer() {
  fetch(`/minecraft/stop/${selectedServer}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => console.log(data.message))
    .catch((error) => console.error(error));
}

// Manual Server List
const servers = ["SERVER", "SERVER2", "SERVER3", "SERVER4", "SERVER5"];
servers.forEach((server) => {
  const option = document.createElement("option");
  option.text = server;
  option.value = server;
  serverSelect.appendChild(option);
});

// Fetch the servers.json file -> RM
// fetch("public/servers.json")
//   .then((response) => response.json())
//   .then((data) => {
//     // Iterate over the array and create an option element for each server
//     data.forEach((server) => {
//       const option = document.createElement("option");
//       option.text = server;
//       option.value = server;
//       serverSelect.appendChild(option);
//     });
//   })
//   .catch((error) => console.error("Error fetching servers:", error));
