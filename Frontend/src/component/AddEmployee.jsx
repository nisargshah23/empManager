import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/AddEmployee.css";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const apiUrl = import.meta.env.VITE_API_URL;

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
    emergencyContact: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Adding Employee...");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, key === "emergencyContact" ? JSON.stringify(value) : value);
    });

    if (profileImage) {
      data.append("image", profileImage);
    }

    console.log("Form Data:", [...data.entries()]); // Debugging

    try {
      const response = await axios.post(`${apiUrl}/api/emp/add`, data, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.status === 201) {
        setMessage("Employee added successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage(response.data.message || "Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error.response?.data || error.message);
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
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

          <label>Position:</label>
          <input type="text" name="position" value={formData.position} onChange={handleChange} required />

          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <button type="submit">Add Employee</button>
        </form>

        {message && <p className="add-employee-message">{message}</p>}
      </div>
    </>
  );
};

export default AddEmployee;
