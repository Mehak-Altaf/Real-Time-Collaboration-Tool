const express = require("express");

const Message = require("../models/Message");

const router = express.Router();

// =========================
// GET MESSAGES
// =========================

router.get("/", async (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({
        message: "Room ID is required",
      });
    }

    const messages = await Message.find({
      roomId,
    }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    console.error(
      "Get messages error:",
      error
    );

    res.status(500).json({
      message: "Failed to get messages",
    });
  }
});

// =========================
// CREATE MESSAGE
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      roomId,
      user,
      text,
    } = req.body;

    if (
      !roomId ||
      !user ||
      !text
    ) {
      return res.status(400).json({
        message:
          "Room ID, user and message are required",
      });
    }

    const newMessage =
      await Message.create({
        roomId,
        user,
        text,
      });

    res.status(201).json(
      newMessage
    );
  } catch (error) {
    console.error(
      "Create message error:",
      error
    );

    res.status(500).json({
      message: "Failed to create message",
    });
  }
});

module.exports = router;