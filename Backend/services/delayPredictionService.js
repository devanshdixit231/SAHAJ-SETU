const predictDelay = (application) => {
    let expectedDays = 7;
    let delayRisk = "Low";
    let predictedDelayDays = 0;

    const reasons = [];

    // ----------------------------------------
    // 1. Document check
    // ----------------------------------------
    if (!application.documents || application.documents.length === 0) {
        expectedDays += 3;
        predictedDelayDays += 3;

        reasons.push(
            "Required document is not uploaded."
        );
    }

    // ----------------------------------------
    // 2. Investment category
    // ----------------------------------------
    const investment = (
        application.investment || ""
    ).toLowerCase();

    if (investment.includes("above")) {
        expectedDays += 5;
        predictedDelayDays += 5;

        reasons.push(
            "High investment category may require additional verification."
        );
    } else if (
        investment.includes("10 crore") ||
        investment.includes("10 - 50")
    ) {
        expectedDays += 3;
        predictedDelayDays += 3;

        reasons.push(
            "Medium-high investment category may require additional review."
        );
    }

    // ----------------------------------------
    // 3. Industry complexity
    // ----------------------------------------
    const industry = (
        application.industry || ""
    ).toLowerCase();

    if (
        industry.includes("manufacturing") ||
        industry.includes("construction")
    ) {
        expectedDays += 3;
        predictedDelayDays += 3;

        reasons.push(
            "Industry may require additional regulatory verification."
        );
    } else if (industry.includes("healthcare")) {
        expectedDays += 2;
        predictedDelayDays += 2;

        reasons.push(
            "Healthcare-related applications may require additional verification."
        );
    }

    // ----------------------------------------
    // 4. Application status
    // ----------------------------------------
    if (application.status === "Query Raised") {
        expectedDays += 4;
        predictedDelayDays += 4;

        reasons.push(
            "A query has been raised on the application."
        );
    }

    // ----------------------------------------
    // 5. Missing address
    // ----------------------------------------
    if (
        !application.address ||
        application.address.trim() === ""
    ) {
        expectedDays += 2;
        predictedDelayDays += 2;

        reasons.push(
            "Business address information is incomplete."
        );
    }

    // ----------------------------------------
    // Delay risk calculation
    // ----------------------------------------
    if (predictedDelayDays >= 7) {
        delayRisk = "High";
    } else if (predictedDelayDays >= 3) {
        delayRisk = "Medium";
    } else {
        delayRisk = "Low";
    }

    // ----------------------------------------
    // Expected processing range
    // ----------------------------------------
    const minimumDays = expectedDays;
    const maximumDays = expectedDays + 3;

    return {
        expectedProcessingTime: `${minimumDays}-${maximumDays} Days`,
        minimumDays,
        maximumDays,
        delayRisk,
        predictedDelayDays,
        reasons
    };
};

module.exports = {
    predictDelay
};