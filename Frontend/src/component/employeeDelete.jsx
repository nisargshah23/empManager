import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DeleteEmployee = () => {
  const { id } = useParams(); // Get employee ID from the URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      handleDelete(id);
    }
  }, [id]);

  const handleDelete = async (empId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) {
      navigate("/dashboard"); // Redirect if canceled
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/emp/update/delete/${empId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Employee deleted successfully!");
        setTimeout(() => navigate("/dashboard"), 1500); // Redirect after success
      } else {
        setMessage(result.message || "Delete failed!");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setMessage("Error deleting employee.");
    }
  };

  return (
    <div className="delete-container">
      <h2>Deleting Employee...</h2>
      {message && <p className="delete-message">{message}</p>}
    </div>
  );
};

export default DeleteEmployee;
