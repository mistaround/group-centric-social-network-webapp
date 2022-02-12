/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

// Import User model
const User = require("../model/user");

const Group = require("../model/group");
const UserGroup = require("../model/userGroup");

// Import validation
const {
  getUserByIdValidation,
  updateUserByIdValidation,
  getUsersByGroupIdValidation,
  promoteUserValidation,
} = require("../validation/userValidation");

const getUserById = async (req, res) => {
  // Check if the request is valid
  const { error } = getUserByIdValidation({ id: req.params.id });
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  try {
    const userFetched = await User.findOne({ _id: req.params.id });

    // If user is not existed
    if (!userFetched) {
      return res
        .status(404)
        .send({ success: false, msg: "User does not exist" });
    }
    return res.status(200).send({ success: true, data: userFetched });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to find the user" });
  }
};

const getCurrentUserInfo = async (req, res) => {
  try {
    const userFetched = await User.findOne({ _id: req.user._id });
    // If user is not existed
    if (!userFetched) {
      return res
        .status(404)
        .send({ success: false, msg: "User does not exist" });
    }
    return res.status(200).send({ success: true, data: userFetched });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to find the user" });
  }
};

const validateUsername = async (req, res) => {
  try {
    const userFetched = await User.findOne({ name: req.params.name });
    if (!userFetched) {
      return res.status(200).send({
        success: true,
        msg: "Username has not been occupied",
        occupied: false,
      });
    }
    return res.status(200).send({
      success: false,
      msg: "Username has been occupied",
      data: userFetched,
      occupied: true,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to find the user" });
  }
};

const updateUserById = async (req, res) => {
  // Check if the request is valid
  const { error } = updateUserByIdValidation({
    id: req.params.id,
    ...req.body,
  });
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  try {
    let hashedPassword;
    if ("password" in req.body) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }
    const UserInfo = await User.findOne({ _id: req.params.id });
    const avatarUrl =
      "avatarUrl" in req.body ? req.body.avatarUrl : UserInfo._doc.avatarUrl;
    const password =
      "password" in req.body ? hashedPassword : UserInfo._doc.password;
    const isLocked =
      "isLocked" in req.body ? req.body.isLocked : UserInfo._doc.isLocked;
    const attempts =
      "attempts" in req.body ? req.body.attempts : UserInfo._doc.attempts;
    const lockTime =
      "lockTime" in req.body ? req.body.lockTime : UserInfo._doc.lockTime;
    const deactivated =
      "deactivated" in req.body
        ? req.body.deactivated
        : UserInfo._doc.deactivated;
    const hasNewMessage =
      "hasNewMessage" in req.body
        ? req.body.hasNewMessage
        : UserInfo._doc.hasNewMessage;
    const hasNewNotification =
      "hasNewNotification" in req.body
        ? req.body.hasNewNotification
        : UserInfo._doc.hasNewNotification;
    try {
      const userFetched = await User.updateOne(
        { _id: req.params.id },
        {
          password,
          avatarUrl,
          isLocked,
          attempts,
          lockTime,
          deactivated,
          hasNewMessage,
          hasNewNotification,
        }
      );
      if (!userFetched) {
        return res.status(404).send({
          success: false,
          msg: "Unknown Error, it's impossible",
        });
      }
      return res.status(201).send({
        success: true,
        data: userFetched,
      });
    } catch (err) {
      return res
        .status(500)
        .send({ success: false, msg: "Failed to find the user" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to find the user" });
  }
};

const validatePassword = async (req, res) => {
  try {
    // Check if there exists a user with the same email in the database
    const userFetched = await User.findOne({ _id: req.user._id });

    if (!userFetched) {
      return res.status(404).send({ success: false, msg: "User cannot found" });
    }

    // Check if the password is correct
    const validPass = await bcrypt.compare(
      req.params.password,
      userFetched.password
    );
    if (validPass) {
      return res
        .status(200)
        .send({ success: true, msg: "Password is correct" });
    }
    return res.status(200).send({ success: false, msg: "Invalid password" });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to validate password" });
  }
};

const getUsersByGroupId = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }

  // Check if the request is valid
  const { error } = getUsersByGroupIdValidation({
    id: req.params.id,
  });
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  const groupFetched = Group.findOne({ _id: req.params.id });

  // if group not found
  if (!groupFetched) {
    return res.status(404).send({ success: false, msg: "Group cannot found" });
  }

  try {
    const users = await UserGroup.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: {
          groupId: mongoose.Types.ObjectId(req.params.id),
        },
      },
    ]);

    const userNum = users.length;
    let maxPageNum = 0;
    if (userNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(userNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(userNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: userNum });
    }

    const result = await UserGroup.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: {
          groupId: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $project: {
          userId: 0,
          _id: 0,
        },
      },
      {
        $unwind: "$user",
      },
    ])
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));

    return res
      .status(200)
      .send({ success: true, data: result, total: userNum });
  } catch (err) {
    return res
      .status(500)
      .send({ success: true, msg: "Failed to find target users" });
  }
};

const promoteUser = async (req, res) => {
  // Check if the request is valid
  const { error } = promoteUserValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  const userFetched = await User.findOne({ _id: req.body.userId });
  if (!userFetched) {
    return res.status(404).send({ success: false, msg: "User cannot found" });
  }

  const groupFetched = await Group.findOne({ _id: req.body.groupId });
  if (!groupFetched) {
    return res.status(404).send({ success: false, msg: "Group cannot found" });
  }

  try {
    await UserGroup.updateOne(
      { $and: [{ userId: req.body.userId }, { groupId: req.body.groupId }] },
      { isAdmin: true }
    );
    return res
      .status(201)
      .send({ success: true, msg: "User promotion successful" });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "User promotion failed" });
  }
};

const demoteUser = async (req, res) => {
  // Check if the request is valid
  const { error } = promoteUserValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  const userFetched = await User.findOne({ _id: req.body.userId });
  if (!userFetched) {
    return res.status(404).send({ success: false, msg: "User cannot found" });
  }

  const groupFetched = await Group.findOne({ _id: req.body.groupId });
  if (!groupFetched) {
    return res.status(404).send({ success: false, msg: "Group cannot found" });
  }

  if (groupFetched.owner === req.body.userId) {
    return res
      .status(400)
      .send({ success: false, msg: "Cannot demote group owner" });
  }

  try {
    await UserGroup.updateOne(
      { $and: [{ userId: req.body.userId }, { groupId: req.body.groupId }] },
      { isAdmin: false }
    );
    return res
      .status(201)
      .send({ success: true, msg: "User demotion successful" });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "User demotion failed" });
  }
};

const searchUserByName = async (req, res) => {
  try {
    const userFetched = await User.findOne({ name: req.params.name });
    if (!userFetched) {
      return res.status(404).send({
        success: false,
        msg: "User cannot found",
      });
    }
    return res.status(200).send({
      success: true,
      data: userFetched,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to find the user" });
  }
};

module.exports = {
  getUserById,
  getCurrentUserInfo,
  validateUsername,
  updateUserById,
  validatePassword,
  getUsersByGroupId,
  promoteUser,
  demoteUser,
  searchUserByName,
};
