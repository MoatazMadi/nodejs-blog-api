const joi = require("joi");

const postSchema = joi.object({
  title: joi.string().max(300).required().messages({
    "string.base": "title must be a string",
    "string.empty": "title cannot be empty",
    "string.max": "title must be less than 300 characters",
  }),
  content: joi.string().max(30000).required().messages({
    "string.base": "post content must be a string",
    "string.empty": "post content cannot be empty",
    "string.max": "post content must be less than 30,000 characters",
  }),
});

const validatePost = (post) => {
  return postSchema.validate(post, { abortEarly: false });
};

module.exports = {validatePost}