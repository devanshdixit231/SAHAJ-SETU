const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const User = require("../models/User");

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post("/register", register);


// ==========================================
// LOGIN
// ==========================================

router.post("/login", login);


// ==========================================
// AUTH ROUTE TEST
// ==========================================

router.get("/test", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Auth route is working successfully!"
    });

});


// ==========================================
// GET CURRENT USER
// PROTECTED ROUTE
// ==========================================

router.get("/me", protect, async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        return res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {

        console.error(
            "Get current user error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error."
        });

    }

});


module.exports = router;