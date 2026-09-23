const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema(
    {
        // ----------------------------------------
        // Application Reference
        // ----------------------------------------

        applicationId: {
            type: String,
            required: true,
            trim: true
        },

        // ----------------------------------------
        // Business Information
        // ----------------------------------------

        businessName: {
            type: String,
            required: true,
            trim: true
        },

        // ----------------------------------------
        // Departments involved
        // ----------------------------------------

        departments: [
            {
                type: String,
                trim: true
            }
        ],

        // ----------------------------------------
        // Inspection Officers
        // ----------------------------------------

        officers: [
            {
                officerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                officerName: {
                    type: String,
                    trim: true
                },

                department: {
                    type: String,
                    trim: true
                },

                status: {
                    type: String,
                    enum: [
                        "Pending",
                        "Confirmed",
                        "Declined"
                    ],
                    default: "Pending"
                }
            }
        ],

        // ----------------------------------------
        // Suggested Inspection Date
        // ----------------------------------------

        suggestedDate: {
            type: Date,
            default: null
        },

        // ----------------------------------------
        // Final Inspection Date
        // ----------------------------------------

        scheduledDate: {
            type: Date,
            default: null
        },

        // ----------------------------------------
        // Inspection Location
        // ----------------------------------------

        location: {
            type: String,
            trim: true,
            default: ""
        },

        // ----------------------------------------
        // Inspection Status
        // ----------------------------------------

        status: {
            type: String,
            enum: [
                "Coordination Required",
                "Date Suggested",
                "Scheduled",
                "Completed",
                "Cancelled"
            ],
            default: "Coordination Required"
        },

        // ----------------------------------------
        // Notes
        // ----------------------------------------

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        // ----------------------------------------
        // Whether this is a joint inspection
        // ----------------------------------------

        isJointInspection: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);


const Inspection =
    mongoose.model(
        "Inspection",
        inspectionSchema
    );


module.exports = Inspection;