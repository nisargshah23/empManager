const express = require("express");
const Employee = require("../models/Employee");
const { authenticate, authorize } = require("./authRoutes");


const attendace = express.Router();

const moment = require("moment"); 

attendace.post("/checkIn", async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body)
        // Find employee by email
        const employee = await Employee.findOne({ email });
        console.log(employee)
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Get today's date in YYYY-MM-DD format
        const todayDate = moment().format("YYYY-MM-DD");

        // Check if the employee has already checked in today
        const alreadyCheckedIn = employee.attendance.some(entry => entry.date === todayDate);

        if (alreadyCheckedIn) {
            return res.status(400).json({ error: "Already checked in today!" });
        }

        // Add check-in time to attendance array
        employee.attendance.push({
            date: todayDate,
            checkInTime: new Date(), // Store the check-in timestamp
        });

        await employee.save();

        res.status(200).json({
            success: true,
            message: "Check-in recorded successfully!",
            attendance: employee.attendance,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = attendace;