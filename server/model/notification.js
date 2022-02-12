const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    min: 0,
    max: 13,
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    min: 0,
    max: 10,
  },
  // The member Id for promoted by Admin
  memberId: {
    type: mongoose.Schema.ObjectId,
    min: 0,
    max: 10,
  },
  // The requester Id for request to join a group
  requesterId: {
    type: mongoose.Schema.ObjectId,
    min: 0,
    max: 10,
  },
  // To get administors Id for approve invitation by inviter, flag, member left
  groupId: {
    type: mongoose.Schema.ObjectId,
    min: 24,
    max: 24,
  },
  // The invitee Id for invited to group by Inviter, denied to join group by Admin
  inviteeId: {
    type: mongoose.Schema.ObjectId,
    min: 24,
    max: 24,
  },
  // The inviter Id for denied by Invitee
  inviterId: {
    type: mongoose.Schema.ObjectId,
    min: 24,
    max: 24,
  },
  // The author Id for post deleted by Admin
  authorId: {
    type: mongoose.Schema.ObjectId,
    min: 24,
    max: 24,
  },
  // The post Id for flagged post deleted or not by Admin
  postId: {
    type: mongoose.Schema.ObjectId,
    min: 24,
    max: 24,
  },
  processed: {
    type: Boolean,
    default: false,
  },
  haveChoice: {
    type: Boolean,
  },
  text: {
    type: String,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Notification",
  NotificationSchema,
  // eslint-disable-next-line comma-dangle
  "notifications"
);
