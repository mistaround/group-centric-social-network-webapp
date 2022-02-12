const joi = require("@hapi/joi");

// createComment validation
const createCommentValidation = (data) => {
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
    content: joi.string().min(0),
  });
  return schema.validate(data);
};

// getComments validation
const getCommentsValidation = (data) => {
  const schema = joi.object({
    postId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

// putComment validation
const updateCommentValidation = (data) => {
  const schema = joi.object({
    userId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    commentId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    content: joi.string().min(0),
  });
  return schema.validate(data);
};

// deleteComment validation
const deleteCommentValidation = (data) => {
  const schema = joi.object({
    userId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    commentId: joi
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });
  return schema.validate(data);
};

module.exports = {
  createCommentValidation,
  getCommentsValidation,
  updateCommentValidation,
  deleteCommentValidation,
};
