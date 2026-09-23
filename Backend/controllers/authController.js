const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ==========================================
// REGISTER USER / OFFICER
// ==========================================

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone,
            department
        } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role === "officer" ? "officer" : "user",
            phone: phone || "",
            department: department || ""
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }
};


// ==========================================
// LOGIN USER / OFFICER
// ==========================================

const login = async (req, res) => {
    try {
        const {
            email,
            password,
            role
        } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Check selected role
        if (role && user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `This account is registered as ${user.role}.`
            });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                department: user.department
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
};


module.exports = {
    register,
    login
};