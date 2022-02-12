const joi = require("@hapi/joi");

// createTag validation
const createGroupTagValidation = (data) => {
  const schema = joi.object({
    tagId: joi
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

module.exports = { createGroupTagValidation };
