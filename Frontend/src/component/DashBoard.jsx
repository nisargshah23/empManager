import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Dashboard.css";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [employees, setEmployees] = useState([]); 
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // "All", "Active", "Inactive"
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const employeesPerPage = 5;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/emp/users`);
        console.log(response.data); 

        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else if (response.data && Array.isArray(response.data.employees)) {
          setEmployees(response.data.employees);
        } else {
          console.error("Unexpected API response format:", response.data);
          setEmployees([]); 
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // 🔍 **Search and Filter Logic**
  const filteredEmployees = employees
    .filter((employee) => 
      employee?.name?.toLowerCase().includes(search.toLowerCase()) || 
      employee?.department?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((employee) => 
      statusFilter === "All" || employee?.status === statusFilter
    );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (empId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/api/emp/delete/${empId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setEmployees(employees.filter(emp => emp._id !== empId));
      } else {
        console.error(result.message || "Delete failed!");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <>
      <Sidebar />
      <TopBar />

      <div id="dashboard-container">
        <h2 id="dashboard-title">Company Employees</h2>

        {/* 🔍 Search & Filter Section */}
        <div id="dashboard-filters">
          <input
            type="text"
            id="dashboard-search"
            placeholder="Search by Name or Department"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select id="dashboard-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* 📝 Employee Table */}
        <table id="dashboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Status</th>
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
            ) : currentEmployees.length > 0 ? (
              currentEmployees.map((employee, num) => (
                <tr key={employee._id}>
                  <td>{num + 1 + (currentPage - 1) * employeesPerPage}</td>
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
                    <span className={`dashboard-badge ${employee.status.toLowerCase()}`}>{employee.status}</span>
                  </td>
                  <td>{new Date(employee.joiningDate).toLocaleDateString("en-GB")}</td>
                  <td>
                    <Link className="dashboard-action-btn" to={`/UpdateDetails/${employee._id}`}><FaEdit /></Link>
                    <MdDelete onClick={() => handleDelete(employee._id)} className="delete-btn" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 📌 Pagination */}
        {filteredEmployees.length > employeesPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
