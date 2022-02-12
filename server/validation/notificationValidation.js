const joi = require("@hapi/joi");

// createNotification validation
const createNotificationValidation = (data) => {
  const schema = joi.object({
    receiverId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    eventId: joi.number().min(0).max(13).required(),
    memberId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    requesterId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    groupId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    inviteeId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    inviterId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    authorId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    postId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    haveChoice: joi.boolean(),
    text: joi.string().min(0),
  });
  return schema.validate(data);
};

// processAdmins validation
const processAdminsValidation = (data) => {
  const schema = joi.object({
    operatorId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    eventId: joi.number().min(0).max(13).required(),
    requesterId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    groupId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    inviteeId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    inviterId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    authorId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    postId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
  });
  return schema.validate(data);
};

// processClickOneForAllValidation Event6
const processClickOneForAllValidation = (data) => {
  const schema = joi.object({
    eventId: joi.number().equal(6).required(),
    groupId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
    inviteeId: joi
      .string()
      .min(24)
      .max(24)
      .regex(/^[0-9a-fA-F]{24}$/),
  });
  return schema.validate(data);
};

// processNotification validation
const processNotificationValidation = (data) => {
  const schema = joi.object({
    notificationId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

const deleteNotificationValidation = (data) => {
  const schema = joi.object({
    notificationId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  createNotificationValidation,
  processAdminsValidation,
  processClickOneForAllValidation,
  processNotificationValidation,
  deleteNotificationValidation,
};
