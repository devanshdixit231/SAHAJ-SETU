const Inspection = require("../models/Inspection");
const Application = require("../models/Application");


// ============================================================
// CREATE JOINT INSPECTION
// ============================================================

const createInspection = async (req, res) => {
    try {

        const {
            applicationId,
            departments,
            suggestedDate,
            location,
            notes
        } = req.body;


        // ----------------------------------------
        // Validate application
        // ----------------------------------------

        if (!applicationId) {

            return res.status(400).json({
                success: false,
                message: "Application ID is required."
            });
        }


        // ----------------------------------------
        // Find application
        // ----------------------------------------

        const application =
            await Application.findOne({
                applicationId
            });


        if (!application) {

            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }


        // ----------------------------------------
        // Validate departments
        // ----------------------------------------

        if (
            !departments ||
            !Array.isArray(departments) ||
            departments.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "At least one department is required."
            });
        }


        // ----------------------------------------
        // Check existing inspection
        // ----------------------------------------

        const existingInspection =
            await Inspection.findOne({
                applicationId
            });


        if (existingInspection) {

            return res.status(409).json({
                success: false,
                message:
                    "An inspection already exists for this application.",
                inspection:
                    existingInspection
            });
        }


        // ----------------------------------------
        // Create inspection
        // ----------------------------------------

        const inspection =
            await Inspection.create({

                applicationId,

                businessName:
                    application.businessName,

                departments,

                suggestedDate:
                    suggestedDate
                        ? new Date(suggestedDate)
                        : null,

                location:
                    location || application.address || "",

                notes:
                    notes || "",

                status:
                    suggestedDate
                        ? "Date Suggested"
                        : "Coordination Required",

                isJointInspection:
                    departments.length > 1
            });


        return res.status(201).json({

            success: true,

            message:
                "Joint inspection created successfully.",

            inspection
        });


    } catch (error) {

        console.error(
            "CREATE INSPECTION ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to create joint inspection."
        });
    }
};


// ============================================================
// GET INSPECTION BY APPLICATION ID
// ============================================================

const getInspectionByApplication =
    async (req, res) => {

        try {

            const {
                applicationId
            } = req.params;


            const inspection =
                await Inspection.findOne({
                    applicationId
                });


            if (!inspection) {

                return res.status(404).json({

                    success: false,

                    message:
                        "No inspection found for this application."
                });
            }


            return res.status(200).json({

                success: true,

                inspection
            });


        } catch (error) {

            console.error(
                "GET INSPECTION ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch inspection."
            });
        }
    };


// ============================================================
// GET ALL INSPECTIONS - OFFICER
// ============================================================

const getAllInspections =
    async (req, res) => {

        try {

            const inspections =
                await Inspection.find()
                    .sort({
                        createdAt: -1
                    });


            return res.status(200).json({

                success: true,

                count:
                    inspections.length,

                inspections
            });


        } catch (error) {

            console.error(
                "GET ALL INSPECTIONS ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch inspections."
            });
        }
    };


// ============================================================
// SCHEDULE INSPECTION
// ============================================================

const scheduleInspection =
    async (req, res) => {

        try {

            const {
                applicationId
            } = req.params;

            const {
                scheduledDate
            } = req.body;


            if (!scheduledDate) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Scheduled date is required."
                });
            }


            const inspection =
                await Inspection.findOne({
                    applicationId
                });


            if (!inspection) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Inspection not found."
                });
            }


            inspection.scheduledDate =
                new Date(scheduledDate);

            inspection.status =
                "Scheduled";


            await inspection.save();


            return res.status(200).json({

                success: true,

                message:
                    "Joint inspection scheduled successfully.",

                inspection
            });


        } catch (error) {

            console.error(
                "SCHEDULE INSPECTION ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to schedule inspection."
            });
        }
    };


// ============================================================
// UPDATE INSPECTION STATUS
// ============================================================

const updateInspectionStatus =
    async (req, res) => {

        try {

            const {
                applicationId
            } = req.params;

            const {
                status
            } = req.body;


            const allowedStatuses = [

                "Coordination Required",

                "Date Suggested",

                "Scheduled",

                "Completed",

                "Cancelled"

            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid inspection status."
                });
            }


            const inspection =
                await Inspection.findOne({
                    applicationId
                });


            if (!inspection) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Inspection not found."
                });
            }


            inspection.status =
                status;


            await inspection.save();


            return res.status(200).json({

                success: true,

                message:
                    "Inspection status updated successfully.",

                inspection
            });


        } catch (error) {

            console.error(
                "UPDATE INSPECTION STATUS ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update inspection status."
            });
        }
    };


module.exports = {

    createInspection,

    getInspectionByApplication,

    getAllInspections,

    scheduleInspection,

    updateInspectionStatus

};