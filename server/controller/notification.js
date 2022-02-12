/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
// Import Notification Model
const Notification = require("../model/notification");
const Group = require("../model/group");
const User = require("../model/user");
const UserGroup = require("../model/userGroup");
const Flag = require("../model/flag");
const Post = require("../model/post");

// Import Validation
const {
  createNotificationValidation,
  processAdminsValidation,
  processClickOneForAllValidation,
  processNotificationValidation,
  deleteNotificationValidation,
} = require("../validation/notificationValidation");

// TODO: auth

// EventId
// 0: MEMBER BE NOTIFITED OF BEING PROMOTED
//    >memberId, groupId
// 1: REQUESTER BE NOTIFITED OF BEING DENIED TO JOIN GROUP <= 9
//    >requesterId, groupId
// 2: *INVITEE BE NOTIFITED TO DECIDE ACCEPT INVITATION BY INVITER TO JOIN GROUP => ACCEPT 6 DENY 4
//    >inviteeId, inviterId, groupId
// 3: INVITEE BE NOTIFED OF BEING DENIED BY ADMIN <= 6
//    >inviteeId, inviterId, groupId
// 4: INVITER BE NOTIFED OF BEING DENIED BY INVITEE <= 2
//    >inviterId, inviteeId, groupId
// 5: INVITER BE NOTIFED OF BEING DENIED BY ADMIN <= 6
//    >inviterId, inviteeId, groupId
// 6: *ADMINS BE NOTIFITED TO DECIDE APPROVE INVITAION <= 2 => DENY 3 5
//    >groupId, inviteeId, inviterId
// 7: *ADMINS BE NOTIFIED OF DECIDE A FLAGGED POST IN GROUP IS TO BE DELETED => ACCEPT 10 11 DENY 12
//    >groupId, postId
// 8: ADMINS BE NOTIFIED OF A MEMBER LEAVING GROUP
//    >groupId, memberId
// 9: *ADMINS BE NOTIFIED TO DECIDE ACCEPT REQUEST BY REQUESTER TO JOIN GROUP => ACCEPT 13 DENY 1
//    >groupId, requesterId
// 10: AUTHOR BE NOTIFED OF POST BEING DELETED <= 7
//    >authorId, postId
// 11: FLAGGERS BE NOTIFIED OF POST BEING DELETED <= 7
//    >postId
// 12: FLAGGERS BE NOTIFIED OF POST NOT TO DELETE <= 7
//    >postId
// 13: REQUESTER BE NOTIFITED OF BEING ACCEPTED TO JOIN GROUP <= 9
//    >requesterId, groupId

const createNotification = async (req, res) => {
  const { error } = createNotificationValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  if (req.body.eventId === 0) {
    // 0: MEMBER BE NOTIFITED OF BEING PROMOTED
    //    >memberId, groupId
    if (req.body.memberId === undefined || req.body.groupId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const group = await Group.findOne({ _id: req.body.groupId });
      const text = `You are promoted to become an adminstor of group ${group.name}.`;
      const newNotification = new Notification({
        receiverId: req.body.memberId,
        eventId: 0,
        text,
        haveChoice: false,
      });

      const savedNotification = await newNotification.save();
      return res.status(200).send({ success: true, data: savedNotification });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 1) {
    // 1: REQUESTER BE NOTIFITED OF BEING DENIED TO JOIN GROUP <= 9
    //    >requesterId, groupId
    if (req.body.requesterId === undefined || req.body.groupId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const group = await Group.findOne({ _id: req.body.groupId });
      const text = `You are denied of joining the group ${group.name}.`;
      const newNotification = new Notification({
        receiverId: req.body.requesterId,
        eventId: 1,
        text,
        haveChoice: false,
      });

      const savedNotification = await newNotification.save();
      return res.status(200).send({ success: true, data: savedNotification });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 2) {
    if (
      req.body.inviteeId === undefined ||
      req.body.inviterId === undefined ||
      req.body.groupId === undefined
    ) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    // 2: *INVITEE BE NOTIFITED TO DECIDE INVITATION BY INVITER TO JOIN GROUP => ACCEPT 6 DENY 4
    //    >inviteeId, inviterId, groupId
    try {
      const group = await Group.findOne({ _id: req.body.groupId });
      const inviter = await User.findOne({ _id: req.body.inviterId });
      const text = `You are invited to join the group ${group.name} by ${inviter.name}.`;
      const newNotification = new Notification({
        receiverId: req.body.inviteeId,
        eventId: 2,
        text,
        haveChoice: true,
        inviteeId: req.body.inviteeId,
        inviterId: req.body.inviterId,
        groupId: req.body.groupId,
      });
      const savedNotification = await newNotification.save();
      return res.status(200).send({ success: true, data: savedNotification });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 3) {
    // 3: INVITEE BE NOTIFED OF BEING DENIED BY ADMIN <= 6
    //    >inviteeId, inviterId, groupId
    if (
      req.body.inviteeId === undefined ||
      req.body.inviterId === undefined ||
      req.body.groupId === undefined
    ) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const group = await Group.findOne({ _id: req.body.groupId });
      const inviter = await User.findOne({ _id: req.body.inviterId });
      const text = `You are denied of joining the group ${group.name} through invitation by ${inviter.name}.`;
      const newNotification = new Notification({
        receiverId: req.body.inviteeId,
        eventId: 3,
        text,
        haveChoice: false,
      });
      const savedNotification = await newNotification.save();
      return res.status(200).send({ success: true, data: savedNotification });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 4) {
    // 4: INVITER BE NOTIFED OF BEING DENIED BY INVITEE <= 2
    //    >inviterId, inviteeId, groupId
    if (
      req.body.inviteeId === undefined ||
      req.body.inviterId === undefined ||
      req.body.groupId === undefined
    ) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const group = await Group.findOne({ _id: req.body.groupId });
      const invitee = await User.findOne({ _id: req.body.inviteeId });
      const text = `${invitee.name} denied your invitation of joining the group ${group.name}.`;
      const newNotification = new Notification({
        receiverId: req.body.inviterId,
        eventId: 4,
        text,
        haveChoice: false,
      });
      const savedNotification = await newNotification.save();
      return res.status(200).send({ success: true, data: savedNotification });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 5) {
    // 5: INVITER BE NOTIFED OF BEING DENIED BY ADMIN <= 6
    //    >inviterId, inviteeId, groupId
    if (
      req.body.inviteeId === undefined ||
      req.body.inviterId === undefined ||
      req.body.groupId === undefined
    ) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const group = await Group.findOne({ _id: req.body.groupId });
      const invitee = await User.findOne({ _id: req.body.inviteeId });
      const text = `${invitee.name} is denied of joining the group ${group.name} through your invitation.`;
      const newNotification = new Notification({
        receiverId: req.body.inviterId,
        eventId: 5,
        text,
        haveChoice: false,
      });
      const savedNotification = await newNotification.save();
      return res.status(200).send({ success: true, data: savedNotification });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 6) {
    // 6: *ADMINS BE NOTIFITED TO DECIDE APPROVE INVITAION <= 2 => DENY 3 5
    //    >groupId, inviteeId, inviterId
    if (
      req.body.inviteeId === undefined ||
      req.body.inviterId === undefined ||
      req.body.groupId === undefined
    ) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const newNotifications = [];
      const group = await Group.findOne({ _id: req.body.groupId });
      const admins = await UserGroup.find({
        $and: [{ groupId: req.body.groupId }, { isAdmin: true }],
      });
      const invitee = await User.findOne({ _id: req.body.inviteeId });
      const text = `${invitee.name} is invited to joining the group ${group.name}.`;
      admins.forEach((item) => {
        const newNotification = {
          receiverId: item.userId,
          eventId: 6,
          text,
          haveChoice: true,
          inviteeId: req.body.inviteeId,
          inviterId: req.body.inviterId,
          groupId: req.body.groupId,
        };
        newNotifications.push(newNotification);
      });
      const savedNotifications = await Notification.insertMany(
        newNotifications
      );
      return res.status(200).send({ success: true, data: savedNotifications });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 7) {
    // 7: *ADMINS BE NOTIFIED OF DECIDE FLAGGED POST IN GROUP TO BE DELETED => ACCEPT 10 11 DENY 12
    //    >groupId, postId
    if (req.body.postId === undefined || req.body.groupId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const newNotifications = [];
      const group = await Group.findOne({ _id: req.body.groupId });
      const admins = await UserGroup.find({
        $and: [{ groupId: req.body.groupId }, { isAdmin: true }],
      });
      const post = await Post.findOne({ _id: req.body.postId });
      const text = `The post with title ${post.title} in group ${group.name} is flagged, do you want to delete it?`;
      admins.forEach((item) => {
        const newNotification = {
          receiverId: item.userId,
          eventId: 7,
          text,
          haveChoice: true,
          postId: req.body.postId,
          authorId: post.userId,
        };
        newNotifications.push(newNotification);
      });
      const savedNotifications = await Notification.insertMany(
        newNotifications
      );
      return res.status(200).send({ success: true, data: savedNotifications });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 8) {
    // 8: ADMINS BE NOTIFIED OF A MEMBER LEAVING GROUP
    //    >groupId, memberId
    if (req.body.memberId === undefined || req.body.groupId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const newNotifications = [];
      const group = await Group.findOne({ _id: req.body.groupId });
      const admins = await UserGroup.find({
        $and: [{ groupId: req.body.groupId }, { isAdmin: true }],
      });
      const member = await User.findOne({ _id: req.body.memberId });
      const text = `${member.name} has left group ${group.name}.`;
      admins.forEach((item) => {
        const newNotification = {
          receiverId: item.userId,
          eventId: 8,
          text,
          haveChoice: false,
        };
        newNotifications.push(newNotification);
      });
      const savedNotifications = await Notification.insertMany(
        newNotifications
      );
      return res.status(200).send({ success: true, data: savedNotifications });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 9) {
    // 9: *ADMINS BE NOTIFIED TO DECIDE ACCEPT REQUEST BY REQUESTER TO JOIN GROUP => DENY 1
    //    >groupId, requesterId
    if (req.body.requesterId === undefined || req.body.groupId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const newNotifications = [];
      const group = await Group.findOne({ _id: req.body.groupId });
      const admins = await UserGroup.find({
        $and: [{ groupId: req.body.groupId }, { isAdmin: true }],
      });
      const requester = await User.findOne({ _id: req.body.requesterId });
      const text = `${requester.name} is requesting on joining group: ${group.name}.`;
      admins.forEach((item) => {
        const newNotification = {
          receiverId: item.userId,
          eventId: 9,
          text,
          haveChoice: true,
          requesterId: req.body.requesterId,
          groupId: req.body.groupId,
        };
        newNotifications.push(newNotification);
      });
      const savedNotifications = await Notification.insertMany(
        newNotifications
      );
      return res.status(200).send({ success: true, data: savedNotifications });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 10) {
    // 10: AUTHOR BE NOTIFED OF POST BEING DELETED <= 7
    //    >authorId, postId
    if (req.body.authorId === undefined || req.body.postId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const post = await Post.findOne({ _id: req.body.postId });
      const text = `Your post with title ${post.title} has been deleted by admin.`;
      const newNotification = new Notification({
        receiverId: req.body.authorId,
        eventId: 10,
        text,
        haveChoice: false,
      });
      const savedNotification = await newNotification.save();
      return res.status(200).send({ success: true, data: savedNotification });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 11) {
    // 11: FLAGGERS BE NOTIFIED OF POST BEING DELETED <= 7
    //    >postId
    if (req.body.postId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const newNotifications = [];
      const post = await Post.findOne({ _id: req.body.postId });
      const flaggers = await Flag.find({ postId: req.body.postId });
      const text = `The post with title ${post.title} which was flagged by you has been deleted.`;
      flaggers.forEach((item) => {
        const newNotification = {
          receiverId: item.userId,
          eventId: 11,
          text,
          haveChoice: false,
        };
        newNotifications.push(newNotification);
      });
      const savedNotifications = await Notification.insertMany(
        newNotifications
      );
      return res.status(200).send({ success: true, data: savedNotifications });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 12) {
    // 12: FLAGGERS BE NOTIFIED OF POST NOT TO DELETE <= 7
    //    >postId
    if (req.body.postId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const newNotifications = [];
      const post = await Post.findOne({ _id: req.body.postId });
      const flaggers = await Flag.find({ postId: req.body.postId });
      const text = `The post with title ${post.title} which was flagged by you will not be deleted.`;
      flaggers.forEach((item) => {
        const newNotification = {
          receiverId: item.userId,
          eventId: 12,
          text,
          haveChoice: false,
        };
        newNotifications.push(newNotification);
      });
      const savedNotifications = await Notification.insertMany(
        newNotifications
      );
      return res.status(200).send({ success: true, data: savedNotifications });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else if (req.body.eventId === 13) {
    // 13: REQUESTER BE NOTIFITED OF BEING ACCEPTED TO JOIN GROUP <= 9
    //    >requesterId, groupId
    if (req.body.requesterId === undefined || req.body.groupId === undefined) {
      return res.status(500).send({ success: false, msg: "wrong body" });
    }
    try {
      const group = await Group.findOne({ _id: req.body.groupId });
      const text = `You are accepted of joining the group ${group.name}. Enjoy yourself.`;
      const newNotification = new Notification({
        receiverId: req.body.requesterId,
        eventId: 13,
        text,
        haveChoice: false,
      });

      const savedNotification = await newNotification.save();
      return res.status(200).send({ success: true, data: savedNotification });
    } catch (err) {
      return res.status(500).send({ success: false, msg: err });
    }
  } else {
    return res.status(404).send({ success: false });
  }
};

const getNotifications = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 10;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }
  try {
    const allNotifications = await Notification.find({
      receiverId: req.user._id,
    });
    const notificationNum = allNotifications.length;
    let maxPageNum = 0;
    if (notificationNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(notificationNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(notificationNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we send back all data
    if (req.query.skip > maxPageNum) {
      return res
        .status(200)
        .send({ data: allNotifications, total: notificationNum });
    }
    // Fetch posts from database
    const fetchNum =
      req.query.limit * req.query.skip > notificationNum
        ? notificationNum
        : req.query.limit * req.query.skip;
    // eslint-disable-next-line operator-linebreak
    const notificationsFetched = await Notification.find({
      receiverId: req.user._id,
    })
      .sort({ date: "desc" })
      .limit(fetchNum);
    // If no posts fetched
    if (!notificationsFetched) {
      return res.status(200).send({
        success: true,
        data: allNotifications,
        total: notificationNum,
      });
    }
    return res.status(200).send({
      success: true,
      data: notificationsFetched,
      total: notificationNum,
    });
  } catch (err) {
    return res.status(400).send({ success: false, msg: err });
  }
};

const processNotification = async (req, res) => {
  const dataToValidate = {
    notificationId: req.params.id,
  };
  const { error } = processNotificationValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  try {
    await Notification.updateOne({ _id: req.params.id }, { processed: true });
    return res.status(201).send({
      success: true,
    });
  } catch (err) {
    return res.status(400).send({ success: false, msg: err });
  }
};

const processAdmins = async (req, res) => {
  const { error } = processAdminsValidation({
    operatorId: req.user._id,
    ...req.body,
  });
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  try {
    if (req.body.eventId === 6) {
      const notifications = await Notification.find({
        $and: [
          { eventId: 6 },
          { groupId: req.body.groupId },
          { inviteeId: req.body.inviteeId },
          { inviterId: req.body.inviterId },
          { processed: false },
        ],
      });
      const notificationIds = [];
      const admins = [];
      notifications.forEach((item) => {
        notificationIds.push(item._id);
        admins.push(item);
      });
      await Notification.updateMany(
        { $in: notificationIds },
        { processed: true }
      );
      return res.status(201).send({
        success: true,
        data: admins,
      });
    }
    if (req.body.eventId === 7) {
      const notifications = await Notification.find({
        $and: [
          { eventId: 7 },
          { groupId: req.body.groupId },
          { postId: req.body.postId },
          { authorId: req.body.authorId },
          { processed: false },
        ],
      });
      const notificationIds = [];
      const admins = [];
      notifications.forEach((item) => {
        notificationIds.push(item._id);
        admins.push(item);
      });
      await Notification.updateMany(
        { $in: notificationIds },
        { processed: true }
      );
      return res.status(201).send({
        success: true,
        data: admins,
      });
    }
    if (req.body.eventId === 9) {
      const notifications = await Notification.find({
        $and: [
          { eventId: 9 },
          { groupId: req.body.groupId },
          { requesterId: req.body.requesterId },
          { processed: false },
        ],
      });
      const notificationIds = [];
      const admins = [];
      notifications.forEach((item) => {
        notificationIds.push(item._id);
        admins.push(item);
      });
      await Notification.updateMany(
        { $in: notificationIds },
        { processed: true }
      );
      return res.status(201).send({
        success: true,
        data: admins,
      });
    }
  } catch (err) {
    return res.status(400).send({ success: false, msg: err });
  }
};

const processClickOneForAll = async (req, res) => {
  const { error } = processClickOneForAllValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  try {
    const notifications = await Notification.find({
      $and: [
        { eventId: 6 },
        { groupId: req.body.groupId },
        { inviteeId: req.body.inviteeId },
        { processed: false },
      ],
    });
    const notificationIds = [];
    const admins = [];
    notifications.forEach((item) => {
      notificationIds.push(item._id);
      admins.push(item);
    });
    await Notification.updateMany(
      { $in: notificationIds },
      { processed: true }
    );
    return res.status(201).send({
      success: true,
      data: admins,
    });
  } catch (err) {
    return res.status(400).send({ success: false, msg: err });
  }
};

const deleteNotification = async (req, res) => {
  const { error } = deleteNotificationValidation({
    notificationId: req.params.id,
  });
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  const deleted = await Notification.deleteOne({ _id: req.params.id });
  if (deleted) {
    return res.status(201).send({ success: true, msg: "deleted" });
  }
  return res.status(400).send({ success: false, msg: "error on deleting" });
};

module.exports = {
  createNotification,
  getNotifications,
  processAdmins,
  processClickOneForAll,
  processNotification,
  deleteNotification,
};
