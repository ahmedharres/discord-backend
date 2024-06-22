const Conversation = require("../../models/conversation");
const serverStore = require("../../serverStore");

const updateChatHistory = async (conversationId, toSpecifiedSocketId = null) => {
  const conversation = await Conversation.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: {
      path: "author",
      model: "User",
      select: "username _id",
    },
  });

  if (conversation) {
    const io = serverStore.getSocketServerInstance();
    const messages = conversation.messages.map(message => ({
      _id: message._id,
      author: {
        _id: message.author._id,
        username: message.author.username,
      },
      content: message.content,
      date: message.date,
    }));

    const participants = conversation.participants.map(participant => participant.toString());

    if (toSpecifiedSocketId) {
      return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
        messages,
        participants,
      });
    }

    conversation.participants.forEach((userId) => {
      const activeConnections = serverStore.getActiveConnections(userId.toString());

      activeConnections.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
          messages,
          participants,
        });
      });
    });
  }
};

module.exports = { updateChatHistory };
