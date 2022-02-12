const express = require("express");

// CORS
const cors = require("cors");

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
const whiteList = process.env.WHITE_LIST.split(",");

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

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

// Start server
const port = process.env.PORT || 5001;
app.listen(port);
module.exports = app;
