import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import "../style/main.css";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
const apiUrl = import.meta.env.VITE_API_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: {},
    newRequests: 0,
    salaryData: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/emp/users`)
      .then((response) => {
        const employees = response.data.employees; // Fix: Access correct array

        if (!employees) {
          console.error("No employees found in response");
          setLoading(false);
          return;
        }

        // Total Employees
        const totalEmployees = employees.length;

        // Count Active Employees
        const activeEmployees = employees.filter((emp) => emp.status === "Active").length;

        // Count Departments & Salaries
        const departmentCount = {};
        const salaryData = {};
        employees.forEach((emp) => {
          const dept = emp.department;
          if (dept) {
            departmentCount[dept] = (departmentCount[dept] || 0) + 1;
            salaryData[dept] = (salaryData[dept] || 0) + emp.salary;
          }
        });

        // Count New Joiners in the Last 30 Days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newRequests = employees.filter(
          (emp) => new Date(emp.joiningDate) >= thirtyDaysAgo
        ).length;

        setStats({
          totalEmployees,
          activeEmployees,
          departments: departmentCount,
          newRequests,
          salaryData,
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        setLoading(false);
      });
  }, []);

  // Employee Growth Data (Dummy Example)
  const employeeGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Employee Growth",
        data: [120, 128, 135, 142, 147, stats.totalEmployees],
        borderColor: "#3498db",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // Department-wise Employee Count
  const departmentDistributionData = {
    labels: Object.keys(stats.departments),
    datasets: [
      {
        data: Object.values(stats.departments),
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6"],
      },
    ],
  };

  // Salary Distribution Pie Chart
  const salaryDistributionData = {
    labels: Object.keys(stats.salaryData),
    datasets: [
      {
        data: Object.values(stats.salaryData),
        backgroundColor: ["#1abc9c", "#f39c12", "#c0392b", "#8e44ad", "#2980b9"],
      },
    ],
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <><Sidebar/>
    <TopBar/>
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <div className="stat-number">{stats.totalEmployees}</div>
        </div>
        <div className="stat-card">
          <h3>Active Employees</h3>
          <div className="stat-number">{stats.activeEmployees}</div>
        </div>
        <div className="stat-card">
          <h3>New Requests (Last 30 Days)</h3>
          <div className="stat-number">{stats.newRequests}</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3 className="chart-title">Employee Growth</h3>
          <Line data={employeeGrowthData} />
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Department Distribution</h3>
          <Pie data={departmentDistributionData} />
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Salary Distribution by Department</h3>
          <Pie data={salaryDistributionData} />
        </div>
      </div>
    </div>
    </>
  );
}

export default AdminDashboard;
