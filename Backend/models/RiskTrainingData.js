const mongoose = require("mongoose");

const riskTrainingDataSchema = new mongoose.Schema(
    {
        applicationId: {
            type: String,
            required: true,
            unique: true,
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
            trim: true
        },

        industry: {
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

        investment: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            required: true,
            trim: true
        },

        riskScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        riskLevel: {
            type: String,
            enum: ["Low", "Medium", "High"],
            required: true
        },

        riskRecommendation: {
            type: String,
            default: ""
        },

        submittedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "RiskTrainingData",
    riskTrainingDataSchema
);