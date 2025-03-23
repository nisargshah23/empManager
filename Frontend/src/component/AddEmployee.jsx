import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/AddEmployee.css";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    position: "",
    department: "HR",
    salary: "",
    role: "employee",
    status: "Active",
    joiningDate: "",
    emergencyContact: "", // JSON string format
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("https://via.placeholder.com/100");
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle emergency contact change
  const handleEmergencyContactChange = (e) => {
    try {
      setFormData({ ...formData, emergencyContact: e.target.value });
    } catch (error) {
      console.error("Invalid JSON format for emergency contact");
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Adding Employee...");

    const data = new FormData();

    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append profile image if available
    if (profileImage) {
      data.append("image", profileImage);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/emp/add", data, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", // Ensures form-data format
        },
      });

      if (response.status === 201) {
        setMessage("Employee added successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage(response.data.message || "Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      setMessage(error.response?.data?.message || "Error adding employee.");
    }
  };

  return (
    <>
      <Sidebar />
      <TopBar />
      <div className="add-employee-container">
        <h2>Add New Employee</h2>

        <form onSubmit={handleSubmit} className="add-employee-form">
          <div className="form-section">
            <h3>Personal Information</h3>

            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />

            <label>Profile Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <img src={previewImage} alt="Profile Preview" className="profile-preview" />
          </div>

          <div className="form-section">
            <h3>Job Details</h3>

            <label>Position:</label>
            <input type="text" name="position" value={formData.position} onChange={handleChange} required />

            <label>Department:</label>
            <select name="department" value={formData.department} onChange={handleChange}>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Admin">Admin</option>
            </select>

            <label>Salary:</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />

            <label>Date of Joining:</label>
            <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />

            <label>Status:</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Terminated">Terminated</option>
            </select>

            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            <label>Emergency Contact (JSON Format):</label>
            
          </div>

          <button type="submit">Add Employee</button>
        </form>

        {message && <p className="add-employee-message">{message}</p>}
      </div>
    </>
  );
};

export default AddEmployee;
