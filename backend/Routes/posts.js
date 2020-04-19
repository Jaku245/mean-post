const express = require("express");

const PostController = require("../controller/posts");

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const Routes = express.Router();

Routes.post("",checkAuth, extractFile, PostController.savePost );

Routes.get("/:id", PostController.getPost);

Routes.get("", PostController.getPosts);

Routes.put("/:id",checkAuth, extractFile, PostController.updatePost);

Routes.delete("/:id",checkAuth , PostController.deletePost);

module.exports = Routes;
