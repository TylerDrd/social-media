import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id); // Get logged-in user ID

  const getUser = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-content">
        <div className="left-column">
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <div className="spacer" />
          <FriendListWidget userId={userId} />
        </div>
        <div className="center-column">
          {/* Conditionally render MyPostWidget if the profile page belongs to the logged-in user */}
          {loggedInUserId === userId && (
            <>
              <MyPostWidget picturePath={user.picturePath} />
              <div className="spacer" />
            </>
          )}
          <PostsWidget userId={userId} isProfile />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
