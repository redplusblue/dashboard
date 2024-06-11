// Send alerts using ntfy at localhost:PORT
const PORT = 1234;
/**
 *
 * @param {String} channel The Channel to send the notification to (e.g. "Test", "misc")
 * @param {String} message The message to send
 * @param {String} priority The priority of the message (1..5)
 * @param {String} title The title of the notification
 * @param {String} tags The tags of the notification corresponding to emojis (e.g. "blush", https://docs.ntfy.sh/emojis/)
 */
async function ntfy(channel, message, priority, title, tags) {
  const url = `http://localhost:${PORT}/` + channel;
  const headers = {
    title: title,
    priority: priority,
    tags: tags,
  };
  await fetch(url, {
    method: "POST",
    body: message,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

module.exports = ntfy;
