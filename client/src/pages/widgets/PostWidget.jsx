/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import Friend from "../../components/Friend";
import "./PostWidget.css";
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const patchLike = async () => {
    
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleComment = async () => {
    
    const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, text: commentText }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setCommentText("");
  };

  return (
    <div className="post-widget-container">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <p className="post-description">{description}</p>
      {picturePath && (
        <img
          className="post-image"
          src={`${API_URL}/assets/${picturePath}`}
          alt="post"
        />
      )}
      <div className="post-actions">
        <div className="like-comment-section">
          <div className="like-section">
            <button onClick={patchLike} className="icon-button">
              {isLiked ? (
                <FavoriteOutlined className="icon-liked" />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </button>
            <span>{likeCount}</span>
          </div>
          <div className="comment-section">
            <button
              onClick={() => setIsComments(!isComments)}
              className="icon-button"
            >
              <ChatBubbleOutlineOutlined />
            </button>
            <span>{comments.length}</span>
          </div>
        </div>
        <button className="icon-button">
          <ShareOutlined />
        </button>
      </div>
      {isComments && (
        <div className="comments-section">
          {comments.map((comment, i) => (
            <div key={`${name}-${i}`} className="comment">
              <hr />
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
          <hr />
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleComment}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostWidget;
