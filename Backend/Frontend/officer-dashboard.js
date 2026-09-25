const API_BASE_URL = "http://localhost:5000/api";

let applications = [];
let selectedApplication = null;
let officerInspections = [];


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    loadOfficerProfile();
    loadApplications();
    loadOfficerInspections();

    setupSearch();
    setupFilters();
    setupLogout();

});


// ============================================================
// GET TOKEN
// ============================================================

function getToken() {

    return localStorage.getItem(
        "sahajSetuToken"
    );
}


// ============================================================
// OFFICER PROFILE
// ============================================================

async function loadOfficerProfile() {

    try {

        const token = getToken();

        if (!token) {
            console.warn(
                "Officer token not found."
            );
            return;
        }


        const response =
            await fetch(
                `${API_BASE_URL}/auth/me`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {
            return;
        }


        const officer =
            data.user;


        const name =
            officer.name ||
            "Officer";


        const department =
            officer.department ||
            "Government Officer";


        const nameElement =
            document.getElementById(
                "officerName"
            );


        const departmentElement =
            document.getElementById(
                "officerDepartment"
            );


        if (nameElement) {
            nameElement.textContent =
                name;
        }


        if (departmentElement) {
            departmentElement.textContent =
                department;
        }


        document
            .querySelectorAll(
                ".officer-name"
            )
            .forEach(
                (element) => {
                    element.textContent =
                        name;
                }
            );


        document
            .querySelectorAll(
                ".officer-department"
            )
            .forEach(
                (element) => {
                    element.textContent =
                        department;
                }
            );


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );
    }
}


// ============================================================
// LOAD APPLICATIONS
// ============================================================

async function loadApplications() {

    try {

        const token =
            getToken();


        if (!token) {

            console.warn(
                "Officer token not found."
            );

            return;
        }


        const response =
            await fetch(
                `${API_BASE_URL}/applications/officer/all`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            console.error(
                "Applications API error:",
                data
            );

            return;
        }


        applications =
            data.applications || [];


        renderApplications(
            applications
        );


        updateStatistics(
            applications
        );


    } catch (error) {

        console.error(
            "Load applications error:",
            error
        );
    }
}


// ============================================================
// RENDER APPLICATION TABLE
// ============================================================

function renderApplications(
    applicationList
) {

    const tableBody =
        document.getElementById(
            "applicationsTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !applicationList ||
        applicationList.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-table"
                >
                    No applications found.
                </td>
            </tr>
        `;

        return;
    }


    applicationList.forEach(
        (application) => {

            const row =
                document.createElement(
                    "tr"
                );


            const submittedDate =
                formatDate(
                    application.submittedAt
                );


            const applicantName =
                application.applicantName ||
                application.userId?.name ||
                "N/A";


            const statusClass =
                getStatusClass(
                    application.status
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            application.applicationId
                        )}
                    </strong>
                </td>


                <td>
                    ${escapeHTML(
                        applicantName
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        application.businessName ||
                        "N/A"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        application.approvalName ||
                        "N/A"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        submittedDate
                    )}
                </td>


                <td>

                    <span
                        class="status-badge ${statusClass}"
                    >
                        ${escapeHTML(
                            application.status ||
                            "Submitted"
                        )}
                    </span>

                </td>


                <td>

                    <div
                        style="
                            display:flex;
                            gap:6px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            class="view-application-btn"
                            data-application-id="${escapeHTML(
                                application.applicationId
                            )}"
                        >
                            View
                        </button>


                        <button
                            class="inspection-application-btn"
                            data-application-id="${escapeHTML(
                                application.applicationId
                            )}"
                            style="
                                padding:7px 10px;
                                border:none;
                                border-radius:7px;
                                background:#16a34a;
                                color:#fff;
                                cursor:pointer;
                                font-size:11px;
                                font-weight:600;
                            "
                        >
                            Inspection
                        </button>

                    </div>

                </td>
            `;


            tableBody.appendChild(
                row
            );

        }
    );


    document
        .querySelectorAll(
            ".view-application-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const applicationId =
                            button.dataset
                                .applicationId;


                        openReviewModal(
                            applicationId
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".inspection-application-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const applicationId =
                            button.dataset
                                .applicationId;


                        openInspectionManager(
                            applicationId
                        );

                    }
                );

            }
        );
}


// ============================================================
// UPDATE APPLICATION STATISTICS
// ============================================================

function updateStatistics(
    applicationList
) {

    const total =
        applicationList.length;


    const submitted =
        applicationList.filter(
            (application) =>
                application.status ===
                "Submitted"
        ).length;


    const underReview =
        applicationList.filter(
            (application) =>
                application.status ===
                "Under Review"
        ).length;


    const approved =
        applicationList.filter(
            (application) =>
                application.status ===
                "Approved"
        ).length;


    const rejected =
        applicationList.filter(
            (application) =>
                application.status ===
                "Rejected"
        ).length;


    setStatistic(
        [
            "#totalApplications",
            "#total-applications"
        ],
        total
    );


    setStatistic(
        [
            "#pendingApplications",
            "#pending-applications"
        ],
        submitted + underReview
    );


    setStatistic(
        [
            "#approvedApplications",
            "#approved-applications"
        ],
        approved
    );


    setStatistic(
        [
            "#rejectedApplications",
            "#rejected-applications"
        ],
        rejected
    );


    setStatistic(
        ["#submittedCount"],
        submitted
    );


    setStatistic(
        ["#reviewCount"],
        underReview
    );


    setStatistic(
        ["#approvedCount"],
        approved
    );


    setStatistic(
        ["#rejectedCount"],
        rejected
    );


    const totalForProgress =
        total || 1;


    setProgress(
        "#submittedProgress",
        submitted,
        totalForProgress
    );


    setProgress(
        "#reviewProgress",
        underReview,
        totalForProgress
    );


    setProgress(
        "#approvedProgress",
        approved,
        totalForProgress
    );


    setProgress(
        "#rejectedProgress",
        rejected,
        totalForProgress
    );
}


function setStatistic(
    selectors,
    value
) {

    selectors.forEach(
        (selector) => {

            const element =
                document.querySelector(
                    selector
                );


            if (element) {
                element.textContent =
                    value;
            }

        }
    );
}


function setProgress(
    selector,
    value,
    total
) {

    const element =
        document.querySelector(
            selector
        );


    if (!element) {
        return;
    }


    const percentage =
        Math.min(
            100,
            Math.round(
                (value / total) * 100
            )
        );


    element.style.width =
        `${percentage}%`;
}


// ============================================================
// REVIEW MODAL
// ============================================================

async function openReviewModal(
    applicationId
) {

    const application =
        applications.find(
            (item) =>
                item.applicationId ===
                applicationId
        );


    if (!application) {

        alert(
            "Application details not found."
        );

        return;
    }


    selectedApplication =
        application;


    const modal =
        createReviewModal();


    modal.style.display =
        "flex";


    fillApplicationDetails(
        application
    );


    showRiskLoading();
    showDelayLoading();
    showInspectionLoading();


    await loadRiskAssessment(
        application.applicationId
    );


    await loadDelayPrediction(
        application.applicationId
    );


    await loadInspection(
        application.applicationId
    );
}


// ============================================================
// CREATE REVIEW MODAL
// ============================================================

function createReviewModal() {

    const oldModal =
        document.getElementById(
            "applicationReviewModal"
        );


    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "applicationReviewModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        z-index:999999;
        background:rgba(15,23,42,0.65);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
    `;


    modal.innerHTML = `

        <div
            style="
                width:min(1000px,96vw);
                max-height:92vh;
                overflow-y:auto;
                background:#fff;
                border-radius:16px;
                box-shadow:0 25px 70px rgba(0,0,0,.25);
            "
        >

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    padding:20px 24px;
                    border-bottom:1px solid #e2e8f0;
                "
            >

                <div>

                    <h2
                        style="
                            margin:0;
                            color:#0f172a;
                            font-size:20px;
                        "
                    >
                        Application Review
                    </h2>

                    <p
                        id="reviewApplicationId"
                        style="
                            margin:5px 0 0;
                            color:#64748b;
                            font-size:13px;
                        "
                    ></p>

                </div>


                <button
                    id="closeReviewModal"
                    style="
                        width:36px;
                        height:36px;
                        border:none;
                        border-radius:8px;
                        background:#f1f5f9;
                        color:#334155;
                        font-size:20px;
                        cursor:pointer;
                    "
                >
                    ×
                </button>

            </div>


            <div style="padding:24px;">

                <div
                    style="
                        display:grid;
                        grid-template-columns:
                        repeat(auto-fit,minmax(220px,1fr));
                        gap:14px;
                    "
                >

                    ${createDetailBox(
                        "Applicant Name",
                        "reviewApplicantName"
                    )}

                    ${createDetailBox(
                        "Business Name",
                        "reviewBusinessName"
                    )}

                    ${createDetailBox(
                        "Approval",
                        "reviewApprovalName"
                    )}

                    ${createDetailBox(
                        "Department",
                        "reviewDepartment"
                    )}

                    ${createDetailBox(
                        "Industry",
                        "reviewIndustry"
                    )}

                    ${createDetailBox(
                        "Investment",
                        "reviewInvestment"
                    )}

                    ${createDetailBox(
                        "State",
                        "reviewState"
                    )}

                    ${createDetailBox(
                        "District",
                        "reviewDistrict"
                    )}

                    ${createDetailBox(
                        "Address",
                        "reviewAddress"
                    )}

                    ${createDetailBox(
                        "Document",
                        "reviewDocument"
                    )}

                </div>


                <!-- STATUS -->

                <div
                    style="
                        margin-top:24px;
                        padding-top:20px;
                        border-top:1px solid #e2e8f0;
                    "
                >

                    <h3
                        style="
                            margin:0 0 12px;
                            font-size:15px;
                            color:#1e293b;
                        "
                    >
                        Application Status
                    </h3>


                    <div
                        style="
                            display:flex;
                            gap:12px;
                        "
                    >

                        <select
                            id="reviewStatusSelect"
                            style="
                                flex:1;
                                min-height:42px;
                                padding:8px 12px;
                                border:1px solid #cbd5e1;
                                border-radius:8px;
                                background:#fff;
                            "
                        >

                            <option value="Submitted">
                                Submitted
                            </option>

                            <option value="Under Review">
                                Under Review
                            </option>

                            <option value="Approved">
                                Approved
                            </option>

                            <option value="Rejected">
                                Rejected
                            </option>

                            <option value="Query Raised">
                                Query Raised
                            </option>

                        </select>


                        <button
                            id="updateApplicationStatusBtn"
                            style="
                                min-height:42px;
                                padding:8px 18px;
                                border:none;
                                border-radius:8px;
                                background:#2563eb;
                                color:#fff;
                                font-weight:600;
                                cursor:pointer;
                            "
                        >
                            Update Status
                        </button>

                    </div>

                </div>


                <!-- RISK -->

                <div
                    style="
                        margin-top:28px;
                        padding-top:22px;
                        border-top:1px solid #e2e8f0;
                    "
                >

                    <h3
                        style="
                            margin:0;
                            font-size:16px;
                            color:#1e293b;
                        "
                    >
                        🛡️ Risk Assessment
                    </h3>

                    <p
                        style="
                            margin:5px 0 15px;
                            color:#64748b;
                            font-size:12px;
                        "
                    >
                        Automated application risk assessment
                    </p>


                    <div
                        id="riskAssessmentContent"
                        style="
                            border:1px solid #e2e8f0;
                            border-radius:12px;
                            background:#f8fafc;
                            padding:20px;
                        "
                    ></div>

                </div>


                <!-- DELAY -->

                <div
                    style="
                        margin-top:28px;
                        padding-top:22px;
                        border-top:1px solid #e2e8f0;
                    "
                >

                    <h3
                        style="
                            margin:0;
                            font-size:16px;
                            color:#1e293b;
                        "
                    >
                        ⏱️ Delay Prediction
                    </h3>

                    <p
                        style="
                            margin:5px 0 15px;
                            color:#64748b;
                            font-size:12px;
                        "
                    >
                        Estimated processing time and delay risk
                    </p>


                    <div
                        id="delayPredictionContent"
                        style="
                            border:1px solid #e2e8f0;
                            border-radius:12px;
                            background:#f8fafc;
                            padding:20px;
                        "
                    ></div>

                </div>


                <!-- INSPECTION -->

                <div
                    style="
                        margin-top:28px;
                        padding-top:22px;
                        border-top:1px solid #e2e8f0;
                    "
                >

                    <h3
                        style="
                            margin:0;
                            font-size:16px;
                            color:#1e293b;
                        "
                    >
                        🏢 Joint Inspection Coordination
                    </h3>

                    <p
                        style="
                            margin:5px 0 15px;
                            color:#64748b;
                            font-size:12px;
                        "
                    >
                        Coordinate inspections across departments
                    </p>


                    <div
                        id="inspectionContent"
                        style="
                            border:1px solid #e2e8f0;
                            border-radius:12px;
                            background:#f8fafc;
                            padding:20px;
                        "
                    ></div>

                </div>

            </div>

        </div>
    `;


    document.body.appendChild(
        modal
    );


    document
        .getElementById(
            "closeReviewModal"
        )
        .addEventListener(
            "click",
            closeReviewModal
        );


    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === modal
            ) {
                closeReviewModal();
            }

        }
    );


    document
        .getElementById(
            "updateApplicationStatusBtn"
        )
        .addEventListener(
            "click",
            updateApplicationStatus
        );


    return modal;
}


// ============================================================
// DETAIL BOX
// ============================================================

function createDetailBox(
    label,
    id
) {

    return `

        <div
            style="
                padding:14px;
                border:1px solid #e2e8f0;
                border-radius:10px;
                background:#f8fafc;
            "
        >

            <div
                style="
                    font-size:11px;
                    color:#64748b;
                    margin-bottom:5px;
                "
            >
                ${escapeHTML(label)}
            </div>

            <div
                id="${id}"
                style="
                    font-size:13px;
                    color:#0f172a;
                    font-weight:600;
                    word-break:break-word;
                "
            >
                —
            </div>

        </div>
    `;
}


// ============================================================
// FILL APPLICATION DETAILS
// ============================================================

function fillApplicationDetails(
    application
) {

    setText(
        "reviewApplicationId",
        application.applicationId
    );


    setText(
        "reviewApplicantName",
        application.applicantName ||
        application.userId?.name ||
        "N/A"
    );


    setText(
        "reviewBusinessName",
        application.businessName ||
        "N/A"
    );


    setText(
        "reviewApprovalName",
        application.approvalName ||
        "N/A"
    );


    setText(
        "reviewDepartment",
        application.department ||
        "N/A"
    );


    setText(
        "reviewIndustry",
        application.industry ||
        "N/A"
    );


    setText(
        "reviewInvestment",
        application.investment ||
        "N/A"
    );


    setText(
        "reviewState",
        application.state ||
        "N/A"
    );


    setText(
        "reviewDistrict",
        application.district ||
        "N/A"
    );


    setText(
        "reviewAddress",
        application.address ||
        "N/A"
    );


    const documentName =
        application.documents &&
        application.documents.length > 0

            ? application.documents[0]
                .originalName

            : "No document uploaded";


    setText(
        "reviewDocument",
        documentName
    );


    const statusSelect =
        document.getElementById(
            "reviewStatusSelect"
        );


    if (statusSelect) {

        statusSelect.value =
            application.status ||
            "Submitted";
    }
}


// ============================================================
// RISK LOADING
// ============================================================

function showRiskLoading() {

    const container =
        document.getElementById(
            "riskAssessmentContent"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div
            style="
                min-height:120px;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                color:#64748b;
            "
        >

            <div
                style="
                    width:30px;
                    height:30px;
                    border:3px solid #e2e8f0;
                    border-top-color:#2563eb;
                    border-radius:50%;
                    animation:riskSpinner .8s linear infinite;
                "
            ></div>

            <p
                style="
                    margin:12px 0 0;
                    font-size:13px;
                "
            >
                Calculating risk assessment...
            </p>

        </div>
    `;


    addSpinnerAnimation();
}


// ============================================================
// LOAD RISK
// ============================================================

async function loadRiskAssessment(
    applicationId
) {

    try {

        const token =
            getToken();


        if (!token) {

            showRiskError(
                "Officer authentication token is missing."
            );

            return;
        }


        const response =
            await fetch(
                `${API_BASE_URL}/applications/${applicationId}/risk`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            showRiskError(
                data.message ||
                "Unable to calculate risk."
            );

            return;
        }


        renderRiskAssessment(
            data.risk
        );


    } catch (error) {

        console.error(
            "Risk assessment error:",
            error
        );


        showRiskError(
            "Unable to connect to risk assessment service."
        );
    }
}


// ============================================================
// RENDER RISK
// ============================================================

function renderRiskAssessment(
    risk
) {

    const container =
        document.getElementById(
            "riskAssessmentContent"
        );


    if (!container) {
        return;
    }


    const level =
        risk.level || "Low";


    const score =
        Number(
            risk.score || 0
        );


    const factors =
        risk.factors || [];


    const factorsHTML =
        factors.length > 0

            ? `
                <ul
                    style="
                        margin:8px 0 0;
                        padding-left:20px;
                    "
                >
                    ${factors
                        .map(
                            (factor) => `
                                <li
                                    style="
                                        margin-bottom:6px;
                                        color:#475569;
                                        font-size:13px;
                                    "
                                >
                                    ${escapeHTML(
                                        factor
                                    )}
                                </li>
                            `
                        )
                        .join("")}
                </ul>
            `

            : `
                <p
                    style="
                        margin:0;
                        color:#64748b;
                        font-size:13px;
                    "
                >
                    No major risk factors detected.
                </p>
            `;


    container.innerHTML = `

        <div
            style="
                display:flex;
                align-items:center;
                gap:25px;
                margin-bottom:20px;
                flex-wrap:wrap;
            "
        >

            <div
                style="
                    width:95px;
                    height:95px;
                    border-radius:50%;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                    background:#fff;
                    border:8px solid ${getRiskColor(level)};
                "
            >

                <strong
                    style="
                        font-size:26px;
                        color:#0f172a;
                    "
                >
                    ${score}
                </strong>

                <span
                    style="
                        font-size:11px;
                        color:#64748b;
                    "
                >
                    / 100
                </span>

            </div>


            <div>

                <div
                    style="
                        font-size:11px;
                        color:#64748b;
                        margin-bottom:6px;
                    "
                >
                    Risk Level
                </div>


                <span
                    style="
                        display:inline-flex;
                        padding:7px 14px;
                        border-radius:20px;
                        background:${getRiskBackground(level)};
                        color:${getRiskColor(level)};
                        font-size:13px;
                        font-weight:700;
                    "
                >
                    ${escapeHTML(level)}
                </span>

            </div>

        </div>


        <h4
            style="
                margin:0 0 8px;
                font-size:13px;
                color:#1e293b;
            "
        >
            Risk Factors
        </h4>

        ${factorsHTML}


        <div
            style="
                margin-top:18px;
                padding:14px;
                background:#fff;
                border:1px solid #e2e8f0;
                border-radius:9px;
            "
        >

            <h4
                style="
                    margin:0 0 7px;
                    font-size:13px;
                    color:#1e293b;
                "
            >
                Recommendation
            </h4>

            <p
                style="
                    margin:0;
                    color:#475569;
                    font-size:13px;
                    line-height:1.5;
                "
            >
                ${escapeHTML(
                    risk.recommendation ||
                    "Standard officer review recommended."
                )}
            </p>

        </div>
    `;
}


// ============================================================
// RISK ERROR
// ============================================================

function showRiskError(
    message
) {

    const container =
        document.getElementById(
            "riskAssessmentContent"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div
            style="
                min-height:120px;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                text-align:center;
            "
        >

            <div
                style="
                    font-size:28px;
                    margin-bottom:8px;
                "
            >
                ⚠️
            </div>

            <p
                style="
                    margin:0;
                    color:#64748b;
                    font-size:13px;
                "
            >
                ${escapeHTML(message)}
            </p>

        </div>
    `;
}


// ============================================================
// DELAY LOADING
// ============================================================

function showDelayLoading() {

    const container =
        document.getElementById(
            "delayPredictionContent"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div
            style="
                min-height:120px;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                color:#64748b;
            "
        >

            <div
                style="
                    width:30px;
                    height:30px;
                    border:3px solid #e2e8f0;
                    border-top-color:#2563eb;
                    border-radius:50%;
                    animation:delaySpinner .8s linear infinite;
                "
            ></div>

            <p
                style="
                    margin:12px 0 0;
                    font-size:13px;
                "
            >
                Predicting processing time...
            </p>

        </div>
    `;


    addSpinnerAnimation();
}


// ============================================================
// LOAD DELAY
// ============================================================

async function loadDelayPrediction(
    applicationId
) {

    try {

        const token =
            getToken();


        if (!token) {

            showDelayError(
                "Officer authentication token is missing."
            );

            return;
        }


        const response =
            await fetch(
                `${API_BASE_URL}/applications/${applicationId}/delay`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            showDelayError(
                data.message ||
                "Unable to calculate delay prediction."
            );

            return;
        }


        renderDelayPrediction(
            data.delayPrediction
        );


    } catch (error) {

        console.error(
            "Delay prediction error:",
            error
        );


        showDelayError(
            "Unable to connect to delay prediction service."
        );
    }
}


// ============================================================
// RENDER DELAY
// ============================================================

function renderDelayPrediction(
    prediction
) {

    const container =
        document.getElementById(
            "delayPredictionContent"
        );


    if (!container) {
        return;
    }


    const risk =
        prediction.delayRisk ||
        "Low";


    const processingTime =
        prediction.expectedProcessingTime ||
        "7-10 Days";


    const predictedDelay =
        Number(
            prediction.predictedDelayDays ||
            0
        );


    const reasons =
        prediction.reasons || [];


    let riskColor =
        "#16a34a";


    let riskBackground =
        "#dcfce7";


    if (risk === "Medium") {

        riskColor =
            "#d97706";

        riskBackground =
            "#fef3c7";
    }


    if (risk === "High") {

        riskColor =
            "#dc2626";

        riskBackground =
            "#fee2e2";
    }


    const reasonsHTML =
        reasons.length > 0

            ? `
                <ul
                    style="
                        margin:8px 0 0;
                        padding-left:20px;
                    "
                >

                    ${reasons
                        .map(
                            (reason) => `
                                <li
                                    style="
                                        margin-bottom:6px;
                                        color:#475569;
                                        font-size:13px;
                                    "
                                >
                                    ${escapeHTML(
                                        reason
                                    )}
                                </li>
                            `
                        )
                        .join("")}

                </ul>
            `

            : `
                <p
                    style="
                        margin:0;
                        color:#64748b;
                        font-size:13px;
                    "
                >
                    No significant delay factors detected.
                </p>
            `;


    container.innerHTML = `

        <div
            style="
                display:grid;
                grid-template-columns:
                repeat(auto-fit,minmax(170px,1fr));
                gap:14px;
            "
        >

            <div
                style="
                    padding:18px;
                    border-radius:10px;
                    background:#fff;
                    border:1px solid #e2e8f0;
                "
            >

                <div
                    style="
                        font-size:11px;
                        color:#64748b;
                        margin-bottom:8px;
                    "
                >
                    Expected Processing Time
                </div>

                <div
                    style="
                        font-size:20px;
                        font-weight:700;
                        color:#0f172a;
                    "
                >
                    ${escapeHTML(
                        processingTime
                    )}
                </div>

            </div>


            <div
                style="
                    padding:18px;
                    border-radius:10px;
                    background:#fff;
                    border:1px solid #e2e8f0;
                "
            >

                <div
                    style="
                        font-size:11px;
                        color:#64748b;
                        margin-bottom:8px;
                    "
                >
                    Delay Risk
                </div>

                <span
                    style="
                        display:inline-flex;
                        padding:7px 13px;
                        border-radius:20px;
                        background:${riskBackground};
                        color:${riskColor};
                        font-size:13px;
                        font-weight:700;
                    "
                >
                    ${escapeHTML(risk)}
                </span>

            </div>


            <div
                style="
                    padding:18px;
                    border-radius:10px;
                    background:#fff;
                    border:1px solid #e2e8f0;
                "
            >

                <div
                    style="
                        font-size:11px;
                        color:#64748b;
                        margin-bottom:8px;
                    "
                >
                    Predicted Delay
                </div>

                <div
                    style="
                        font-size:20px;
                        font-weight:700;
                        color:#0f172a;
                    "
                >
                    ${predictedDelay} Days
                </div>

            </div>

        </div>


        <div
            style="
                margin-top:18px;
                padding:15px;
                background:#fff;
                border:1px solid #e2e8f0;
                border-radius:10px;
            "
        >

            <h4
                style="
                    margin:0 0 8px;
                    font-size:13px;
                    color:#1e293b;
                "
            >
                Possible Delay Factors
            </h4>

            ${reasonsHTML}

        </div>
    `;
}


// ============================================================
// DELAY ERROR
// ============================================================

function showDelayError(
    message
) {

    const container =
        document.getElementById(
            "delayPredictionContent"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div
            style="
                min-height:120px;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                text-align:center;
            "
        >

            <div
                style="
                    font-size:28px;
                    margin-bottom:8px;
                "
            >
                ⚠️
            </div>

            <p
                style="
                    margin:0;
                    color:#64748b;
                    font-size:13px;
                "
            >
                ${escapeHTML(message)}
            </p>

        </div>
    `;
}


// ============================================================
// APPLICATION INSPECTION LOADING
// ============================================================

function showInspectionLoading() {

    const container =
        document.getElementById(
            "inspectionContent"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div
            style="
                min-height:120px;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                color:#64748b;
            "
        >

            <div
                style="
                    width:30px;
                    height:30px;
                    border:3px solid #e2e8f0;
                    border-top-color:#16a34a;
                    border-radius:50%;
                    animation:inspectionSpinner .8s linear infinite;
                "
            ></div>

            <p
                style="
                    margin:12px 0 0;
                    font-size:13px;
                "
            >
                Loading inspection information...
            </p>

        </div>
    `;


    addSpinnerAnimation();
}


// ============================================================
// LOAD APPLICATION INSPECTION
// ============================================================

async function loadInspection(
    applicationId
) {

    const container =
        document.getElementById(
            "inspectionContent"
        );


    if (!container) {
        return;
    }


    try {

        const token =
            getToken();


        if (!token) {

            showInspectionError(
                "Officer authentication token is missing."
            );

            return;
        }


        const response =
            await fetch(
                `${API_BASE_URL}/inspections/${applicationId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (response.status === 404) {

            renderInspectionCreateForm(
                applicationId
            );

            return;
        }


        if (
            !response.ok ||
            !data.success
        ) {

            showInspectionError(
                data.message ||
                "Unable to load inspection."
            );

            return;
        }


        renderExistingInspection(
            data.inspection
        );


    } catch (error) {

        console.error(
            "Inspection loading error:",
            error
        );


        showInspectionError(
            "Unable to connect to inspection service."
        );
    }
}


// ============================================================
// CREATE INSPECTION FORM INSIDE REVIEW MODAL
// ============================================================

function renderInspectionCreateForm(
    applicationId
) {

    const container =
        document.getElementById(
            "inspectionContent"
        );


    if (!container) {
        return;
    }


    const application =
        applications.find(
            (item) =>
                item.applicationId ===
                applicationId
        );


    const defaultDepartment =
        application?.department ||
        "";


    container.innerHTML = `

        <div>

            <p
                style="
                    margin:0 0 16px;
                    color:#64748b;
                    font-size:12px;
                "
            >
                No joint inspection has been created
                for this application.
            </p>


            <div
                style="
                    margin-bottom:18px;
                "
            >

                <label
                    style="
                        display:block;
                        font-size:12px;
                        font-weight:600;
                        color:#334155;
                        margin-bottom:7px;
                    "
                >
                    Departments
                </label>


                <div
                    style="
                        display:grid;
                        grid-template-columns:
                        repeat(auto-fit,minmax(180px,1fr));
                        gap:10px;
                    "
                >

                    ${createDepartmentCheckbox(
                        "Pollution Control",
                        defaultDepartment ===
                        "Pollution Control"
                    )}

                    ${createDepartmentCheckbox(
                        "Fire Department",
                        defaultDepartment ===
                        "Fire Department"
                    )}

                    ${createDepartmentCheckbox(
                        "Labour Department",
                        defaultDepartment ===
                        "Labour Department"
                    )}

                    ${createDepartmentCheckbox(
                        "Factory Department",
                        defaultDepartment ===
                        "Factory Department"
                    )}

                    ${createDepartmentCheckbox(
                        "Local Authority",
                        defaultDepartment ===
                        "Local Authority"
                    )}

                    ${createDepartmentCheckbox(
                        defaultDepartment ||
                        "Other Department",
                        Boolean(
                            defaultDepartment
                        )
                    )}

                </div>

            </div>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                    repeat(auto-fit,minmax(220px,1fr));
                    gap:14px;
                "
            >

                <div>

                    <label
                        style="
                            display:block;
                            font-size:12px;
                            font-weight:600;
                            color:#334155;
                            margin-bottom:7px;
                        "
                    >
                        Suggested Date
                    </label>

                    <input
                        type="date"
                        id="inspectionSuggestedDate"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            min-height:42px;
                            padding:8px 12px;
                            border:1px solid #cbd5e1;
                            border-radius:8px;
                        "
                    >

                </div>


                <div>

                    <label
                        style="
                            display:block;
                            font-size:12px;
                            font-weight:600;
                            color:#334155;
                            margin-bottom:7px;
                        "
                    >
                        Inspection Location
                    </label>

                    <input
                        type="text"
                        id="inspectionLocation"
                        value="${escapeHTML(
                            application?.address ||
                            ""
                        )}"
                        placeholder="Inspection location"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            min-height:42px;
                            padding:8px 12px;
                            border:1px solid #cbd5e1;
                            border-radius:8px;
                        "
                    >

                </div>

            </div>


            <div
                style="
                    margin-top:14px;
                "
            >

                <label
                    style="
                        display:block;
                        font-size:12px;
                        font-weight:600;
                        color:#334155;
                        margin-bottom:7px;
                    "
                >
                    Notes
                </label>

                <textarea
                    id="inspectionNotes"
                    rows="3"
                    placeholder="Add inspection notes..."
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:10px 12px;
                        border:1px solid #cbd5e1;
                        border-radius:8px;
                        resize:vertical;
                    "
                ></textarea>

            </div>


            <div
                style="
                    margin-top:16px;
                    display:flex;
                    justify-content:flex-end;
                "
            >

                <button
                    id="createInspectionBtn"
                    style="
                        min-height:42px;
                        padding:8px 18px;
                        border:none;
                        border-radius:8px;
                        background:#16a34a;
                        color:#fff;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    Create Joint Inspection
                </button>

            </div>

        </div>
    `;


    document
        .getElementById(
            "createInspectionBtn"
        )
        ?.addEventListener(
            "click",
            () =>
                createInspection(
                    applicationId
                )
        );
}


// ============================================================
// DEPARTMENT CHECKBOX
// ============================================================

function createDepartmentCheckbox(
    name,
    isChecked
) {

    return `
        <label
            style="
                display:flex;
                align-items:center;
                gap:8px;
                padding:11px;
                border:1px solid #e2e8f0;
                border-radius:8px;
                background:#fff;
                cursor:pointer;
                font-size:12px;
                color:#334155;
            "
        >

            <input
                type="checkbox"
                class="inspection-department"
                value="${escapeHTML(name)}"
                ${isChecked ? "checked" : ""}
            >

            <span>
                ${escapeHTML(name)}
            </span>

        </label>
    `;
}


// ============================================================
// CREATE INSPECTION
// ============================================================

async function createInspection(
    applicationId
) {

    try {

        const token =
            getToken();


        if (!token) {

            alert(
                "Officer authentication token not found."
            );

            return;
        }


        const departmentElements =
            document.querySelectorAll(
                ".inspection-department:checked"
            );


        const departments =
            Array.from(
                departmentElements
            ).map(
                (element) =>
                    element.value
            );


        if (
            departments.length === 0
        ) {

            alert(
                "Please select at least one department."
            );

            return;
        }


        const suggestedDate =
            document.getElementById(
                "inspectionSuggestedDate"
            )?.value || "";


        const location =
            document.getElementById(
                "inspectionLocation"
            )?.value.trim() || "";


        const notes =
            document.getElementById(
                "inspectionNotes"
            )?.value.trim() || "";


        const button =
            document.getElementById(
                "createInspectionBtn"
            );


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Creating...";
        }


        const response =
            await fetch(
                `${API_BASE_URL}/inspections`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        applicationId,
                        departments,
                        suggestedDate:
                            suggestedDate ||
                            null,
                        location,
                        notes
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Failed to create inspection."
            );


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Create Joint Inspection";
            }


            return;
        }


        alert(
            "Joint inspection created successfully."
        );


        renderExistingInspection(
            data.inspection
        );


        await loadOfficerInspections();


    } catch (error) {

        console.error(
            "Create inspection error:",
            error
        );


        alert(
            "Unable to create joint inspection."
        );
    }
}


// ============================================================
// RENDER EXISTING INSPECTION
// ============================================================

function renderExistingInspection(
    inspection
) {

    const container =
        document.getElementById(
            "inspectionContent"
        );


    if (!container) {
        return;
    }


    const departments =
        inspection.departments || [];


    const departmentHTML =
        departments
            .map(
                (department) => `
                    <span
                        style="
                            display:inline-flex;
                            padding:6px 10px;
                            margin:0 6px 6px 0;
                            border-radius:16px;
                            background:#ecfdf5;
                            color:#166534;
                            font-size:11px;
                            font-weight:600;
                        "
                    >
                        ${escapeHTML(
                            department
                        )}
                    </span>
                `
            )
            .join("");


    const status =
        inspection.status ||
        "Coordination Required";


    const scheduledDate =
        inspection.scheduledDate
            ? formatDate(
                inspection.scheduledDate
            )
            : "Not scheduled";


    const suggestedDate =
        inspection.suggestedDate
            ? formatDate(
                inspection.suggestedDate
            )
            : "Not suggested";


    container.innerHTML = `

        <div>

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:12px;
                    flex-wrap:wrap;
                    margin-bottom:18px;
                "
            >

                <div>

                    <div
                        style="
                            font-size:11px;
                            color:#64748b;
                            margin-bottom:6px;
                        "
                    >
                        Inspection Status
                    </div>


                    <span
                        style="
                            display:inline-flex;
                            padding:7px 13px;
                            border-radius:20px;
                            background:${getInspectionStatusBackground(status)};
                            color:${getInspectionStatusColor(status)};
                            font-size:12px;
                            font-weight:700;
                        "
                    >
                        ${escapeHTML(status)}
                    </span>

                </div>


                <div
                    style="
                        font-size:11px;
                        color:#64748b;
                    "
                >
                    ${
                        inspection.isJointInspection
                            ? "Multiple Departments"
                            : "Single Department"
                    }
                </div>

            </div>


            <div
                style="
                    margin-bottom:16px;
                "
            >

                <div
                    style="
                        font-size:11px;
                        color:#64748b;
                        margin-bottom:8px;
                    "
                >
                    Departments
                </div>


                <div>
                    ${departmentHTML}
                </div>

            </div>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                    repeat(auto-fit,minmax(180px,1fr));
                    gap:12px;
                "
            >

                ${createInspectionInfoBox(
                    "Suggested Date",
                    suggestedDate
                )}

                ${createInspectionInfoBox(
                    "Scheduled Date",
                    scheduledDate
                )}

                ${createInspectionInfoBox(
                    "Location",
                    inspection.location ||
                    "Not specified"
                )}

                ${createInspectionInfoBox(
                    "Notes",
                    inspection.notes ||
                    "No notes"
                )}

            </div>


            ${
                status !== "Scheduled" &&
                status !== "Completed" &&
                status !== "Cancelled"

                    ? `
                        <div
                            style="
                                margin-top:18px;
                                padding-top:18px;
                                border-top:1px solid #e2e8f0;
                            "
                        >

                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:
                                    minmax(180px,1fr)
                                    auto;
                                    gap:10px;
                                    align-items:end;
                                "
                            >

                                <div>

                                    <label
                                        style="
                                            display:block;
                                            font-size:12px;
                                            font-weight:600;
                                            color:#334155;
                                            margin-bottom:7px;
                                        "
                                    >
                                        Schedule Date
                                    </label>

                                    <input
                                        type="date"
                                        id="scheduleInspectionDate"
                                        style="
                                            width:100%;
                                            box-sizing:border-box;
                                            min-height:42px;
                                            padding:8px 12px;
                                            border:1px solid #cbd5e1;
                                            border-radius:8px;
                                        "
                                    >

                                </div>


                                <button
                                    id="scheduleInspectionBtn"
                                    style="
                                        min-height:42px;
                                        padding:8px 18px;
                                        border:none;
                                        border-radius:8px;
                                        background:#2563eb;
                                        color:#fff;
                                        font-weight:600;
                                        cursor:pointer;
                                    "
                                >
                                    Schedule Inspection
                                </button>

                            </div>

                        </div>
                    `
                    : ""
            }


            ${
                status === "Scheduled"

                    ? `
                        <div
                            style="
                                margin-top:18px;
                                padding:14px;
                                border-radius:10px;
                                background:#eff6ff;
                                border:1px solid #bfdbfe;
                                color:#1e40af;
                                font-size:12px;
                            "
                        >
                            ✅ Inspection is scheduled for
                            <strong>
                                ${escapeHTML(
                                    scheduledDate
                                )}
                            </strong>
                        </div>
                    `
                    : ""
            }

        </div>
    `;


    document
        .getElementById(
            "scheduleInspectionBtn"
        )
        ?.addEventListener(
            "click",
            () =>
                scheduleInspection(
                    inspection.applicationId
                )
        );
}


// ============================================================
// INSPECTION INFO BOX
// ============================================================

function createInspectionInfoBox(
    label,
    value
) {

    return `
        <div
            style="
                padding:14px;
                background:#fff;
                border:1px solid #e2e8f0;
                border-radius:9px;
            "
        >

            <div
                style="
                    font-size:11px;
                    color:#64748b;
                    margin-bottom:6px;
                "
            >
                ${escapeHTML(label)}
            </div>

            <div
                style="
                    font-size:12px;
                    color:#0f172a;
                    font-weight:600;
                    word-break:break-word;
                "
            >
                ${escapeHTML(value)}
            </div>

        </div>
    `;
}


// ============================================================
// SCHEDULE INSPECTION FROM REVIEW MODAL
// ============================================================

async function scheduleInspection(
    applicationId
) {

    const input =
        document.getElementById(
            "scheduleInspectionDate"
        );


    const scheduledDate =
        input?.value || "";


    if (!scheduledDate) {

        alert(
            "Please select a scheduled inspection date."
        );

        return;
    }


    try {

        const token =
            getToken();


        if (!token) {

            alert(
                "Officer authentication token not found."
            );

            return;
        }


        const button =
            document.getElementById(
                "scheduleInspectionBtn"
            );


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Scheduling...";
        }


        const response =
            await fetch(
                `${API_BASE_URL}/inspections/${applicationId}/schedule`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        scheduledDate
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Failed to schedule inspection."
            );

            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Schedule Inspection";
            }

            return;
        }


        alert(
            "Joint inspection scheduled successfully."
        );


        renderExistingInspection(
            data.inspection
        );


        await loadOfficerInspections();


    } catch (error) {

        console.error(
            "Schedule inspection error:",
            error
        );


        alert(
            "Unable to schedule inspection."
        );
    }
}


// ============================================================
// INSPECTION ERROR
// ============================================================

function showInspectionError(
    message
) {

    const container =
        document.getElementById(
            "inspectionContent"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div
            style="
                min-height:120px;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                text-align:center;
            "
        >

            <div
                style="
                    font-size:28px;
                    margin-bottom:8px;
                "
            >
                ⚠️
            </div>

            <p
                style="
                    margin:0;
                    color:#64748b;
                    font-size:13px;
                "
            >
                ${escapeHTML(message)}
            </p>

        </div>
    `;
}


// ============================================================
// OFFICER INSPECTION DASHBOARD
// ============================================================

async function loadOfficerInspections() {

    const tableBody =
        document.getElementById(
            "inspectionsTableBody"
        );


    if (!tableBody) {
        return;
    }


    try {

        const token =
            getToken();


        if (!token) {

            renderInspectionTableMessage(
                "Officer authentication required."
            );

            return;
        }


        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#64748b;
                    "
                >
                    Loading inspections...
                </td>
            </tr>
        `;


        const response =
            await fetch(
                `${API_BASE_URL}/inspections/officer/all`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            console.error(
                "Officer inspection API error:",
                data
            );


            renderInspectionTableMessage(
                data.message ||
                "Unable to load inspections."
            );


            return;
        }


        officerInspections =
            data.inspections || [];


        updateInspectionStatistics(
            officerInspections
        );


        renderOfficerInspectionTable(
            officerInspections
        );


    } catch (error) {

        console.error(
            "Officer inspections error:",
            error
        );


        renderInspectionTableMessage(
            "Unable to connect to inspection service."
        );
    }
}


// ============================================================
// INSPECTION STATISTICS
// ============================================================

function updateInspectionStatistics(
    inspectionList
) {

    const total =
        inspectionList.length;


    const coordination =
        inspectionList.filter(
            (inspection) =>
                inspection.status ===
                "Coordination Required"
        ).length;


    const scheduled =
        inspectionList.filter(
            (inspection) =>
                inspection.status ===
                "Scheduled"
        ).length;


    const completed =
        inspectionList.filter(
            (inspection) =>
                inspection.status ===
                "Completed"
        ).length;


    setStatistic(
        ["#totalInspections"],
        total
    );


    setStatistic(
        ["#coordinationInspections"],
        coordination
    );


    setStatistic(
        ["#scheduledInspections"],
        scheduled
    );


    setStatistic(
        ["#completedInspections"],
        completed
    );
}


// ============================================================
// RENDER OFFICER INSPECTION TABLE
// ============================================================

function renderOfficerInspectionTable(
    inspectionList
) {

    const tableBody =
        document.getElementById(
            "inspectionsTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !inspectionList ||
        inspectionList.length === 0
    ) {

        renderInspectionTableMessage(
            "No joint inspections found."
        );

        return;
    }


    inspectionList.forEach(
        (inspection) => {

            const row =
                document.createElement(
                    "tr"
                );


            const departments =
                inspection.departments ||
                [];


            const departmentHTML =
                departments
                    .map(
                        (department) => `
                            <span
                                style="
                                    display:inline-block;
                                    margin:2px 4px 2px 0;
                                    padding:4px 8px;
                                    border-radius:12px;
                                    background:#ecfdf5;
                                    color:#166534;
                                    font-size:10px;
                                    font-weight:600;
                                "
                            >
                                ${escapeHTML(
                                    department
                                )}
                            </span>
                        `
                    )
                    .join("");


            const suggestedDate =
                inspection.suggestedDate
                    ? formatDate(
                        inspection.suggestedDate
                    )
                    : "Not suggested";


            const scheduledDate =
                inspection.scheduledDate
                    ? formatDate(
                        inspection.scheduledDate
                    )
                    : "Not scheduled";


            const status =
                inspection.status ||
                "Coordination Required";


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            inspection.applicationId ||
                            "N/A"
                        )}
                    </strong>
                </td>


                <td>
                    ${escapeHTML(
                        inspection.businessName ||
                        "N/A"
                    )}
                </td>


                <td>
                    <div
                        style="
                            max-width:230px;
                        "
                    >
                        ${departmentHTML}
                    </div>
                </td>


                <td>
                    ${escapeHTML(
                        suggestedDate
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        scheduledDate
                    )}
                </td>


                <td>

                    <span
                        style="
                            display:inline-flex;
                            padding:6px 10px;
                            border-radius:20px;
                            background:${getInspectionStatusBackground(status)};
                            color:${getInspectionStatusColor(status)};
                            font-size:11px;
                            font-weight:700;
                            white-space:nowrap;
                        "
                    >
                        ${escapeHTML(status)}
                    </span>

                </td>


                <td>

                    <div
                        style="
                            display:flex;
                            gap:6px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            onclick="openInspectionFromTable('${escapeHTML(
                                inspection.applicationId
                            )}')"
                            style="
                                padding:7px 10px;
                                border:1px solid #cbd5e1;
                                border-radius:7px;
                                background:#fff;
                                color:#334155;
                                cursor:pointer;
                                font-size:11px;
                                font-weight:600;
                            "
                        >
                            View
                        </button>


                        ${
                            status !== "Scheduled" &&
                            status !== "Completed" &&
                            status !== "Cancelled"

                                ? `
                                    <button
                                        onclick="openScheduleModal('${escapeHTML(
                                            inspection.applicationId
                                        )}')"
                                        style="
                                            padding:7px 10px;
                                            border:none;
                                            border-radius:7px;
                                            background:#2563eb;
                                            color:#fff;
                                            cursor:pointer;
                                            font-size:11px;
                                            font-weight:600;
                                        "
                                    >
                                        Schedule
                                    </button>
                                `
                                : ""
                        }


                        ${
                            status === "Scheduled"

                                ? `
                                    <button
                                        onclick="changeInspectionStatus(
                                            '${escapeHTML(
                                                inspection.applicationId
                                            )}',
                                            'Completed'
                                        )"
                                        style="
                                            padding:7px 10px;
                                            border:none;
                                            border-radius:7px;
                                            background:#16a34a;
                                            color:#fff;
                                            cursor:pointer;
                                            font-size:11px;
                                            font-weight:600;
                                        "
                                    >
                                        Complete
                                    </button>
                                `
                                : ""
                        }


                        ${
                            status !== "Completed" &&
                            status !== "Cancelled"

                                ? `
                                    <button
                                        onclick="changeInspectionStatus(
                                            '${escapeHTML(
                                                inspection.applicationId
                                            )}',
                                            'Cancelled'
                                        )"
                                        style="
                                            padding:7px 10px;
                                            border:1px solid #fecaca;
                                            border-radius:7px;
                                            background:#fff;
                                            color:#dc2626;
                                            cursor:pointer;
                                            font-size:11px;
                                            font-weight:600;
                                        "
                                    >
                                        Cancel
                                    </button>
                                `
                                : ""
                        }

                    </div>

                </td>
            `;


            tableBody.appendChild(
                row
            );

        }
    );
}


// ============================================================
// INSPECTION TABLE MESSAGE
// ============================================================

function renderInspectionTableMessage(
    message
) {

    const tableBody =
        document.getElementById(
            "inspectionsTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr>

            <td
                colspan="7"
                style="
                    text-align:center;
                    padding:35px;
                    color:#64748b;
                "
            >
                ${escapeHTML(message)}
            </td>

        </tr>
    `;
}


// ============================================================
// OPEN INSPECTION FROM TABLE
// ============================================================

function openInspectionFromTable(
    applicationId
) {

    const application =
        applications.find(
            (item) =>
                item.applicationId ===
                applicationId
        );


    if (!application) {

        alert(
            "Application details not found."
        );

        return;
    }


    openReviewModal(
        applicationId
    );
}


// ============================================================
// OPEN INSPECTION MANAGER
// ============================================================

async function openInspectionManager(
    applicationId
) {

    const application =
        applications.find(
            (item) =>
                item.applicationId ===
                applicationId
        );


    if (!application) {

        alert(
            "Application not found."
        );

        return;
    }


    await openReviewModal(
        applicationId
    );


    const inspectionContent =
        document.getElementById(
            "inspectionContent"
        );


    if (inspectionContent) {

        inspectionContent.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
}


// ============================================================
// CREATE INSPECTION FROM DASHBOARD MODAL
// ============================================================

async function createJointInspection() {

    const applicationId =
        document.getElementById(
            "inspectionApplicationId"
        )?.value.trim();


    const departmentsValue =
        document.getElementById(
            "inspectionDepartments"
        )?.value.trim();


    const location =
        document.getElementById(
            "inspectionLocation"
        )?.value.trim();


    const suggestedDate =
        document.getElementById(
            "inspectionSuggestedDate"
        )?.value;


    const notes =
        document.getElementById(
            "inspectionNotes"
        )?.value.trim();


    if (!applicationId) {

        showInspectionModalMessage(
            "Application ID is required.",
            true
        );

        return;
    }


    if (!departmentsValue) {

        showInspectionModalMessage(
            "Please enter at least one department.",
            true
        );

        return;
    }


    const departments =
        departmentsValue
            .split(",")
            .map(
                (department) =>
                    department.trim()
            )
            .filter(
                Boolean
            );


    try {

        const token =
            getToken();


        if (!token) {

            showInspectionModalMessage(
                "Officer authentication required.",
                true
            );

            return;
        }


        const button =
            document.querySelector(
                "#inspectionModal .primary-btn"
            );


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Creating...";
        }


        const response =
            await fetch(
                `${API_BASE_URL}/inspections`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        applicationId,
                        departments,
                        suggestedDate:
                            suggestedDate ||
                            null,
                        location,
                        notes
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            showInspectionModalMessage(
                data.message ||
                "Failed to create inspection.",
                true
            );


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Create Inspection";
            }

            return;
        }


        showInspectionModalMessage(
            "Joint inspection created successfully.",
            false
        );


        await loadOfficerInspections();


        setTimeout(
            () => {
                closeInspectionModal();
            },
            700
        );


    } catch (error) {

        console.error(
            "Dashboard inspection error:",
            error
        );


        showInspectionModalMessage(
            "Unable to create joint inspection.",
            true
        );
    }
}


// ============================================================
// CREATE MODAL MESSAGE
// ============================================================

function showInspectionModalMessage(
    message,
    isError
) {

    const element =
        document.getElementById(
            "inspectionModalMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.style.color =
        isError
            ? "#dc2626"
            : "#15803d";
}


// ============================================================
// OPEN SCHEDULE MODAL
// ============================================================

function openScheduleModal(
    applicationId
) {

    const modal =
        document.getElementById(
            "scheduleInspectionModal"
        );


    if (!modal) {
        return;
    }


    const inspection =
        officerInspections.find(
            (item) =>
                item.applicationId ===
                applicationId
        );


    const application =
        applications.find(
            (item) =>
                item.applicationId ===
                applicationId
        );


    const applicationElement =
        document.getElementById(
            "scheduleInspectionApplication"
        );


    if (applicationElement) {

        applicationElement.textContent =
            inspection?.businessName ||
            application?.businessName ||
            applicationId;
    }


    const idElement =
        document.getElementById(
            "scheduleApplicationId"
        );


    if (idElement) {
        idElement.value =
            applicationId;
    }


    const dateElement =
        document.getElementById(
            "scheduledInspectionDate"
        );


    if (dateElement) {
        dateElement.value =
            "";
    }


    const messageElement =
        document.getElementById(
            "scheduleModalMessage"
        );


    if (messageElement) {
        messageElement.textContent =
            "";
    }


    modal.style.display =
        "flex";
}


// ============================================================
// CLOSE CREATE MODAL
// ============================================================

function closeInspectionModal() {

    const modal =
        document.getElementById(
            "inspectionModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ============================================================
// CLOSE SCHEDULE MODAL
// ============================================================

function closeScheduleInspectionModal() {

    const modal =
        document.getElementById(
            "scheduleInspectionModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ============================================================
// SCHEDULE FROM DASHBOARD
// ============================================================

async function scheduleJointInspection() {

    const applicationId =
        document.getElementById(
            "scheduleApplicationId"
        )?.value.trim();


    const scheduledDate =
        document.getElementById(
            "scheduledInspectionDate"
        )?.value;


    if (!applicationId) {

        showScheduleModalMessage(
            "Application ID is required.",
            true
        );

        return;
    }


    if (!scheduledDate) {

        showScheduleModalMessage(
            "Please select a scheduled date.",
            true
        );

        return;
    }


    try {

        const token =
            getToken();


        if (!token) {

            showScheduleModalMessage(
                "Officer authentication required.",
                true
            );

            return;
        }


        const button =
            document.querySelector(
                "#scheduleInspectionModal .primary-btn"
            );


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Scheduling...";
        }


        const response =
            await fetch(
                `${API_BASE_URL}/inspections/${applicationId}/schedule`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        scheduledDate
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            showScheduleModalMessage(
                data.message ||
                "Failed to schedule inspection.",
                true
            );


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "Schedule Inspection";
            }

            return;
        }


        showScheduleModalMessage(
            "Inspection scheduled successfully.",
            false
        );


        await loadOfficerInspections();


        setTimeout(
            () => {
                closeScheduleInspectionModal();
            },
            700
        );


    } catch (error) {

        console.error(
            "Dashboard scheduling error:",
            error
        );


        showScheduleModalMessage(
            "Unable to schedule inspection.",
            true
        );
    }
}


// ============================================================
// SCHEDULE MODAL MESSAGE
// ============================================================

function showScheduleModalMessage(
    message,
    isError
) {

    const element =
        document.getElementById(
            "scheduleModalMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.style.color =
        isError
            ? "#dc2626"
            : "#15803d";
}


// ============================================================
// CHANGE INSPECTION STATUS
// ============================================================

async function changeInspectionStatus(
    applicationId,
    newStatus
) {

    const action =
        newStatus === "Completed"
            ? "complete"
            : "cancel";


    const confirmed =
        window.confirm(
            `Are you sure you want to ${action} this inspection?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const token =
            getToken();


        if (!token) {

            alert(
                "Officer authentication token not found."
            );

            return;
        }


        const response =
            await fetch(
                `${API_BASE_URL}/inspections/${applicationId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Failed to update inspection status."
            );

            return;
        }


        alert(
            `Inspection marked as ${newStatus}.`
        );


        await loadOfficerInspections();


    } catch (error) {

        console.error(
            "Inspection status error:",
            error
        );


        alert(
            "Unable to update inspection status."
        );
    }
}


// ============================================================
// APPLICATION STATUS UPDATE
// ============================================================

async function updateApplicationStatus() {

    if (!selectedApplication) {
        return;
    }


    const select =
        document.getElementById(
            "reviewStatusSelect"
        );


    if (!select) {
        return;
    }


    const newStatus =
        select.value;


    try {

        const token =
            getToken();


        if (!token) {

            alert(
                "Officer authentication token not found."
            );

            return;
        }


        const response =
            await fetch(
                `${API_BASE_URL}/applications/${selectedApplication.applicationId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Failed to update status."
            );

            return;
        }


        alert(
            "Application status updated successfully."
        );


        closeReviewModal();


        await loadApplications();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            "Unable to update application status."
        );
    }
}


// ============================================================
// CLOSE REVIEW MODAL
// ============================================================

function closeReviewModal() {

    const modal =
        document.getElementById(
            "applicationReviewModal"
        );


    if (modal) {
        modal.remove();
    }


    selectedApplication =
        null;
}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const searchInput =
        document.querySelector(
            "#applicationSearch, .application-search"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                applyCurrentFilters();

                return;
            }


            const filtered =
                applications.filter(
                    (application) => {

                        return (

                            application.applicationId
                                ?.toLowerCase()
                                .includes(query)

                            ||

                            application.applicantName
                                ?.toLowerCase()
                                .includes(query)

                            ||

                            application.businessName
                                ?.toLowerCase()
                                .includes(query)

                            ||

                            application.approvalName
                                ?.toLowerCase()
                                .includes(query)

                            ||

                            application.department
                                ?.toLowerCase()
                                .includes(query)

                        );

                    }
                );


            renderApplications(
                filtered
            );

        }
    );
}


// ============================================================
// FILTERS
// ============================================================

function setupFilters() {

    const filter =
        document.querySelector(
            "#statusFilter"
        );


    if (!filter) {
        return;
    }


    filter.addEventListener(
        "change",
        applyCurrentFilters
    );
}


function applyCurrentFilters() {

    const searchInput =
        document.querySelector(
            "#applicationSearch"
        );


    const filter =
        document.querySelector(
            "#statusFilter"
        );


    const query =
        searchInput?.value
            .trim()
            .toLowerCase() || "";


    const status =
        filter?.value || "all";


    const filtered =
        applications.filter(
            (application) => {

                const matchesSearch =
                    !query ||

                    application.applicationId
                        ?.toLowerCase()
                        .includes(query) ||

                    application.applicantName
                        ?.toLowerCase()
                        .includes(query) ||

                    application.businessName
                        ?.toLowerCase()
                        .includes(query) ||

                    application.approvalName
                        ?.toLowerCase()
                        .includes(query) ||

                    application.department
                        ?.toLowerCase()
                        .includes(query);


                const matchesStatus =
                    status === "all" ||
                    status === "All" ||
                    application.status ===
                    status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    renderApplications(
        filtered
    );
}


// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

    const logoutButtons =
        document.querySelectorAll(
            "#logoutBtn, .logout-btn"
        );


    logoutButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    localStorage.removeItem(
                        "sahajSetuToken"
                    );


                    localStorage.removeItem(
                        "sahajSetuUser"
                    );


                    window.location.href =
                        "login.html";

                }
            );

        }
    );
}


// ============================================================
// INSPECTION STATUS COLORS
// ============================================================

function getInspectionStatusColor(
    status
) {

    switch (status) {

        case "Scheduled":
            return "#1d4ed8";

        case "Completed":
            return "#15803d";

        case "Cancelled":
            return "#dc2626";

        case "Date Suggested":
            return "#a16207";

        default:
            return "#64748b";
    }
}


function getInspectionStatusBackground(
    status
) {

    switch (status) {

        case "Scheduled":
            return "#dbeafe";

        case "Completed":
            return "#dcfce7";

        case "Cancelled":
            return "#fee2e2";

        case "Date Suggested":
            return "#fef9c3";

        default:
            return "#f1f5f9";
    }
}


// ============================================================
// STATUS COLORS
// ============================================================

function getStatusClass(
    status
) {

    switch (status) {

        case "Approved":
            return "status-approved";

        case "Rejected":
            return "status-rejected";

        case "Under Review":
            return "status-review";

        case "Query Raised":
            return "status-query";

        default:
            return "status-submitted";
    }
}


// ============================================================
// RISK COLORS
// ============================================================

function getRiskColor(
    level
) {

    if (level === "High") {
        return "#dc2626";
    }


    if (level === "Medium") {
        return "#d97706";
    }


    return "#16a34a";
}


function getRiskBackground(
    level
) {

    if (level === "High") {
        return "#fee2e2";
    }


    if (level === "Medium") {
        return "#fef3c7";
    }


    return "#dcfce7";
}


// ============================================================
// HELPERS
// ============================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value || "N/A";
    }
}


function formatDate(
    date
) {

    if (!date) {
        return "N/A";
    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "N/A";
    }


    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ============================================================
// SPINNER ANIMATION
// ============================================================

function addSpinnerAnimation() {

    if (
        document.getElementById(
            "dashboardSpinnerStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "dashboardSpinnerStyles";


    style.textContent = `

        @keyframes riskSpinner {
            to {
                transform:rotate(360deg);
            }
        }

        @keyframes delaySpinner {
            to {
                transform:rotate(360deg);
            }
        }

        @keyframes inspectionSpinner {
            to {
                transform:rotate(360deg);
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


// ============================================================
// MODAL OUTSIDE CLICK
// ============================================================

document.addEventListener(
    "click",
    (event) => {

        const inspectionModal =
            document.getElementById(
                "inspectionModal"
            );


        const scheduleModal =
            document.getElementById(
                "scheduleInspectionModal"
            );


        if (
            inspectionModal &&
            event.target ===
            inspectionModal
        ) {

            closeInspectionModal();
        }


        if (
            scheduleModal &&
            event.target ===
            scheduleModal
        ) {

            closeScheduleInspectionModal();
        }

    }
);