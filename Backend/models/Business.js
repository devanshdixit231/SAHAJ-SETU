const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        businessName: {
            type: String,
            required: true,
            trim: true
        },

        businessType: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        district: {
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

        address: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Business =
    mongoose.model("Business", businessSchema);

module.exports = Business;