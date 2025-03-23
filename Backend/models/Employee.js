const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }, // Employee contact number
    address: { type: String }, // Employee home address
    position: { type: String, required: true },
    department: { type: String, required: true, enum: ["HR", "IT", "Sales", "Finance", "Admin"] }, // Only specific departments
    joiningDate: { type: Date, required: true, default: Date.now }, // Date of joining
    status: { type: String, default: "Active", enum: ["Active", "Inactive", "Terminated"] }, // Employment status
    salary: { type: Number, required: true }, // Monthly salary
    role: { type: String, default: "employee", enum: ["admin", "employee"] }, // Role-based access
    profileImage: { type: String }, // Cloudinary image URL
    attendance: [
        {
            date: { type: Date, default: Date.now },
            checkIn: { type: String },
            checkOut: { type: String }
        }
    ],
    performance: {
        rating: { type: Number, min: 1, max: 5 }, // Performance rating (1 to 5)
        feedback: { type: String } // Manager feedback
    }
}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);
