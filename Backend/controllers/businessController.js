const Business = require("../models/Business");


/* =========================================
   GET MY BUSINESS
   ========================================= */

const getMyBusiness = async (req, res) => {

    try {

        const business =
            await Business.findOne({
                userId: req.user.id
            });

        return res.status(200).json({
            success: true,
            business: business
        });

    } catch (error) {

        console.error(
            "Get business error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error."
        });

    }

};


/* =========================================
   CREATE / UPDATE MY BUSINESS
   ========================================= */

const saveMyBusiness = async (req, res) => {

    try {

        const {
            businessName,
            businessType,
            state,
            district,
            industry,
            investment,
            address
        } = req.body;


        if (
            !businessName ||
            !businessType ||
            !state ||
            !district ||
            !industry ||
            !investment
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required business details."
            });

        }


        const business =
            await Business.findOneAndUpdate(

                {
                    userId: req.user.id
                },

                {
                    userId: req.user.id,
                    businessName,
                    businessType,
                    state,
                    district,
                    industry,
                    investment,
                    address: address || ""
                },

                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }

            );


        return res.status(200).json({
            success: true,
            message:
                "Business profile saved successfully.",
            business: business
        });


    } catch (error) {

        console.error(
            "Save business error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error."
        });

    }

};


module.exports = {
    getMyBusiness,
    saveMyBusiness
};