import instance from "../utils/request";
import socket from "../utils/socket";
import { updateUser } from "./user";

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

// Mark notification as processed
export async function processNotification(notificationId) {
  const res = await instance.put(`/api/notification/${notificationId}`);
  return res;
}

// 0: MEMBER BE NOTIFITED OF BEING PROMOTED
//    >memberId, groupId
export async function notifyMemberPromotion(memberId, groupId) {
  const body = {
    eventId: 0,
    memberId,
    groupId,
  };
  socket.emit("sendNotification", [memberId]);
  const res = await instance.post(`/api/notification`, body);
  updateUser(memberId, { hasNewNotification: true });
  return res;
}
// 1: REQUESTER BE NOTIFITED OF BEING DENIED TO JOIN GROUP <= 9
//    >requesterId, groupId
export async function notifyRequesterDenied(requesterId, groupId) {
  const body = {
    eventId: 1,
    requesterId,
    groupId,
  };
  socket.emit("sendNotification", [requesterId]);
  const res = await instance.post(`/api/notification`, body);
  updateUser(requesterId, { hasNewNotification: true });
  return res;
}
// 2: *INVITEE BE NOTIFITED TO DECIDE ACCEPT INVITATION BY INVITER TO JOIN GROUP => ACCEPT 6 DENY 4
//    >inviteeId, inviterId, groupId
export async function notifyInviteeDecision(inviteeId, inviterId, groupId) {
  const body = {
    eventId: 2,
    inviteeId,
    inviterId,
    groupId,
  };
  socket.emit("sendNotification", [inviteeId]);
  const res = await instance.post(`/api/notification`, body);
  updateUser(inviteeId, { hasNewNotification: true });
  return res;
}
// Click One Click All for User
export async function oneClickAllClickE2(groupId, inviteeId) {
  const body = {
    eventId: 6,
    inviteeId,
    groupId,
  };
  const res = await instance.put(`/api/notification/click`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// 3: INVITEE BE NOTIFED OF BEING DENIED BY ADMIN <= 6
//    >inviteeId, inviterId, groupId
export async function notifyInviteeDenied(inviteeId, inviterId, groupId) {
  const body = {
    eventId: 3,
    inviteeId,
    inviterId,
    groupId,
  };
  socket.emit("sendNotification", [inviteeId]);
  const res = await instance.post(`/api/notification`, body);
  updateUser(inviteeId, { hasNewNotification: true });
  return res;
}
// 4: INVITER BE NOTIFED OF BEING DENIED BY INVITEE <= 2
//    >inviterId, inviteeId, groupId
export async function notifyInviterDeniedByInvitee(
  inviteeId,
  inviterId,
  groupId
) {
  const body = {
    eventId: 4,
    inviteeId,
    inviterId,
    groupId,
  };
  socket.emit("sendNotification", [inviterId]);
  const res = await instance.post(`/api/notification`, body);
  updateUser(inviterId, { hasNewNotification: true });
  return res;
}
// 5: INVITER BE NOTIFED OF BEING DENIED BY ADMIN <= 6
//    >inviterId, inviteeId, groupId
export async function notifyInviterDeniedByAdmin(
  inviteeId,
  inviterId,
  groupId
) {
  const body = {
    eventId: 5,
    inviteeId,
    inviterId,
    groupId,
  };
  socket.emit("sendNotification", [inviterId]);
  const res = await instance.post(`/api/notification`, body);
  updateUser(inviterId, { hasNewNotification: true });
  return res;
}
// 6: *ADMINS BE NOTIFITED TO DECIDE APPROVE INVITAION <= 2 => DENY 3 5
//    >groupId, inviteeId, inviterId
export async function notifyAdminInvitation(inviteeId, inviterId, groupId) {
  const body = {
    eventId: 6,
    inviteeId,
    inviterId,
    groupId,
  };
  const res = await instance.post(`/api/notification`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// One process all process for Admins
export async function oneProcessAllProcessE6(groupId, inviterId, inviteeId) {
  const body = {
    eventId: 6,
    inviteeId,
    inviterId,
    groupId,
  };
  const res = await instance.put(`/api/notification/admin`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// 7: *ADMINS BE NOTIFIED OF DECIDE A FLAGGED POST IN GROUP IS TO BE DELETED => ACCEPT 10 11 DENY 12
//    >groupId, postId
export async function notifyAdminFlag(groupId, postId) {
  const body = {
    eventId: 7,
    groupId,
    postId,
  };
  const res = await instance.post(`/api/notification`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// One process all process for Admins
export async function oneProcessAllProcessE7(groupId, postId, authorId) {
  const body = {
    eventId: 7,
    postId,
    authorId,
    groupId,
  };
  const res = await instance.put(`/api/notification/admin`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// 8: ADMINS BE NOTIFIED OF A MEMBER LEAVING GROUP
//    >groupId, memberId
export async function notifyAdminLeave(groupId, memberId) {
  const body = {
    eventId: 8,
    groupId,
    memberId,
  };
  const res = await instance.post(`/api/notification`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// 9: *ADMINS BE NOTIFIED TO DECIDE ACCEPT REQUEST BY REQUESTER TO JOIN GROUP => DENY 1
//    >groupId, requesterId
export async function notifyAdminRequest(groupId, requesterId) {
  const body = {
    eventId: 9,
    groupId,
    requesterId,
  };
  const res = await instance.post(`/api/notification`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// One process all process for Admins
export async function oneProcessAllProcessE9(groupId, requesterId) {
  const body = {
    eventId: 9,
    requesterId,
    groupId,
  };
  const res = await instance.put(`/api/notification/admin`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// 10: AUTHOR BE NOTIFED OF POST BEING DELETED <= 7
//    >authorId, postId
export async function notifyAuthorDelete(authorId, postId) {
  const body = {
    eventId: 10,
    authorId,
    postId,
  };
  socket.emit("sendNotification", [authorId]);
  const res = await instance.post(`/api/notification`, body);
  updateUser(authorId, { hasNewNotification: true });
  return res;
}
// 11: FLAGGERS BE NOTIFIED OF POST BEING DELETED <= 7
//    >postId
export async function notifyFlaggerDelete(postId) {
  const body = {
    eventId: 11,
    postId,
  };
  const res = await instance.post(`/api/notification`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}
// 12: FLAGGERS BE NOTIFIED OF POST NOT TO DELETE <= 7
//    >postId
export async function notifyFlaggerNotDelete(postId) {
  const body = {
    eventId: 12,
    postId,
  };
  const res = await instance.post(`/api/notification`, body);
  const receivers = [];
  res.data.forEach((item) => {
    receivers.push(item.receiverId);
    updateUser(item.receiverId, { hasNewNotification: true });
  });
  socket.emit("sendNotification", receivers);
  return res;
}

// 13: REQUESTER BE NOTIFITED OF BEING ACCEPTED TO JOIN GROUP <= 9
//    >requesterId, groupId
export async function notifyRequesterAccepted(requesterId, groupId) {
  const body = {
    eventId: 13,
    requesterId,
    groupId,
  };
  socket.emit("sendNotification", [requesterId]);
  const res = await instance.post(`/api/notification`, body);
  updateUser(requesterId, { hasNewNotification: true });
  return res;
}
