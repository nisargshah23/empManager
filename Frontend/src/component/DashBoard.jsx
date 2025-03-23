import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Dashboard.css";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router";
import { MdDelete } from "react-icons/md";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]); // ✅ Ensure it's an array
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const employeesPerPage = 5;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/emp/users");

        console.log(response.data); // ✅ Check API response structure

        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else if (response.data && Array.isArray(response.data.employees)) {
          setEmployees(response.data.employees);
        } else {
          console.error("Unexpected API response format:", response.data);
          setEmployees([]); // ✅ Prevent errors if API response is invalid
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]); //  Set empty array to prevent errors
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Ensure employees is always an array before calling filter
  const filteredEmployees = employees?.filter((employee) =>
    employee?.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


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
    <>
    <Sidebar/>
    <TopBar/>
    
    <div id="dashboard-container">
      <h2 id="dashboard-title">Company Employees</h2>

      <div id="dashboard-filters">
        <input
          type="text"
          id="dashboard-search"
          placeholder="Search Employee"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select id="dashboard-status">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <table id="dashboard-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Contact</th>
            <th>Requests</th>
            <th>Hire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(employeesPerPage)].map((_, index) => (
              <tr key={index} className="skeleton-row">
                <td className="skeleton"></td>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton"></td>
                <td className="skeleton skeleton-text"></td>
                <td className="skeleton"></td>
              </tr>
            ))
          ) : (
            currentEmployees.map((employee,num) => (
              <tr key={employee._id}>
                <td>{num+1}</td>
                <td>
                  <img src={employee.profileImage} className="profile-img" alt="Profile" width="50" height="50"/>
                  {employee.name}
                </td>
                <td>{employee.department}</td>
                <td>
                  {employee.contact} <br />
                  <small>{employee.email}</small>
                </td>
                <td>
                  <span className="dashboard-badge">{employee.status}</span>
                </td>
                <td>{new Date(employee.joiningDate  ).toLocaleDateString("en-GB")}</td>
                <td>
                   <Link className="dashboard-action-btn" to={`/UpdateDetails/${employee._id}`}><FaEdit/></Link>
                   <MdDelete onClick={()=>handleDelete(employee._id)}/>
                  
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
