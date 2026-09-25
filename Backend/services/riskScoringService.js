const RiskTrainingData = require("../models/RiskTrainingData");

/*
=========================================================
SAHAJ SETU - DATASET BASED RISK PREDICTION
=========================================================

This service uses the proxy training dataset stored in:

MongoDB
└── sahaj_setu
    └── risktrainingdatas

Prediction method:
K-Nearest Neighbors (KNN)

The system finds applications from the training dataset
that are most similar to the current application and
uses their historical risk scores to predict the new score.
=========================================================
*/


// =========================================================
// TEXT NORMALIZATION
// =========================================================

const normalizeText = (value) => {

    return String(value || "")
        .trim()
        .toLowerCase();

};


// =========================================================
// INVESTMENT CONVERSION
// =========================================================

const parseInvestment = (value) => {

    if (typeof value === "number") {
        return value;
    }

    const text = normalizeText(value);

    // Direct number such as "6.98"
    const directNumber = parseFloat(text);

    if (!Number.isNaN(directNumber)) {
        return directNumber;
    }

    // Extract number from text
    const match = text.match(/[\d.]+/);

    if (match) {
        return parseFloat(match[0]);
    }

    return 0;
};


// =========================================================
// CATEGORY MATCH
// =========================================================

const categoryMatch = (value1, value2) => {

    const a = normalizeText(value1);
    const b = normalizeText(value2);

    if (!a || !b) {
        return 0;
    }

    if (a === b) {
        return 1;
    }

    // Partial similarity
    if (a.includes(b) || b.includes(a)) {
        return 0.7;
    }

    return 0;
};


// =========================================================
// INVESTMENT SIMILARITY
// =========================================================

const investmentSimilarity = (value1, value2, minInvestment, maxInvestment) => {

    const a = parseInvestment(value1);
    const b = parseInvestment(value2);

    const range = maxInvestment - minInvestment;

    if (range <= 0) {
        return 1;
    }

    const difference = Math.abs(a - b);

    const similarity = 1 - (difference / range);

    return Math.max(0, Math.min(1, similarity));
};


// =========================================================
// APPLICATION SIMILARITY
// =========================================================

const calculateSimilarity = (
    application,
    trainingRecord,
    minInvestment,
    maxInvestment
) => {

    let similarity = 0;

    // Industry - high importance
    similarity +=
        categoryMatch(
            application.industry,
            trainingRecord.industry
        ) * 0.25;


    // Department
    similarity +=
        categoryMatch(
            application.department,
            trainingRecord.department
        ) * 0.15;


    // Approval type
    similarity +=
        categoryMatch(
            application.approvalType,
            trainingRecord.approvalType
        ) * 0.15;


    // Status
    similarity +=
        categoryMatch(
            application.status,
            trainingRecord.status
        ) * 0.10;


    // District
    similarity +=
        categoryMatch(
            application.district,
            trainingRecord.district
        ) * 0.10;


    // Investment
    similarity +=
        investmentSimilarity(
            application.investment,
            trainingRecord.investment,
            minInvestment,
            maxInvestment
        ) * 0.25;


    return similarity;
};


// =========================================================
// RISK LEVEL FROM SCORE
// =========================================================

const getRiskLevel = (score) => {

    if (score < 30) {
        return "Low";
    }

    if (score < 60) {
        return "Medium";
    }

    return "High";
};


// =========================================================
// RECOMMENDATION
// =========================================================

const getRecommendation = (riskLevel) => {

    if (riskLevel === "Low") {

        return "Application can proceed through standard review.";
    }

    if (riskLevel === "Medium") {

        return "Application should undergo standard officer review with additional verification.";
    }

    return "Application requires detailed officer review and verification before approval.";
};


// =========================================================
// MAIN DATASET BASED RISK PREDICTION
// =========================================================

const calculateRiskScore = async (application) => {

    // -----------------------------------------------------
    // LOAD TRAINING DATA FROM MONGODB
    // -----------------------------------------------------

    const trainingData =
        await RiskTrainingData.find({})
            .lean();


    if (!trainingData || trainingData.length === 0) {

        throw new Error(
            "Risk training dataset is empty. Please import the proxy dataset first."
        );
    }


    // -----------------------------------------------------
    // FIND INVESTMENT RANGE
    // -----------------------------------------------------

    const investments =
        trainingData
            .map(record =>
                Number(record.investment)
            )
            .filter(value =>
                !Number.isNaN(value)
            );


    const minInvestment =
        investments.length > 0
            ? Math.min(...investments)
            : 0;


    const maxInvestment =
        investments.length > 0
            ? Math.max(...investments)
            : 100;


    // -----------------------------------------------------
    // CALCULATE SIMILARITY FOR EVERY RECORD
    // -----------------------------------------------------

    const similarityResults =
        trainingData.map(record => {

            const similarity =
                calculateSimilarity(
                    application,
                    record,
                    minInvestment,
                    maxInvestment
                );


            return {
                record,
                similarity
            };

        });


    // -----------------------------------------------------
    // SORT BY MOST SIMILAR
    // -----------------------------------------------------

    similarityResults.sort(
        (a, b) =>
            b.similarity - a.similarity
    );


    // -----------------------------------------------------
    // SELECT TOP K NEIGHBOURS
    // -----------------------------------------------------

    const K = 5;

    const nearestNeighbours =
        similarityResults.slice(0, K);


    // -----------------------------------------------------
    // WEIGHTED RISK SCORE
    // -----------------------------------------------------

    let weightedScore = 0;

    let totalWeight = 0;


    nearestNeighbours.forEach(item => {

        const weight =
            item.similarity + 0.01;

        weightedScore +=
            Number(item.record.riskScore) *
            weight;

        totalWeight += weight;

    });


    let score =
        totalWeight > 0
            ? weightedScore / totalWeight
            : 0;


    // -----------------------------------------------------
    // ROUND SCORE
    // -----------------------------------------------------

    score =
        Math.round(score);


    // Keep score between 0 and 100

    score =
        Math.min(
            Math.max(score, 0),
            100
        );


    // -----------------------------------------------------
    // RISK LEVEL
    // -----------------------------------------------------

    const riskLevel =
        getRiskLevel(score);


    // -----------------------------------------------------
    // BUILD RISK FACTORS
    // -----------------------------------------------------

    const riskFactors = [];


    const topRecord =
        nearestNeighbours[0]?.record;


    if (topRecord) {

        if (
            categoryMatch(
                application.industry,
                topRecord.industry
            ) > 0
        ) {

            riskFactors.push(
                `Similar ${topRecord.industry} applications were found in the training dataset.`
            );
        }


        if (
            categoryMatch(
                application.department,
                topRecord.department
            ) > 0
        ) {

            riskFactors.push(
                `Similar applications were processed by ${topRecord.department}.`
            );
        }


        if (
            categoryMatch(
                application.approvalType,
                topRecord.approvalType
            ) > 0
        ) {

            riskFactors.push(
                `Similar approval type found: ${topRecord.approvalType}.`
            );
        }


        if (
            categoryMatch(
                application.status,
                topRecord.status
            ) > 0
        ) {

            riskFactors.push(
                `Similar applications had status: ${topRecord.status}.`
            );
        }

    }


    // -----------------------------------------------------
    // INVESTMENT FACTOR
    // -----------------------------------------------------

    const investment =
        parseInvestment(
            application.investment
        );


    if (investment >= 50) {

        riskFactors.push(
            "Application has a relatively high investment value."
        );

    } else if (investment >= 10) {

        riskFactors.push(
            "Application has a medium-high investment value."
        );

    }


    // -----------------------------------------------------
    // DOCUMENT CHECK
    // -----------------------------------------------------

    if (
        !application.documents ||
        application.documents.length === 0
    ) {

        riskFactors.push(
            "Required document is not uploaded."
        );

    }


    // -----------------------------------------------------
    // ADDRESS CHECK
    // -----------------------------------------------------

    if (
        !application.address ||
        application.address.trim() === ""
    ) {

        riskFactors.push(
            "Business address information is incomplete."
        );

    }


    // -----------------------------------------------------
    // QUERY RAISED
    // -----------------------------------------------------

    if (
        application.status === "Query Raised"
    ) {

        riskFactors.push(
            "A query has been raised on the application."
        );

    }


    // -----------------------------------------------------
    // REMOVE DUPLICATES
    // -----------------------------------------------------

    const uniqueRiskFactors =
        [...new Set(riskFactors)];


    // -----------------------------------------------------
    // RECOMMENDATION
    // -----------------------------------------------------

    const recommendation =
        getRecommendation(
            riskLevel
        );


    // -----------------------------------------------------
    // RETURN RESULT
    // -----------------------------------------------------

    return {

        score,

        riskLevel,

        riskFactors:
            uniqueRiskFactors,

        recommendation,

        model: "KNN",

        trainingSamples:
            trainingData.length,

        neighboursUsed:
            nearestNeighbours.length,

        nearestApplications:
            nearestNeighbours.map(item => ({
                applicationId:
                    item.record.applicationId,

                riskScore:
                    item.record.riskScore,

                riskLevel:
                    item.record.riskLevel,

                similarity:
                    Number(
                        item.similarity.toFixed(3)
                    )
            }))

    };

};


// =========================================================
// EXPORT
// =========================================================

module.exports = {

    calculateRiskScore

};