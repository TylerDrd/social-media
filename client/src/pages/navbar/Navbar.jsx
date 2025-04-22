import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../state";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="navbar">
      <div className="logo-container" onClick={() => navigate("/home")}>
        <h1 className="logo">Sociopedia</h1>
      </div>

      <div className="icon-container">        
          <span className="user-name">{fullName}</span>
          <button className="logout-button" onClick={() => dispatch(setLogout())}>
            Log Out
          </button>    
      </div>
    </div>
  );
};

export default Navbar;
