const calculateRiskScore = (application) => {

    let score = 0;
    const riskFactors = [];

    // =====================================
    // 1. DOCUMENT CHECK
    // =====================================

    if (
        !application.documents ||
        application.documents.length === 0
    ) {
        score += 30;

        riskFactors.push(
            "Required document is not uploaded."
        );
    }

    // =====================================
    // 2. INVESTMENT CHECK
    // =====================================

    const investment =
        (application.investment || "").toLowerCase();

    if (investment.includes("above")) {

        score += 25;

        riskFactors.push(
            "Application belongs to a high investment category."
        );

    } else if (
        investment.includes("10 crore") ||
        investment.includes("10 - 50")
    ) {

        score += 15;

        riskFactors.push(
            "Application belongs to a medium-high investment category."
        );

    } else if (
        investment.includes("5 crore") ||
        investment.includes("5 - 10")
    ) {

        score += 10;

    } else {

        score += 5;
    }

    // =====================================
    // 3. INDUSTRY CHECK
    // =====================================

    const industry =
        (application.industry || "").toLowerCase();

    if (
        industry.includes("manufacturing") ||
        industry.includes("construction")
    ) {

        score += 15;

        riskFactors.push(
            "Industry may require additional regulatory review."
        );

    } else if (
        industry.includes("healthcare")
    ) {

        score += 10;

        riskFactors.push(
            "Healthcare-related application may require additional verification."
        );

    } else if (
        industry.includes("it")
    ) {

        score += 5;
    }

    // =====================================
    // 4. APPLICATION STATUS
    // =====================================

    if (
        application.status === "Query Raised"
    ) {

        score += 15;

        riskFactors.push(
            "A query has been raised on the application."
        );
    }

    // =====================================
    // 5. ADDRESS / LOCATION CHECK
    // =====================================

    if (
        !application.address ||
        application.address.trim() === ""
    ) {

        score += 10;

        riskFactors.push(
            "Business address information is incomplete."
        );
    }

    // =====================================
    // LIMIT SCORE
    // =====================================

    score = Math.min(
        Math.max(score, 0),
        100
    );

    // =====================================
    // RISK LEVEL
    // =====================================

    let riskLevel;

    if (score < 30) {

        riskLevel = "Low";

    } else if (score < 60) {

        riskLevel = "Medium";

    } else {

        riskLevel = "High";
    }

    // =====================================
    // RECOMMENDATION
    // =====================================

    let recommendation;

    if (riskLevel === "Low") {

        recommendation =
            "Application can proceed through standard review.";

    } else if (riskLevel === "Medium") {

        recommendation =
            "Application should undergo standard officer review with additional verification.";

    } else {

        recommendation =
            "Application requires detailed officer review and verification before approval.";
    }

    return {
        score,
        riskLevel,
        riskFactors,
        recommendation
    };
};

module.exports = {
    calculateRiskScore
};