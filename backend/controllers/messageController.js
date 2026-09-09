let messages = [];

const getMessages = (req, res) => {
  res.json(messages);
};

const createMessage = (req, res) => {
  const { user, text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      message: "Message cannot be empty",
    });
  }

  const newMessage = {
    id: Date.now(),
    user: user || "Anonymous",
    text: text.trim(),
  };

  messages.push(newMessage);

  res.status(201).json(newMessage);
};

module.exports = {
  getMessages,
  createMessage,
};