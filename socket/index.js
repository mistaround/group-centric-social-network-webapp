require("dotenv").config();

// Update for commit
const io = require("socket.io")(process.env.SOCKET_PORT, {
  cors: {
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId === userId);

io.on("connection", (socket) => {
  // when ceonnect
  console.log("a user connected.");

  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, chatId, type, text }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", {
        senderId,
        receiverId,
        chatId,
        type,
        text,
      });
    }
  });

  // send and get notification
  socket.on("sendNotification", (arr) => {
    arr.forEach((item) => {
      const receiver = getUser(item);
      if (receiver) {
        io.to(receiver.socketId).emit("getNotification");
      }
    });
  });

  // when disconnect
  socket.on("logout", (id) => {
    console.log("a user logout!");
    removeUser(getUser(id).socketId);
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
  });
});
