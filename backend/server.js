
const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");

dotenv.config();
const app = express();
const server = http.createServer(app);

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CollabSpace backend is running!",
  });
});
app.use("/api/messages", messageRoutes);

// Authentication
app.use("/api/auth", authRoutes);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});
const users = {};

// =========================
// SOCKET CONNECTION
// =========================

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, userName }) => {
    socket.join(roomId);

    users[socket.id] = {
      id: socket.id,
      name: userName,
      roomId,
    };

    console.log(
      `${userName} joined room: ${roomId}`
    );

    const roomUsers = Object.values(users).filter(
      (user) => user.roomId === roomId
    );

    io.to(roomId).emit(
      "room-users",
      roomUsers
    );
  });
  socket.on("send-message", async (messageData) => {
    try {

      const {
        roomId,
        user,
        text,
      } = messageData;

      const savedMessage = await Message.create({
        roomId,
        user,
        text,
      });

      console.log(
        "Message saved to MongoDB:",
        savedMessage._id
      );

      io.to(roomId).emit(
        "receive-message",
        savedMessage
      );
    } catch (error) {
      console.error(
        "Socket message error:",
        error
      );

      socket.emit("message-error", {
        message: "Could not save message",
      });
    }
  });
  socket.on(
    "typing",
    ({ roomId, userName }) => {
      socket
        .to(roomId)
        .emit("user-typing", userName);
    }
  );

  socket.on(
    "stop-typing",
    ({ roomId }) => {
      socket
        .to(roomId)
        .emit("user-stop-typing");
    }
  );

  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (!user) {
      return;
    }

    const roomId = user.roomId;

    delete users[socket.id];

    console.log(
      `${user.name} disconnected`
    );

    const roomUsers = Object.values(
      users
    ).filter(
      (item) => item.roomId === roomId
    );

    io.to(roomId).emit(
      "room-users",
      roomUsers
    );
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully!"
    );

    server.listen(PORT, () => {
      console.log(
        `CollabSpace server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};
startServer();