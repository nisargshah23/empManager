import React, { useState } from "react";
import "../style/Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar initially hidden

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        {isOpen ? "❌" : "☰"} {/* Close (❌) or Open (☰) */}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="logo">CuteHR</div>

        <div className="profile">
          <div className="profile-info">
            <p className="name">Ethan Antonio</p>
            <p className="role">Centrovo</p>
          </div>
        </div>

        <div className="menu">
          <p className="menu-title">Your Apps</p>
          <ul>
            <Link to="/Dashboard"><li>🏢 Company Status</li></Link>
            <Link to="/AddEmployee"><li>📂 Add Employee</li></Link>
          </ul>

          <p className="menu-title">Your Company</p>
          <ul>
            <Link to="/Employees"><li>👥 Employees</li></Link>
            
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
