import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./UserWidget.css";
import UserImage from "../../components/UserImage";


// eslint-disable-next-line react/prop-types
const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

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

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    friends,
    twitter,   // Add these
    linkedin,  // Add these
  } = user;

  return (
    <div className="widget-wrapper">
      {/* FIRST ROW */}
      <div className="user-header" onClick={() => navigate(`/profile/${userId}`)}>
        <div className="user-info">
          <UserImage image={picturePath} />
          <div>
            <h4 className="user-name">{firstName} {lastName}</h4>
            <p className="friends-count">{friends.length} friends</p>
          </div>
        </div>
        <ManageAccountsOutlined />
      </div>

      <hr />

      {/* SECOND ROW */}
      <div className="user-location">
        <LocationOnOutlined fontSize="large" />
        <p>{location}</p>
      </div>
      <div className="user-occupation">
        <WorkOutlineOutlined fontSize="large" />
        <p>{occupation}</p>
      </div>

      <hr />

      {/* THIRD ROW
      <div className="user-stats">
        <div className="stat-item">
          <p>Who viewed your profile</p>
          <p className="stat-number">{viewedProfile}</p>
        </div>
        <div className="stat-item">
          <p>Impressions of your post</p>
          <p className="stat-number">{impressions}</p>
        </div>
      </div>

      <hr /> */}

      {/* THIRD ROW */}
      <div className="social-profiles">
        <h4>Social Profiles</h4>
        {twitter && (
          <div className="profile-item">
            <img src="/twitter.png" alt="twitter" />
            <div>
              <p className="profile-title">Twitter</p>
              <p>Social Network</p>
            </div>
            <a href={twitter} target="_blank" rel="noopener noreferrer">
              <EditOutlined />
            </a>
          </div>
        )}
        {linkedin && (
          <div className="profile-item">
            <img src="/linkedin.png" alt="linkedin" />
            <div>
              <p className="profile-title">LinkedIn</p>
              <p>Network Platform</p>
            </div>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <EditOutlined />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWidget;
