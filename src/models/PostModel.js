const mongoose = require("mongoose");
const slugify = require("slugify");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      max: 300,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    img: String,
  },
  { timestamps: true }
);

PostSchema.pre("save", async function (next) {
  await this.constructor.makeSlug(this);
  next();
});

PostSchema.statics.makeSlug = async function (post) {
  if (post.title) {
    // Generate the initial slug based on the title
    let baseSlug = slugify(post.title, { lower: true });
    post.slug = baseSlug;

    let existingPost = await mongoose.models.Post.findOne({ slug: post.slug });

    // if the slug exists add a number to end it
    let counter = 1;
    while (existingPost) {
      // Check if the slug ends with a number and increment it
      const match = post.slug.match(/-(\d+)$/);

      if (match) {
        // If the slug ends with a number, increment it
        const currentNumber = parseInt(match[1], 10);
        post.slug = `${baseSlug}-${currentNumber + 1}`;
      } else {
        // else append `-1` to the slug
        post.slug = `${baseSlug}-1`;
      }

      // Check if the new slug is unique
      existingPost = await mongoose.models.Post.findOne({ slug: post.slug });
      counter++;
    }

    // Return the final slug
    return post.slug;
  }
};

PostSchema.statics.isValidId = function (id) {
  return mongoose.isValidObjectId(id);
};

const PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;
