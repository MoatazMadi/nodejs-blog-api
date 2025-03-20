const express = require("express");
const postController = require("../controllers/postController");
const { upload } = require("../utils/storage");

const postRouter = express.Router();

// index - get all [with pagination]
postRouter.get("/", postController.index);
// get one
postRouter.get("/:slug", postController.getOne);
// create one
postRouter.post("/", upload.single("img"), postController.createOne);
// update one
postRouter.put("/:id", upload.single("img"), postController.updateOne);
// delete one
postRouter.delete("/:id", postController.deleteOne);

module.exports = postRouter;
