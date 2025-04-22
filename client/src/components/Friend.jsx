import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state"
import UserImage from "./UserImage";
import "./Friend.css";

// eslint-disable-next-line react/prop-types
const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(
      `${API_URL}/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <div className="friend-container">
      <div className="friend-info" onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0); //refresh page
          }}>
        <UserImage image={userPicturePath} size="55px" />
        <div className="friend-details">
          <p className="friend-name">{name}</p>
          <p className="friend-subtitle">{subtitle}</p>
        </div>
      </div>
      <button className="friend-button" onClick={()=>patchFriend()}>
        {isFriend ? (
          <PersonRemoveOutlined />
        ) : (
          <PersonAddOutlined />
        )}
      </button>
    </div>
  );
};

export default Friend;
