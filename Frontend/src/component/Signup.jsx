import React, { useState } from "react";
import axios from "axios";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../style/Auth.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!userData.name || !userData.email || !userData.password || !userData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/dashboard"); // Redirect to dashboard after signup
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-main">
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
            {error && <p className="error">{error}</p>}
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
