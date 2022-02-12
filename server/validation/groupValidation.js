const joi = require("@hapi/joi");

// createGroup validation
const createGroupValidation = (data) => {
  const schema = joi.object({
    owner: joi
      .string()
      .min(24)
      .max(24)
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    name: joi.string().min(5).max(30).required(),
    tags: joi.array().items(joi.string().required()).min(1).required(),
    isPrivate: joi.boolean().required(),
  });
  return schema.validate(data);
};

// joinGroup validation
const joinGroupValidation = (data) => {
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

// createRequest validation
const createRequestValidation = (data) => {
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

// createRequest validation
const getRequestByUserIdAndGroupIdValidation = (data) => {
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

// checkGroupStatus validation
const checkGroupStatusValidation = (data) => {
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

// removeRequest validation
const removeRequestValidation = (data) => {
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

const quitGroupValidation = (data) => {
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

const getGroupByIdValidation = (data) => {
  const schema = joi.object({
    id: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

const checkUserGroupStatusValidation = (data) => {
  const schema = joi.object({
    id: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

const checkupdateGroupInfoValidation = (data) => {
  const schema = joi.object({
    avatarUrl: joi.string(),
    aboutGroup: joi.string().min(0).max(2048),
    postDelNum: joi.number(),
  });
  return schema.validate(data);
};

module.exports = {
  createGroupValidation,
  joinGroupValidation,
  createRequestValidation,
  checkGroupStatusValidation,
  getRequestByUserIdAndGroupIdValidation,
  removeRequestValidation,
  quitGroupValidation,
  getGroupByIdValidation,
  checkUserGroupStatusValidation,
  checkupdateGroupInfoValidation,
};
