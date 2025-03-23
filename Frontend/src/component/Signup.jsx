import React, { useState } from "react";
import axios from "axios";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Auth.css";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!userData.name || !userData.email || !userData.password || !userData.confirmPassword) {
      toast.error("Please fill in all fields.", { autoClose: 60000 });
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match.", { autoClose: 60000 });
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username: userData.email,
        password: userData.password,
        role: userData.role,
      });

      toast.success(response.data.message || "Registration successful!", { autoClose: 60000 });

      setTimeout(() => navigate("/dashboard"), 2000); // Redirect after 2s
    } catch (err) {
      console.log(err.response)
      toast.error(err.response.data.error || "Registration failed", { autoClose: 60000 });
    }
  };

  return (
    <div className="login-main">
      <ToastContainer position="top-right" /> {/* Toast messages will appear here */}
      
      <div className="login-left">
        <img src={Image} alt="Background" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Sign Up</h2>
            <p>Create a new account</p>

            <form onSubmit={handleSignup}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={userData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
              />

              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="pass-input-div">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                />
                {showConfirmPassword ? (
                  <FaEyeSlash onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                ) : (
                  <FaEye onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                )}
              </div>

              {/* Role Dropdown */}
              <select name="role" value={userData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="login-center-buttons">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Already have an account? <a href="/">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
