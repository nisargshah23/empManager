import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/updateProfile.css";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
const apiUrl = import.meta.env.VITE_API_URL;

const UpdateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    position: "",
    department: "",
    phone: "",
    address: "",
    salary: "",
    dateOfJoining: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("https://via.placeholder.com/100");
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole);

    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/emp/users`);
        const data = await response.json();

        const employee = data.employees.find(emp => emp._id === id);
        if (employee) {
          setFormData({
            email: employee.email,
            name: employee.name,
            position: employee.position,
            department: employee.department,
            phone: employee.phone,
            address: employee.address,
            salary: employee.salary,
            dateOfJoining: employee.joiningDate.split("T")[0],
          });

          if (employee.profileImage) {
            setPreviewImage(employee.profileImage);
          }
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Updating...");

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (profileImage) {
      data.append("image", profileImage);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/emp/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Profile updated successfully!");

        setTimeout(() => {
          navigate("/dashboard"); // Redirect after success
        }, 1500);
      } else {
        setMessage(result.message || "Update failed!");
      }
    } catch (error) {
      console.error("Error updating:", error);
      setMessage("Error updating profile.");
    }
  };

  return (
    <>
      <Sidebar />
      <TopBar />

      <div className="update-profile-container">
        <h2>Update Employee Details</h2>

        <form onSubmit={handleSubmit} className="update-profile-form">
          
          {/* ✅ Personal Details */}
          <div className="form-section">
            <h3>Personal Information</h3>

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} disabled />

            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />

            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />

            <label>Profile Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* ✅ Job Details */}
          <div className="form-section">
            <h3>Job Details</h3>

            <label>Position:</label>
            <input type="text" name="position" value={formData.position} onChange={handleChange} />

            <label>Department:</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} />

            {/* ✅ Show Salary field ONLY if the user is an admin */}
            {userRole === "admin" && (
              <>
                <label>Salary:</label>
                <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
              </>
            )}

            <label>Date of Joining:</label>
            <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} />

            <img src={previewImage} alt="Profile Preview" className="profile-preview" />
          </div>

          <button type="submit">Update</button>
        </form>

        {message && <p className="update-profile-message">{message}</p>}
      </div>
    </>
  );
};

export default UpdateDetails;
