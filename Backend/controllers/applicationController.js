const Application = require("../models/Application");
const { calculateRiskScore } = require("../services/riskScoringService");
const { predictDelay } = require("../services/delayPredictionService");


// ============================================================
// CREATE APPLICATION
// ============================================================

const createApplication = async (req, res) => {
    try {
        console.log("CREATE APPLICATION STARTED");

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            approvalName,
            department,
            approvalType,
            state,
            industry,
            investment,
            applicantName,
            businessName,
            district,
            address
        } = req.body;

        // ----------------------------------------
        // Validate required fields
        // ----------------------------------------

        if (
            !approvalName ||
            !department ||
            !approvalType ||
            !state ||
            !industry ||
            !investment ||
            !applicantName ||
            !businessName ||
            !district
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required application fields."
            });
        }

        // ----------------------------------------
        // Generate Application ID
        // ----------------------------------------

        const year = new Date().getFullYear();

        const randomNumber = Math.floor(
            100000 + Math.random() * 900000
        );

        const applicationId = `SS-${year}-${randomNumber}`;

        // ----------------------------------------
        // Prepare document
        // ----------------------------------------

        const documents = [];

        if (req.file) {
            documents.push({
                originalName: req.file.originalname,
                fileName: req.file.filename,
                filePath: req.file.path,
                uploadedAt: new Date()
            });
        }

        // ----------------------------------------
        // Create Application
        // ----------------------------------------

        const application = await Application.create({
            applicationId,

            userId: req.user.id,

            approvalName,
            department,
            approvalType,

            state,
            industry,
            investment,

            applicantName,
            businessName,
            district,
            address: address || "",

            documents,

            status: "Submitted",

            submittedAt: new Date()
        });

        console.log(
            "APPLICATION CREATED:",
            application.applicationId
        );

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully.",
            application: {
                applicationId: application.applicationId,
                approvalName: application.approvalName,
                department: application.department,
                status: application.status,
                submittedAt: application.submittedAt
            }
        });

    } catch (error) {

        console.error(
            "CREATE APPLICATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create application."
        });
    }
};


// ============================================================
// GET MY APPLICATIONS
// ============================================================

const getMyApplications = async (req, res) => {
    try {

        const applications = await Application.find({
            userId: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {

        console.error(
            "GET MY APPLICATIONS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications."
        });
    }
};


// ============================================================
// GET SINGLE APPLICATION
// ============================================================

const getApplicationById = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const application = await Application.findOne({
            applicationId,
            userId: req.user.id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        return res.status(200).json({
            success: true,
            application
        });

    } catch (error) {

        console.error(
            "GET APPLICATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch application."
        });
    }
};


// ============================================================
// GET ALL APPLICATIONS - OFFICER
// ============================================================

const getAllApplications = async (req, res) => {
    try {

        const applications = await Application.find()
            .populate(
                "userId",
                "name email phone"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {

        console.error(
            "GET ALL APPLICATIONS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications."
        });
    }
};


// ============================================================
// UPDATE APPLICATION STATUS - OFFICER
// ============================================================

const updateApplicationStatus = async (req, res) => {
    try {

        const { applicationId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Submitted",
            "Under Review",
            "Approved",
            "Rejected",
            "Query Raised"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status."
            });
        }

        const application = await Application.findOne({
            applicationId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        application.status = status;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
            application: {
                applicationId: application.applicationId,
                status: application.status
            }
        });

    } catch (error) {

        console.error(
            "UPDATE STATUS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update application status."
        });
    }
};


// ============================================================
// CALCULATE RISK ASSESSMENT - OFFICER
// ============================================================

const calculateApplicationRisk = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const application = await Application.findOne({
            applicationId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        // ----------------------------------------
        // Calculate risk
        // ----------------------------------------

        const riskResult =
        await calculateRiskScore(application);

        // ----------------------------------------
        // Save risk data
        // ----------------------------------------

        application.riskScore = riskResult.score;

        application.riskLevel = riskResult.riskLevel;

        application.riskFactors = riskResult.riskFactors;

        application.riskRecommendation =
            riskResult.recommendation;

        application.riskCalculatedAt =
            new Date();

        await application.save();

        return res.status(200).json({
            success: true,
            message:
                "Risk assessment calculated successfully.",

            risk: {
                applicationId:
                    application.applicationId,

                score:
                    application.riskScore,

                level:
                    application.riskLevel,

                factors:
                    application.riskFactors,

                recommendation:
                    application.riskRecommendation,

                calculatedAt:
                    application.riskCalculatedAt
            }
        });

    } catch (error) {

        console.error(
            "RISK ASSESSMENT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to calculate risk assessment."
        });
    }
};


// ============================================================
// PREDICT APPLICATION DELAY - OFFICER
// ============================================================

const predictApplicationDelay = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const application = await Application.findOne({
            applicationId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        // ----------------------------------------
        // Calculate delay prediction
        // ----------------------------------------

        const delayPrediction =
            predictDelay(application);

        return res.status(200).json({

            success: true,

            message:
                "Delay prediction calculated successfully.",

            delayPrediction: {

                applicationId:
                    application.applicationId,

                expectedProcessingTime:
                    delayPrediction.expectedProcessingTime,

                minimumDays:
                    delayPrediction.minimumDays,

                maximumDays:
                    delayPrediction.maximumDays,

                delayRisk:
                    delayPrediction.delayRisk,

                predictedDelayDays:
                    delayPrediction.predictedDelayDays,

                reasons:
                    delayPrediction.reasons,

                calculatedAt:
                    new Date()
            }
        });

    } catch (error) {

        console.error(
            "DELAY PREDICTION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to calculate delay prediction."
        });
    }
};


// ============================================================
// EXPORT CONTROLLERS
// ============================================================

module.exports = {

    createApplication,

    getMyApplications,

    getApplicationById,

    getAllApplications,

    updateApplicationStatus,

    calculateApplicationRisk,

    predictApplicationDelay

};