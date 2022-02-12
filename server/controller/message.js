/* eslint-disable comma-dangle */
// Import Message Model
const Message = require("../model/message");
const Chat = require("../model/chat");

// Import Validation
const {
  createMessageValidation,
  getMessagesValidation,
} = require("../validation/messageValidation");

// TODO: auth

const createMessage = async (req, res) => {
  const dataToValidate = {
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    chatId: req.body.chatId,
    type: req.body.type,
    text: req.body.text,
  };
  const { error } = createMessageValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  const message = {
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    chatId: req.body.chatId,
    type: req.body.type,
    text: req.body.text,
  };
  const newMessage = new Message(message);
  try {
    const savedMessage = await newMessage.save();
    await Chat.updateOne({ _id: req.body.chatId }, { date: savedMessage.date });
    return res.status(200).send({ success: true, data: savedMessage });
  } catch (err) {
    return res.status(500).send({ success: false, msg: err });
  }
};

const getMessages = async (req, res) => {
  const dataToValidate = {
    chatId: req.params.id,
  };
  const { error } = getMessagesValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 10;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }
  try {
    const messageNum = await Message.find({
      chatId: req.params.id,
    }).count();
    let maxPageNum = 0;
    if (messageNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(messageNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(messageNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      const allMessages = await Message.find({
        chatId: req.params.id,
      }).sort({ date: "desc" });
      return res.status(200).send({
        success: true,
        data: { messages: allMessages, total: messageNum },
      });
    }
    // Fetch posts from database
    // eslint-disable-next-line operator-linebreak
    const fetchNum =
      req.query.limit * req.query.skip > messageNum
        ? messageNum
        : req.query.limit * req.query.skip;
    const messagesFetched = await Message.find({
      chatId: req.params.id,
    })
      .sort({ date: "desc" })
      .limit(fetchNum);
    // If no posts fetched
    if (!messagesFetched) {
      return res
        .status(200)
        .send({ success: true, data: { messages: [], total: messageNum } });
    }
    return res.status(200).send({
      success: true,
      data: { messages: messagesFetched, total: messageNum },
    });
  } catch (err) {
    return res.status(400).send({ success: false, msg: err });
  }
};

module.exports = {
  createMessage,
  getMessages,
};
