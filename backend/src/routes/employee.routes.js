import express from 'express';
import { Employee } from '../models/employee.model.js';
import { User } from '../models/user.model.js';

const router = express.Router();

// Route to get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find().exec(); // Fetch all employees
    res.status(200).json(employees); // Send the employees as JSON response
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' }); // Handle errors
  }
});


router.post("/update", async (req, res) => {
    try {
        const { name, description, email, mobile } = req.body;

        // if (!email) {
        //     return res.status(400).json({ message: "Email is required" });
        // }

        // Find the existing user by username
        const user = await User.findOne({ $or: [{ name }, { email }] });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // // Check if an employee with the same username already exists
        // const existingEmployee = await Employee.findOne({ username });

        // if (existingEmployee) {
        //     return res.status(400).json({ message: "Employee with this username already exists" });
        // }

        // // Create a new employee
        // const newEmployee = new Employee({
        //     username: user.username, // Use the existing user's username
        //     email: user.email,       // Use the existing user's email
        //     password: user.password, // Use the existing user's password (make sure it's hashed)
        //     role: user.role,         // Use the existing user's role
        //     name,
        //     description,
        //     mobile
        // });

        // // Save the new employee
        // await newEmployee.save();

        return res.status(201).json({ message: "Employee created" });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
