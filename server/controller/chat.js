// Import Chat Model
const Chat = require("../model/chat");
const User = require("../model/user");
const UserGroup = require("../model/userGroup");

// Import Validation
const {
  createChatValidation,
  getSameGroupValidation,
  getChatsValidation,
  getChatValidation,
} = require("../validation/chatValidation");

// TODO: Auth

const createChat = async (req, res) => {
  const dataToValidate = {
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
  };
  const { error } = createChatValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  if (req.body.senderId === req.body.receiverId) {
    return res
      .status(400)
      .send({ success: false, msg: "Can't chat with yourself" });
  }

  const existedChat = await Chat.findOne({
    $or: [
      {
        $and: [{ senderId: req.user._id }, { receiverId: req.body.receiverId }],
      },
      { $and: [{ senderId: req.user._id }, { receiverId: req.body.senderId }] },
      { $and: [{ senderId: req.body.senderId }, { receiverId: req.user._id }] },
      {
        $and: [{ senderId: req.body.receiverId }, { receiverId: req.user._id }],
      },
    ],
  });
  if (existedChat !== null) {
    return res.status(201).send({ success: true, msg: "Existed Chat" });
  }

  if (existedChat !== null) {
    return res.status(201).send({ success: true, msg: "Existed Chat" });
  }

  const newChat = new Chat({
    senderId: req.user._id,
    receiverId: req.body.receiverId,
  });

  try {
    const savedChat = await newChat.save();
    return res.status(200).send({ success: true, data: savedChat });
  } catch (err) {
    return res.status(500).send({ success: false, msg: err });
  }
};

const getChat = async (req, res) => {
  const dataToValidate = {
    senderId: req.user._id,
    receiverId: req.params.id,
  };
  const { error } = getChatValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  try {
    const chat = await Chat.findOne({
      $or: [
        { $and: [{ senderId: req.user._id }, { receiverId: req.params.id }] },
        { $and: [{ receiverId: req.user._id }, { senderId: req.params.id }] },
      ],
    });
    return res.status(200).send({ success: true, data: chat });
  } catch (err) {
    return res.status(500).send({ success: false, msg: err });
  }
};

const getChats = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
  };
  const { error } = getChatsValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  try {
    const chats = await Chat.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    }).sort({ date: "desc" });
    const getUserInfo = async (obj, array) => {
      if (req.user._id === obj.senderId.valueOf()) {
        const user = await User.findOne({
          $and: [{ _id: obj.receiverId }, { deactivated: false }],
        });
        if (user) {
          array.push({
            ...obj._doc,
            name: user.name,
            avatarUrl: user.avatarUrl,
          });
        }
      } else {
        const user = await User.findOne({
          $and: [{ _id: obj.senderId }, { deactivated: false }],
        });
        if (user) {
          array.push({
            ...obj._doc,
            name: user.name,
            avatarUrl: user.avatarUrl,
          });
        }
      }
    };
    const result = [];
    for (let i = 0; i < chats.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await getUserInfo(chats[i], result);
    }
    return res.status(200).send({ success: true, data: result });
  } catch (err) {
    return res.status(500).send({ success: false, msg: err });
  }
};

const getSameGroup = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
    yourId: req.params.id,
  };
  const { error } = getSameGroupValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  try {
    const myGroups = await UserGroup.find({ userId: req.user._id });
    const yourGroups = await UserGroup.find({ userId: req.params.id });
    let result = false;
    for (let i = 0; i < myGroups.length; i += 1) {
      for (let j = 0; j < yourGroups.length; j += 1) {
        if (myGroups[i].groupId.valueOf() === yourGroups[j].groupId.valueOf()) {
          result = true;
        }
      }
    }
    return res.status(200).send({ success: true, data: result });
  } catch (err) {
    return res.status(500).send({ success: false, msg: err });
  }
};

// const deleteChat = async (req, res) => {
//   try {
//     const chat = await Chat.deleteOne({
//       $all: [req.params.id1, req.params.id2],
//     });
//     // TODO: delete messages
//     res.status(200).json(chat);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

module.exports = {
  createChat,
  getSameGroup,
  getChat,
  getChats,
  //   deleteChat,
};
