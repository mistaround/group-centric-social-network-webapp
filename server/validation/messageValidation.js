const joi = require("@hapi/joi");

// createMessage validation
const createMessageValidation = (data) => {
  const schema = joi.object({
    chatId: joi
      .string()
      .min(24)
      .max(24)
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
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
    type: joi.string().min(4).max(7),
    text: joi.string().min(0),
  });
  return schema.validate(data);
};

// getMessages validation
const getMessagesValidation = (data) => {
  const schema = joi.object({
    chatId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  createMessageValidation,
  getMessagesValidation,
};
