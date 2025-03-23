import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/TopBar.css";

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token & role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login
    navigate("/");
  };

  return (
    <div id="topbar-container">
      <div id="topbar-right">
        <img
          src="https://res.cloudinary.com/dw10zcf9n/image/upload/v1742635232/employees/profile_1.jpg"
          alt="User Profile"
          id="topbar-profile-img"
        />
        <button id="topbar-logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default TopBar;
