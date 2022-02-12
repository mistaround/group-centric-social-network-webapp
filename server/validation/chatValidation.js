const joi = require("@hapi/joi");

// createChat validation
const createChatValidation = (data) => {
  const schema = joi.object({
    senderId: joi
      .string()
      .min(24)
      .max(24)
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    receiverId: joi
      .string()
      .min(24)
      .max(24)
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    // readBySender: joi.boolean().required(),
    // readByReceiver: joi.boolean().required(),
  });
  return schema.validate(data);
};
// getSameGroupValidation
const getSameGroupValidation = (data) => {
  const schema = joi.object({
    userId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    yourId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

// getChats validation
const getChatsValidation = (data) => {
  const schema = joi.object({
    userId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

// getChats validation
const getChatValidation = (data) => {
  const schema = joi.object({
    senderId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    receiverId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  createChatValidation,
  getSameGroupValidation,
  getChatsValidation,
  getChatValidation,
};
