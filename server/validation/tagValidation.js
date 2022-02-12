const joi = require("@hapi/joi");

// createTag validation
const createTagValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(1).max(30).required(),
  });
  return schema.validate(data);
};

module.exports = { createTagValidation };
