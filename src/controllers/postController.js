const Post = require("../models/PostModel");
const { validatePost } = require("../utils/validators/postValdate");
const myError = require("../utils/myError");
const path = require("path");
const fs = require("fs").promises;
const mkdirp = require("mkdirp");

const index = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author", "name img").lean();
    res.status(200).json({ data: posts });
  } catch (err) {
    next(err);
  }
};
// get one
const getOne = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const post = await Post.findOne({ slug })
      .populate("author", "name img")
      .lean();
    if (!post) throw myError(404, "post not found");

    res.status(200).json({
      data: {
        post,
        status: 200,
      },
    });
  } catch (err) {
    next(err);
  }
};
// create one
const createOne = async (req, res, next) => {
  const { title, content } = req.body;

  try {
    const { error } = validatePost({ title, content });
    if (error) {
      throw myError(400, error.message);
    }
    const post = { title, content };

    if (!req.file) {
      throw myError(400, "post must have an image");
    }

    post.slug = await Post.makeSlug(post);

    //console.log(post)

    const dirath = path.join(
      __dirname,
      `../../public/imgs/postsimgs/${req.user.id}/${post.slug}`
    );

    await mkdirp(dirath);

    const targetPath = path.join(dirath, req.file.filename);
    await fs.copyFile(req.file.path, targetPath);

    await fs.unlink(req.file.path);
    post.img = targetPath;
    post.author = req.user.id;

    await Post.create(post);

    res.status(200).json({
      data: {
        message: "post created successfully.",
        status: 200,
      },
    });
  } catch (err) {
    next(err);
  }
};
// update one
const updateOne = async (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;

  try {
    if (!Post.isValidId(id)) throw myError(400, "post id not found");

    const foundPost = await Post.findById(id);

    if (!foundPost) throw myError(404, "Post not found");

    if (foundPost.author != req.user.id)
      throw myError(401, "unauthorized  action. cant update this post");

    const { error } = validatePost({ title, content });
    if (error) {
      throw myError(400, error.message);
    }

    let post = { title, content };

    if (title != foundPost.title) {
      post.slug = await Post.makeSlug(post);
    } else {
      post.slug = foundPost.slug;
    }

    if (req.file) {
      const imgPath = path.join(
        __dirname,
        `../../public/imgs/postsimgs/${req.user.id}/${post.slug}`
      );

      await mkdirp(imgPath);

      const targetPath = path.join(imgPath, req.file.filename);

      await fs.copyFile(req.file.path, targetPath);

      await fs.unlink(req.file.path);

      post.img = targetPath;

      const oldimgPath = path.join(
        __dirname,
        `../../public/imgs/postsimgs/${req.user.id}/${foundPost.slug}`
      );

      if (oldimgPath != imgPath) {
        try {
          await fs.access(oldimgPath);
          await fs.rm(oldimgPath, { recursive: true, force: true });
        } catch (error) {
          console.log(`folder at ${oldimgPath} not found.`);
        }
      } else {
        await fs.unlink(foundPost.img);
      }
    }

    post = await Post.findOneAndUpdate(foundPost._id, post, { new: true });

    res.status(200).json({
      data: {
        post,
        message: "post updated successfully",
        status: 200,
      },
    });
  } catch (err) {
    next(err);
  }
};
// delete one
const deleteOne = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!Post.isValidId(id)) throw myError(400, "post id not found");

    const foundPost = await Post.findById(id);

    if (!foundPost) throw myError(404, "Post not found");

    if (foundPost.author != req.user.id)
      throw myError(401, "unauthorized  action. cant delete this post");

    await Post.findByIdAndDelete(foundPost._id);

    const imgPath = path.join(
      __dirname,
      `../../public/imgs/postsimgs/${req.user.id}/${foundPost.slug}`
    );

    try {
      await fs.access(imgPath);
      await fs.rm(imgPath, { recursive: true, force: true });
    } catch (error) {
      console.log(`folder at ${imgPath} not found.`);
    }

    res.status(200).json({
      data: {
        message: "post deleted successfully",
        status: 200,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};
