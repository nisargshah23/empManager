const express = require("express");
const Employee = require("../models/Employee");
const { authenticate, authorize } = require("./authRoutes");
const cloudinary = require("cloudinary").v2;
const employeeAttendance=require("../routes/employeeAttendance")
const moment = require("moment");
const { upload } = require("../utils/upload");
const mongoose = require('mongoose');



const router = express.Router();

router.use("/attendance", employeeAttendance);


// Upload Employee Profile Image (Only Admin)
router.post("/upload", authenticate, authorize(["admin"]), upload.single("image"), async (req, res) => {
    try {
        res.json({ imageUrl: req.file.path });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Employee with Profile Image


// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

router.get("/users", async (req, res) => {
    try {
        const employees = await Employee.find(); // Fetch all employees
        res.status(200).json({ success: true, employees });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/add", authenticate, authorize(["user"]), upload.single("image"), async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone,
            password, 
            position, 
            department, 
            salary, 
            role, 
            status, 
            joiningDate, 
            emergencyContact 
        } = req.body;

        let profileImage = "";

        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "employee_profiles", // Upload folder in Cloudinary
                use_filename: true,
                unique_filename: false
            });
            profileImage = result.secure_url; // Cloudinary URL
        }

        
        const employee = new Employee({
            name,
            email,
            phone,
            password,
            position,
            department,
            salary,
            role: role || "employee", // Default role
            status: status || "active", // Default status
            joiningDate: joiningDate || new Date(),
            profileImage,
            attendance: [],
            leaveBalance: 20, // Default leave balance
            emergencyContact: emergencyContact ? JSON.parse(emergencyContact) : null
        });

        await employee.save();
        res.status(201).json({ success: true, message: "Employee added successfully", employee });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


router.put("/update/:id", authenticate, authorize(["user"]), upload.single("image"), async (req, res) => {
    try {
        const { name, email, position, department, phone, address, salary, dateOfJoining } = req.body;
        let profileImage = "";
        const id = req.params.id;  

        // Upload image to Cloudinary if a new file is provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "employee_profiles",
                use_filename: true,
                unique_filename: false
            });
            profileImage = result.secure_url; // Cloudinary URL
        }

        // Update employee details
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,  
            { 
                name, 
                position, 
                department, 
                phone, 
                address, 
                salary, 
                dateOfJoining, 
                ...(profileImage && { profileImage }) 
            },
            { new: true } // Return updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.status(200).json({ success: true, message: "Employee updated successfully", employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete("/delete/:id", authenticate, authorize(["admin"]), async (req, res) => {
    try {
        const stringId = req.params.id;

        // Find the employee
        const employee = await Employee.findById( new mongoose.Types.ObjectId(stringId));
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // If employee has a profile image, delete it from Cloudinary
        if (employee.profileImage) {
            const publicId = employee.profileImage.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
            await cloudinary.uploader.destroy(`employee_profiles/${publicId}`);
        }

        // Delete the employee from the database
        await Employee.findByIdAndDelete(Obid);

        res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});




router.post("/checkIn", async (req, res) => {
    try {
        const { email } = req.body;

        // Find employee by email
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Get current date and time
        const todayDate = moment().format("YYYY-MM-DD");
        const checkInTime = moment().format("HH:mm:ss");

        // Check if already checked in today
        const alreadyCheckedIn = employee.attendance.some(
            (record) => moment(record.date).format("YYYY-MM-DD") === todayDate
        );

        if (alreadyCheckedIn) {
            return res.status(400).json({ error: "Already checked in today" });
        }

        // Add check-in record
        employee.attendance.push({ date: new Date(), checkIn: checkInTime });

        // Save changes
        await employee.save();

        res.status(200).json({ success: true, message: "Check-in recorded", checkInTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/checkOut", async (req, res) => {
    try {
        const { email } = req.body;

        // Find employee by email
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Get current date and time
        const todayDate = moment().format("YYYY-MM-DD");
        const checkOutTime = moment().format("HH:mm:ss");

        // Find today's attendance record
        const todayAttendance = employee.attendance.find(
            (record) => moment(record.date).format("YYYY-MM-DD") === todayDate
        );

        if (!todayAttendance) {
            return res.status(400).json({ error: "Check-in required before check-out" });
        }

        if (todayAttendance.checkOut) {
            return res.status(400).json({ error: "Already checked out today" });
        }

        // Update check-out time
        todayAttendance.checkOut = checkOutTime;

        // Save changes
        await employee.save();

        res.status(200).json({ success: true, message: "Check-out recorded", checkOutTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
