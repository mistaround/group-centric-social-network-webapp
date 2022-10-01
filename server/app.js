const express = require("express");
const socketio = require("socket.io");
const http = require("http")
const cors = require("cors");
require("dotenv").config();

// Routes import
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const groupRoute = require("./routes/groupRoute");
const commentRoute = require("./routes/commentRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const fileRoute = require("./routes/fileRoute");
const notificationRoute = require("./routes/notificationRoute");

const { verifyToken } = require("./controller/auth");

const app = express();
const server = http.createServer(app);
// const whiteList = process.env.WHITE_LIST.split(",");

// const corsOptions = {
//   origin(origin, callback) {
//     if (whiteList.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(cors());

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Route middleware
app.use("/api/", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", verifyToken, postRoute);
app.use("/api/group", verifyToken, groupRoute);
app.use("/api/comment", verifyToken, commentRoute);
app.use("/api/chat", verifyToken, chatRoute);
app.use("/api/message", verifyToken, messageRoute);
app.use("/api/file", fileRoute);
app.use("/api/notification", verifyToken, notificationRoute);

// Socket

// Update for commit
const io = socketio(server, 
  {
  cors: {
    origin: `http://localhost:3000`,
    // origin: `${process.env.DOMAIN}`,
  },
}
);

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

// Start server
const port = process.env.PORT || 5001;
// app.listen(port);
// module.exports = app;
server.listen(port)
