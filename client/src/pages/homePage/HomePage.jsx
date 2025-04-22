import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
//import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import "./HomePage.css"; // Importing the CSS file

const HomePage = () => {
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <div>
      <Navbar />
      <div className="flex-between" style={{ width: "100%", padding: "2rem 6%", gap: "1rem" }}>
        <div className="column user-column" style={{ flexBasis: "23%" }}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </div>
        <div className="column posts-column" style={{ flexBasis: "45%", marginTop: "2rem" }}>
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </div>
        <div className="column friends-column" style={{ flexBasis: "23%" }}>
          {/* <AdvertWidget /> */}
          <FriendListWidget userId={_id} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
