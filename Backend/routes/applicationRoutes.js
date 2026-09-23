const express = require("express");

const {
    createApplication,
    getMyApplications,
    getApplicationById,
    getAllApplications,
    updateApplicationStatus,
    calculateApplicationRisk,
    predictApplicationDelay
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const officerOnly = require("../middleware/officerMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ============================================================
// CREATE APPLICATION
// ============================================================

router.post(
    "/",
    protect,

    (req, res, next) => {

        console.log(
            "AUTH PASSED - MULTER STARTING"
        );

        upload.single("document")(
            req,
            res,
            (error) => {

                if (error) {

                    console.error(
                        "MULTER ERROR:",
                        error
                    );

                    return res.status(400).json({
                        success: false,
                        message:
                            error.message ||
                            "File upload failed."
                    });
                }

                console.log(
                    "MULTER FINISHED"
                );

                console.log(
                    "FILE:",
                    req.file
                );

                console.log(
                    "BODY:",
                    req.body
                );

                next();
            }
        );
    },

    createApplication
);


// ============================================================
// APPLICANT - MY APPLICATIONS
// ============================================================

router.get(
    "/me",
    protect,
    getMyApplications
);


// ============================================================
// OFFICER - ALL APPLICATIONS
// ============================================================

router.get(
    "/officer/all",
    protect,
    officerOnly,
    getAllApplications
);


// ============================================================
// OFFICER - UPDATE APPLICATION STATUS
// ============================================================

router.patch(
    "/:applicationId/status",
    protect,
    officerOnly,
    updateApplicationStatus
);


// ============================================================
// OFFICER - RISK ASSESSMENT
// ============================================================

router.get(
    "/:applicationId/risk",
    protect,
    officerOnly,
    calculateApplicationRisk
);


// ============================================================
// OFFICER - DELAY PREDICTION
// ============================================================

router.get(
    "/:applicationId/delay",
    protect,
    officerOnly,
    predictApplicationDelay
);


// ============================================================
// APPLICANT - SINGLE APPLICATION
// ============================================================

router.get(
    "/:applicationId",
    protect,
    getApplicationById
);


module.exports = router;