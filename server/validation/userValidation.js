const joi = require("@hapi/joi");

// getUserByName validation
const getUserByNameValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(5).max(20).required().alphanum(),
  });
  return schema.validate(data);
};

// getUserById validation
const getUserByIdValidation = (data) => {
  const schema = joi.object({
    id: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

// updateUser validation
const updateUserByIdValidation = (data) => {
  const schema = joi.object({
    id: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    password: joi.string(),
    avatarUrl: joi.string().min(0),
    isLocked: joi.boolean(),
    attempts: joi.number().min(0).max(3),
    lockTime: joi.date(),
    deactivated: joi.boolean(),
    hasNewMessage: joi.boolean(),
    hasNewNotification: joi.boolean(),
  });
  return schema.validate(data);
};

// getUsersByGroupId validation
const getUsersByGroupIdValidation = (data) => {
  const schema = joi.object({
    id: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    locked: joi.boolean(),
    deactivated: joi.boolean(),
    hasNewMessage: joi.boolean(),
    hasNewNotification: joi.boolean(),
  });
  return schema.validate(data);
};

// promoteUser validation
const promoteUserValidation = (data) => {
  const schema = joi.object({
    userId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    groupId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  getUserByNameValidation,
  getUserByIdValidation,
  updateUserByIdValidation,
  getUsersByGroupIdValidation,
  promoteUserValidation,
};
