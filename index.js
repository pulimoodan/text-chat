const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const fs = require("fs").promises;
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const FILE_DIR = "sessions"; // Directory to store session files
let sessions = {}; // Store active session content and user count in memory

// Ensure session storage directory exists
fs.mkdir(FILE_DIR, { recursive: true }).catch(console.error);

// Function to read session content from a file
const readSession = async (sessionKey) => {
  const filePath = path.join(FILE_DIR, `${sessionKey}.txt`);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (err) {
    return ""; // Return empty if file doesn't exist
  }
};

// Function to write session content to a file
const writeSession = async (sessionKey, content) => {
  const filePath = path.join(FILE_DIR, `${sessionKey}.txt`);
  try {
    await fs.writeFile(filePath, content, "utf8");
    console.log(`Session saved: ${sessionKey}`);
  } catch (err) {
    console.error("Error saving session:", err);
  }
};

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", async (socket) => {
  const sessionKey = socket.handshake.query.sessionKey; // Extract session key
  if (!sessionKey) {
    socket.disconnect();
    return;
  }

  console.log(`User connected to session: ${sessionKey}`);

  // Initialize session if it doesn't exist
  if (!sessions[sessionKey]) {
    sessions[sessionKey] = { content: await readSession(sessionKey), users: 0 };
  }

  sessions[sessionKey].users++;

  // Send current session content
  socket.emit("session-content", sessions[sessionKey].content);

  // Handle session updates
  socket.on("session-update", (content) => {
    sessions[sessionKey].content = content;
    io.to(sessionKey).emit("session-content", content);
  });

  // Join session-specific room
  socket.join(sessionKey);

  socket.on("disconnect", async () => {
    console.log(`User disconnected from session: ${sessionKey}`);
    sessions[sessionKey].users--;

    // Save content when last user leaves
    if (sessions[sessionKey].users === 0) {
      await writeSession(sessionKey, sessions[sessionKey].content);
      delete sessions[sessionKey]; // Remove session from memory
    }
  });
});

// Serve index.html for any session key
app.get("/:sessionKey", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
