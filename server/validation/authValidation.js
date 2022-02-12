const joi = require("@hapi/joi");

// Register validation
const registerValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(5).max(20).required().alphanum(),
    email: joi.string().min(6).max(255).required().email(),
    password: joi
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/)
      .required(),
  });
  return schema.validate(data);
};

// Register validation
const loginValidation = (data) => {
  const schema = joi.object({
    name: joi.string().required(),
    password: joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
