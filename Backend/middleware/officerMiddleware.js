const officerOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.role !== "officer") {
        return res.status(403).json({
            success: false,
            message: "Officer access required."
        });
    }

    next();
};

module.exports = officerOnly;