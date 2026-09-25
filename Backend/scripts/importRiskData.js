require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parse/sync");

const connectDB = require("../config/db");
const RiskTrainingData = require("../models/RiskTrainingData");

const CSV_PATH = path.join(
    __dirname,
    "../../SAHAJ_SETU_Officer_Dashboard_Proxy_Data.csv"
);

const importRiskData = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await connectDB();

        console.log("Reading proxy dataset...");

        if (!fs.existsSync(CSV_PATH)) {
            throw new Error(
                `CSV file not found at: ${CSV_PATH}`
            );
        }

        const fileContent = fs.readFileSync(
            CSV_PATH,
            "utf8"
        );

        const records = csv.parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        console.log(
            `Found ${records.length} records in CSV.`
        );

        const formattedRecords = records.map((row) => ({
            applicationId:
                row["Application ID"],

            applicantName:
                row["Applicant Name"],

            businessName:
                row["Business Name"],

            district:
                row["District"],

            industry:
                row["Industry"],

            department:
                row["Department"],

            approvalType:
                row["Approval Type"],

            investment:
                Number(
                    row["Investment (₹ Cr)"]
                ),

            status:
                row["Status"],

            riskScore:
                Number(
                    row["Risk Score"]
                ),

            riskLevel:
                row["Risk Level"],

            riskRecommendation:
                row["Risk Recommendation"],

            submittedAt:
                new Date(
                    row["Submitted At"]
                )
        }));

        console.log(
            "Clearing previous training data..."
        );

        await RiskTrainingData.deleteMany({});

        console.log(
            "Inserting proxy training data..."
        );

        const inserted =
            await RiskTrainingData.insertMany(
                formattedRecords
            );

        console.log(
            `Successfully inserted ${inserted.length} records.`
        );

        console.log(
            "Risk training dataset imported successfully."
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "RISK DATA IMPORT ERROR:",
            error
        );

        process.exit(1);
    }
};

importRiskData();