const joi = require("joi");

const userSchema = joi.object({
  name: joi.string().min(3).max(150).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be less than 150 characters",
    "any.required": "Name is required",
  }),
  userName: joi.string().min(3).max(255).required(),
  password: joi.string().required(),
  repeat_password: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Repeat Password must match the Password",
    "any.required": "Repeat Password is required",
  }),
});

const validateUser = (userObj) => {
  return userSchema.validate(userObj, { abortEarly: false }); // collect all validation errors
};

const updatedUserSchema = joi.object({
  name: joi.string().min(3).max(150).messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be less than 150 characters",
  }),
  userName: joi.string().min(3).max(255),
  password: joi.string(),
  repeat_password: joi.string().valid(joi.ref("password")).messages({
    "any.only": "Repeat Password must match the Password",
  }),
});

const validateUserUpdated = (userObj) => {
  return updatedUserSchema.validate(userObj, { abortEarly: false }); // collect all validation errors
};

module.exports = { validateUser, validateUserUpdated };
