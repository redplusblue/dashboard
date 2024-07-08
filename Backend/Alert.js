// Send alerts using ntfy at localhost:PORT, Can use NTFY or Telegram
// const PORT = 1234;
// /**
//  *
//  * @param {String} channel The Channel to send the notification to (e.g. "Test", "misc")
//  * @param {String} message The message to send
//  * @param {String} priority The priority of the message (1..5)
//  * @param {String} title The title of the notification
//  * @param {String} tags The tags of the notification corresponding to emojis (e.g. "blush", https://docs.ntfy.sh/emojis/)
//  */
// async function ntfy(channel, message, priority, title, tags) {
//   const url = `http://localhost:${PORT}/` + channel;
//   const headers = {
//     title: title,
//     priority: priority,
//     tags: tags,
//   };
//   await fetch(url, {
//     method: "POST",
//     body: message,
//     headers: {
//       "Content-Type": "application/json",
//       ...headers,
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Success:", data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// module.exports = ntfy;

// Send alerts using telegram bot via the command serversage <message>
// const { exec } = require("child_process");
// /**
//  *
//  * @param {String} message The message to send.
//  */
// const ntfy = (message) => {
//   exec(`serversage "${message}"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error}`);
//       return;
//     }
//     console.error(`stderr: ${stderr}`);
//   });
// };

// module.exports = ntfy;
