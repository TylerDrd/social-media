import express from "express";
import { getFeedPosts, getUserPosts, likePost, addComment, getS3Url } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/s3Url", getS3Url);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch('/:id/comment', addComment);

export default router;