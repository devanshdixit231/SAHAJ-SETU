const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        applicationId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        approvalName: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        approvalType: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        industry: {
            type: String,
            required: true,
            trim: true
        },

        investment: {
            type: String,
            required: true,
            trim: true
        },

        applicantName: {
            type: String,
            required: true,
            trim: true
        },

        businessName: {
            type: String,
            required: true,
            trim: true
        },

        district: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            trim: true,
            default: ""
        },

        documents: [
            {
                originalName: {
                    type: String,
                    required: true
                },

                fileName: {
                    type: String,
                    required: true
                },

                filePath: {
                    type: String,
                    required: true
                },

                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "Approved",
                "Rejected",
                "Query Raised"
            ],
            default: "Submitted"
        },

        submittedAt: {
            type: Date,
            default: Date.now
        },

        // ==============================
        // RISK SCORING
        // ==============================

        riskScore: {
            type: Number,
            default: null,
            min: 0,
            max: 100
        },

        riskLevel: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High"
            ],
            default: null
        },

        riskFactors: [
            {
                type: String
            }
        ],

        riskRecommendation: {
            type: String,
            default: ""
        },

        riskCalculatedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

module.exports = Application;