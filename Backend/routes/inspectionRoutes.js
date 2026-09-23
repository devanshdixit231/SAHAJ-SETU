const express = require("express");

const {
    createInspection,
    getInspectionByApplication,
    getAllInspections,
    scheduleInspection,
    updateInspectionStatus
} = require("../controllers/inspectionController");

const protect = require("../middleware/authMiddleware");
const officerOnly = require("../middleware/officerMiddleware");

const router = express.Router();


// =====================================================
// CREATE JOINT INSPECTION - OFFICER
// =====================================================

router.post(
    "/",
    protect,
    officerOnly,
    createInspection
);


// =====================================================
// GET INSPECTION BY APPLICATION ID
// Applicant can view their own inspection.
// Officer can view any inspection.
// =====================================================

router.get(
    "/:applicationId",
    protect,
    getInspectionByApplication
);


// =====================================================
// GET ALL INSPECTIONS - OFFICER
// =====================================================

router.get(
    "/officer/all",
    protect,
    officerOnly,
    getAllInspections
);


// =====================================================
// SCHEDULE INSPECTION - OFFICER
// =====================================================

router.patch(
    "/:applicationId/schedule",
    protect,
    officerOnly,
    scheduleInspection
);


// =====================================================
// UPDATE INSPECTION STATUS - OFFICER
// =====================================================

router.patch(
    "/:applicationId/status",
    protect,
    officerOnly,
    updateInspectionStatus
);


module.exports = router;