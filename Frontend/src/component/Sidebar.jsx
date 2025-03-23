import React from "react";
import "../style/Sidebar.css"; // Importing the CSS file
import { Link } from "react-router";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo">CuteHR</div>

      {/* Profile Section */} 
      <div className="profile">
        {/* <img src="" alt="Profile" className="profile-img" /> */}
        <div className="profile-info">
          <p className="name">Ethan Antonio</p>
          <p className="role">Centrovo</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="menu">
        <p className="menu-title">Your Apps</p>
        <ul>
          <Link to="/Dashboard"><li>🏢<span className="icon"></span> Company Status</li></Link>
          <li><span className="icon">📂</span> Projects</li>
          <li><span className="icon">📋</span> Reports</li>
        </ul>

        <p className="menu-title">Your Company</p>
        <ul>
        <Link to="/Employees"><li><span className="icon">👥</span> Employees</li></Link>
          <li><span className="icon">📄</span> Payroll</li>
          <li><span className="icon">🔍</span> Applicant Tracking</li>
          <li><span className="icon">🏢</span> Clients</li>
          <li><span className="icon">💰</span> Invoice</li>
          <li><span className="icon">📅</span> Events</li>
          <li><span className="icon">⚙️</span> Settings</li>
        </ul>

        
        
      </div>
    </div>
  );
};

export default Sidebar;
