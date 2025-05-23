import Post from "../models/Post.js";
import User from "../models/User.js";
import {generateUploadURL} from "../middleware/s3.js";
/* CREATE */
export const createPost = async (req, res) => {
  try {
    console.log(req.body)
    const { userId, description, picturePath } = req.body;
    if (!userId ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); 

    const post = await Post.find(); //grabs all the posts, once saved, we send all posts to frontend
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });;
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;  //post id
    const { userId } = req.body;  //user id who likes or unlikes a post
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true } // we want a new object
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // post id
    const { userId, text } = req.body; // user id and comment text
    const post = await Post.findById(id);
    
    // Add the new comment
    post.comments.push({ userId, text });

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true } // we want a new object
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getS3Url = async (req,res) => {
  try{
    const contentType = req.query.contentType || "image/jpeg";
    const url = await generateUploadURL(contentType)
    res.send({url})
  }catch (err){
    res.status(404).json({ message: err.message });
  }

};
