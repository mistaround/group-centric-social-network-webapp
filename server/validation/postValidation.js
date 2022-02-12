const joi = require("@hapi/joi");

// createPost validation
const createPostValidation = (data) => {
  const schema = joi.object({
    userId: joi
      .string()
      .min(24)
      .max(24)
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    groupId: joi
      .string()
      .min(24)
      .max(24)
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    title: joi.string().min(1).max(128).required(),
    content: joi.string().min(0),
    mediaUrl: joi.array(),
    hasVideo: joi.boolean().required(),
    hasAudio: joi.boolean().required(),
  });
  return schema.validate(data);
};

// createFlag validation
const createFlagValidation = (data) => {
  const schema = joi.object({
    userId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    postId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

// undoAllFlags validation
const undoAllFlagsValidation = (data) => {
  const schema = joi.object({
    postId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

// deleteFlags validation
const deleteFlagsValidation = (data) => {
  const schema = joi.object({
    postId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

// createPost validation
const enableHideValidation = (data) => {
  const schema = joi.object({
    userId: joi
      .string()
      .min(24)
      .max(24)
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
    postId: joi
      .string()
      .min(24)
      .max(24)
      .required()
      .regex(/^[0-9a-fA-F]{24}$/),
  });
  return schema.validate(data);
};

// deletePost Validation
const deletePostValidation = (data) => {
  const schema = joi.object({
    id: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

// getPostByGroupId Validation
const getPostByGroupIdValidation = (data) => {
  const schema = joi.object({
    id: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  createPostValidation,
  createFlagValidation,
  undoAllFlagsValidation,
  deleteFlagsValidation,
  enableHideValidation,
  deletePostValidation,
  getPostByGroupIdValidation,
};
