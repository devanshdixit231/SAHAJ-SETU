const API_BASE_URL = "http://localhost:5000/api";


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    protectDashboard();

    setupNavigation();
    setupSearch();
    setupApprovalButton();
    setupQuickActions();
    setupQuestionButtons();
    setupBusinessButton();
    setupNotifications();
    setupLogout();

    loadUserData();
    loadBusinessProfile();
    updateApplicationStats();

});


// =========================================================
// AUTH PROTECTION
// =========================================================

function protectDashboard() {

    const token =
        localStorage.getItem("sahajSetuToken");

    if (!token) {

        window.location.href = "login.html";

    }

}


// =========================================================
// LOAD USER DATA
// =========================================================

async function loadUserData() {

    const token =
        localStorage.getItem("sahajSetuToken");

    if (!token) return;

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/auth/me`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (response.status === 401) {

            logoutUser();
            return;

        }

        const data =
            await response.json();

        if (!data.success) return;

        const user =
            data.user;

        const profileName =
            document.querySelector(".profile-name");

        const welcomeName =
            document.querySelector(".welcome-card h2");

        if (profileName) {

            profileName.textContent =
                user.name || "User";

        }

        if (welcomeName) {

            welcomeName.textContent =
                `Welcome back, ${user.name || "User"}`;

        }

    } catch (error) {

        console.error(
            "User loading error:",
            error
        );

    }

}


// =========================================================
// SIDEBAR NAVIGATION
// =========================================================

function setupNavigation() {

    const menuLinks =
        document.querySelectorAll(".menu a");

    menuLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                menuLinks.forEach(
                    function (item) {
                        item.classList.remove("active");
                    }
                );

                link.classList.add("active");

                const text =
                    link.innerText.trim();


                // MY BUSINESS
                if (
                    link.id === "myBusinessMenu" ||
                    text.includes("My Business")
                ) {

                    openBusinessModal();
                    return;

                }


                // KNOW YOUR APPROVALS
                if (
                    text.includes("Know Your Approvals")
                ) {

                    const section =
                        document.querySelector(
                            ".approvals-card"
                        );

                    if (section) {

                        section.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                    return;

                }


                // APPLICATIONS
                if (
                    text.includes("Applications")
                ) {

                    const section =
                        document.querySelector(
                            ".tracking-card"
                        );

                    if (section) {

                        section.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                    loadMyApplications();

                    return;

                }


                showMessage(
                    `${text} selected`
                );

            }
        );

    });

}


// =========================================================
// BUSINESS BUTTON
// =========================================================

function setupBusinessButton() {

    const button =
        document.querySelector(".small-button");

    if (!button) return;

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openBusinessModal();

        }
    );

}


// =========================================================
// BUSINESS MODAL
// =========================================================

function openBusinessModal() {

    const oldModal =
        document.getElementById("businessModal");

    if (oldModal) {
        oldModal.remove();
    }

    const modal =
        document.createElement("div");

    modal.id =
        "businessModal";

    modal.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.55);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        ">

            <div style="
                background:white;
                width:100%;
                max-width:600px;
                max-height:90vh;
                overflow-y:auto;
                border-radius:14px;
                padding:28px;
                box-shadow:0 20px 60px rgba(0,0,0,0.25);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:22px;
                ">

                    <h2 style="
                        margin:0;
                        font-size:24px;
                        color:#1f2937;
                    ">
                        My Business
                    </h2>

                    <button
                        id="closeBusinessModal"
                        type="button"
                        style="
                            border:none;
                            background:#f3f4f6;
                            width:36px;
                            height:36px;
                            border-radius:50%;
                            font-size:22px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>


                <form id="businessForm">

                    <div style="margin-bottom:15px;">
                        <label>Business Name *</label>

                        <input
                            type="text"
                            id="businessName"
                            placeholder="Enter business name"
                            required
                            style="${inputStyle()}"
                        >
                    </div>


                    <div style="margin-bottom:15px;">
                        <label>Business Type *</label>

                        <input
                            type="text"
                            id="businessType"
                            placeholder="e.g. Private Limited, Partnership, Startup"
                            required
                            style="${inputStyle()}"
                        >
                    </div>


                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:15px;
                        margin-bottom:15px;
                    ">

                        <div>
                            <label>State *</label>

                            <input
                                type="text"
                                id="businessState"
                                placeholder="Enter state"
                                required
                                style="${inputStyle()}"
                            >
                        </div>

                        <div>
                            <label>District *</label>

                            <input
                                type="text"
                                id="businessDistrict"
                                placeholder="Enter district"
                                required
                                style="${inputStyle()}"
                            >
                        </div>

                    </div>


                    <div style="margin-bottom:15px;">
                        <label>Industry *</label>

                        <input
                            type="text"
                            id="businessIndustry"
                            placeholder="e.g. IT, Manufacturing, Food"
                            required
                            style="${inputStyle()}"
                        >
                    </div>


                    <div style="margin-bottom:15px;">
                        <label>Investment *</label>

                        <input
                            type="text"
                            id="businessInvestment"
                            placeholder="e.g. ₹10 Lakhs"
                            required
                            style="${inputStyle()}"
                        >
                    </div>


                    <div style="margin-bottom:20px;">
                        <label>Business Address</label>

                        <textarea
                            id="businessAddress"
                            placeholder="Enter complete business address"
                            rows="3"
                            style="${inputStyle()};resize:vertical;"
                        ></textarea>
                    </div>


                    <button
                        type="submit"
                        id="saveBusinessBtn"
                        style="
                            width:100%;
                            padding:13px;
                            border:none;
                            border-radius:8px;
                            background:#2563eb;
                            color:white;
                            font-size:16px;
                            font-weight:600;
                            cursor:pointer;
                        "
                    >
                        Save Business Profile
                    </button>

                </form>

            </div>

        </div>

    `;

    document.body.appendChild(modal);


    document
        .getElementById("closeBusinessModal")
        .addEventListener(
            "click",
            () => modal.remove()
        );


    modal.firstElementChild.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                modal.firstElementChild
            ) {
                modal.remove();
            }

        }
    );


    document
        .getElementById("businessForm")
        .addEventListener(
            "submit",
            saveBusinessProfile
        );


    fillBusinessForm();

}


// =========================================================
// INPUT STYLE
// =========================================================

function inputStyle() {

    return `
        width:100%;
        box-sizing:border-box;
        padding:11px 12px;
        margin-top:6px;
        border:1px solid #d1d5db;
        border-radius:7px;
        font-size:14px;
        outline:none;
    `;

}


// =========================================================
// LOAD BUSINESS PROFILE
// =========================================================

async function loadBusinessProfile() {

    const token =
        localStorage.getItem("sahajSetuToken");

    if (!token) return;

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/business/me`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (
            data.success &&
            data.business
        ) {

            updateBusinessCard(
                data.business
            );

        }

    } catch (error) {

        console.error(
            "Business loading error:",
            error
        );

    }

}


// =========================================================
// FILL BUSINESS FORM
// =========================================================

async function fillBusinessForm() {

    const token =
        localStorage.getItem("sahajSetuToken");

    if (!token) return;

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/business/me`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (
            !data.success ||
            !data.business
        ) {
            return;
        }

        const business =
            data.business;

        const fields = {

            businessName:
                business.businessName,

            businessType:
                business.businessType,

            businessState:
                business.state,

            businessDistrict:
                business.district,

            businessIndustry:
                business.industry,

            businessInvestment:
                business.investment,

            businessAddress:
                business.address

        };

        Object.keys(fields).forEach(
            function (id) {

                const element =
                    document.getElementById(id);

                if (element) {

                    element.value =
                        fields[id] || "";

                }

            }
        );

    } catch (error) {

        console.error(
            "Fill business form error:",
            error
        );

    }

}


// =========================================================
// SAVE BUSINESS PROFILE
// =========================================================

async function saveBusinessProfile(event) {

    event.preventDefault();

    const token =
        localStorage.getItem("sahajSetuToken");

    if (!token) {

        alert("Please login again.");

        window.location.href =
            "login.html";

        return;

    }

    const button =
        document.getElementById("saveBusinessBtn");

    button.disabled = true;
    button.textContent = "Saving...";


    const businessData = {

        businessName:
            document.getElementById(
                "businessName"
            ).value.trim(),

        businessType:
            document.getElementById(
                "businessType"
            ).value.trim(),

        state:
            document.getElementById(
                "businessState"
            ).value.trim(),

        district:
            document.getElementById(
                "businessDistrict"
            ).value.trim(),

        industry:
            document.getElementById(
                "businessIndustry"
            ).value.trim(),

        investment:
            document.getElementById(
                "businessInvestment"
            ).value.trim(),

        address:
            document.getElementById(
                "businessAddress"
            ).value.trim()

    };


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/business/me`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            businessData
                        )
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
                "Unable to save business profile."
            );

            button.disabled = false;
            button.textContent =
                "Save Business Profile";

            return;

        }

        updateBusinessCard(
            data.business
        );

        alert(
            "Business profile saved successfully!"
        );

        const modal =
            document.getElementById(
                "businessModal"
            );

        if (modal) {
            modal.remove();
        }

    } catch (error) {

        console.error(
            "Save business error:",
            error
        );

        alert(
            "Server se connection nahi ho pa raha. Backend check karo."
        );

        button.disabled = false;

        button.textContent =
            "Save Business Profile";

    }

}


// =========================================================
// UPDATE BUSINESS CARD
// =========================================================

function updateBusinessCard(business) {

    const nameElement =
        document.querySelector(
            ".business-name"
        );

    const infoElement =
        document.querySelector(
            ".business-info"
        );

    if (nameElement) {

        nameElement.textContent =
            business.businessName ||
            "Business Name";

    }

    if (infoElement) {

        infoElement.textContent =
            `${business.industry || "Industry"} • ${business.district || "District"}, ${business.state || "State"}`;

    }

}


// =========================================================
// SEARCH
// =========================================================

function setupSearch() {

    const searchInput =
        document.querySelector(".search-input");

    if (!searchInput) return;

    searchInput.addEventListener(
        "input",
        function () {

            console.log(
                "Searching:",
                searchInput.value
            );

        }
    );

}


// =========================================================
// APPROVAL BUTTON
// =========================================================

function setupApprovalButton() {

    const buttons =
        document.querySelectorAll(
            ".approval-button"
        );

    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const state =
                    document.getElementById(
                        "state"
                    )?.value || "";

                const industry =
                    document.getElementById(
                        "industry"
                    )?.value || "";

                const investment =
                    document.getElementById(
                        "investment"
                    )?.value || "";

                showApprovalResults(
                    state,
                    industry,
                    investment
                );

            }
        );

    });

}


// =========================================================
// APPROVAL DATA
// =========================================================

const APPROVAL_DATA = {

    "Manufacturing": [

        {
            name: "Factory / Industrial License",
            department: "Labour Department",
            type: "State Approval",
            purpose:
                "Required for applicable industrial or factory operations."
        },

        {
            name: "Pollution Consent",
            department: "Pollution Control Board",
            type: "Environmental Approval",
            purpose:
                "Environmental consent may be required depending on the activity."
        },

        {
            name: "Fire NOC",
            department: "Fire Department",
            type: "Safety Approval",
            purpose:
                "Fire safety clearance for applicable premises."
        },

        {
            name: "GST Registration",
            department: "GST Department",
            type: "Tax Registration",
            purpose:
                "Tax registration where applicable under GST rules."
        },

        {
            name: "Electricity Connection",
            department: "Electricity Department",
            type: "Utility Approval",
            purpose:
                "Connection or related approval for business electricity requirements."
        }

    ],


    "IT Services": [

        {
            name: "GST Registration",
            department: "GST Department",
            type: "Tax Registration",
            purpose:
                "Tax registration where applicable under GST rules."
        },

        {
            name: "Shops & Establishment Registration",
            department: "Labour Department",
            type: "Business Registration",
            purpose:
                "Registration requirements may apply depending on the establishment and state rules."
        },

        {
            name: "Fire NOC",
            department: "Fire Department",
            type: "Safety Approval",
            purpose:
                "Fire safety clearance for applicable premises."
        }

    ],


    "Construction": [

        {
            name: "Building Plan Approval",
            department: "Local Authority",
            type: "Construction Approval",
            purpose:
                "Approval of applicable building plans before construction."
        },

        {
            name: "Fire NOC",
            department: "Fire Department",
            type: "Safety Approval",
            purpose:
                "Fire safety clearance for applicable buildings."
        },

        {
            name: "Pollution Consent",
            department: "Pollution Control Board",
            type: "Environmental Approval",
            purpose:
                "Environmental consent may apply depending on the project."
        },

        {
            name: "Labour Registration",
            department: "Labour Department",
            type: "Labour Approval",
            purpose:
                "Applicable labour-related registration or compliance."
        }

    ],


    "Healthcare": [

        {
            name: "Clinical Establishment Registration",
            department: "Health Department",
            type: "Healthcare Approval",
            purpose:
                "Registration requirements may apply to healthcare establishments."
        },

        {
            name: "Fire NOC",
            department: "Fire Department",
            type: "Safety Approval",
            purpose:
                "Fire safety clearance for applicable premises."
        },

        {
            name: "Pollution Consent",
            department: "Pollution Control Board",
            type: "Environmental Approval",
            purpose:
                "Environmental requirements may apply depending on healthcare activity."
        }

    ]

};


// =========================================================
// SHOW APPROVAL RESULTS
// =========================================================

function showApprovalResults(
    state,
    industry,
    investment
) {

    const oldResult =
        document.getElementById(
            "approvalResults"
        );

    if (oldResult) {
        oldResult.remove();
    }

    const approvals =
        APPROVAL_DATA[industry] || [];

    const resultContainer =
        document.createElement("div");

    resultContainer.id =
        "approvalResults";

    resultContainer.className =
        "approval-results";


    resultContainer.innerHTML = `

        <h3>
            ✅ Recommended Approvals
        </h3>

        <p>
            <strong>Location:</strong> ${escapeHTML(state)}
            &nbsp; | &nbsp;
            <strong>Industry:</strong> ${escapeHTML(industry)}
            &nbsp; | &nbsp;
            <strong>Investment:</strong> ${escapeHTML(investment)}
        </p>

    `;


    approvals.forEach(
        function (approval, index) {

            const card =
                document.createElement("div");

            card.className =
                "approval-result-item";

            card.innerHTML = `

                <div class="approval-number">
                    ${index + 1}
                </div>

                <div class="approval-result-content">

                    <h4>
                        ${escapeHTML(approval.name)}
                    </h4>

                    <p>
                        <strong>
                            Department:
                        </strong>

                        ${escapeHTML(
                            approval.department
                        )}
                    </p>

                    <span class="approval-type">
                        ${escapeHTML(
                            approval.type
                        )}
                    </span>

                </div>

                <button
                    type="button"
                    class="approval-view-button"
                >
                    View →
                </button>

            `;


            card
                .querySelector(
                    ".approval-view-button"
                )
                .addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        openApprovalDetails(
                            approval,
                            state,
                            industry,
                            investment
                        );

                    }
                );


            resultContainer.appendChild(card);

        }
    );


    if (approvals.length === 0) {

        const noResult =
            document.createElement("p");

        noResult.textContent =
            "No preliminary approval list is available for this industry.";

        resultContainer.appendChild(
            noResult
        );

    }


    const note =
        document.createElement("div");

    note.className =
        "approval-note";

    note.innerHTML =
        "ℹ️ This is a preliminary recommendation. Final requirements may vary based on business activity, location and applicable government rules.";

    resultContainer.appendChild(note);


    const approvalSection =
        document.querySelector(
            ".approvals-card"
        );

    if (approvalSection) {

        approvalSection.appendChild(
            resultContainer
        );

        resultContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// =========================================================
// APPROVAL DETAILS
// =========================================================

function openApprovalDetails(
    approval,
    state,
    industry,
    investment
) {

    const oldModal =
        document.getElementById(
            "approvalDetailsModal"
        );

    if (oldModal) {
        oldModal.remove();
    }

    const modal =
        document.createElement("div");

    modal.id =
        "approvalDetailsModal";


    modal.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            background:rgba(15,23,42,0.65);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:100000;
            padding:20px;
        ">

            <div style="
                background:white;
                width:100%;
                max-width:650px;
                max-height:90vh;
                overflow-y:auto;
                border-radius:16px;
                padding:30px;
                box-shadow:0 25px 70px rgba(0,0,0,0.3);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:15px;
                    margin-bottom:20px;
                ">

                    <div>

                        <div style="
                            color:#2563eb;
                            font-size:13px;
                            font-weight:700;
                            margin-bottom:6px;
                        ">
                            APPROVAL DETAILS
                        </div>

                        <h2 style="
                            margin:0;
                            color:#111827;
                            font-size:25px;
                        ">
                            ${escapeHTML(approval.name)}
                        </h2>

                    </div>

                    <button
                        id="closeApprovalDetails"
                        type="button"
                        style="
                            border:none;
                            background:#f3f4f6;
                            width:38px;
                            height:38px;
                            border-radius:50%;
                            font-size:22px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>


                <div style="
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:12px;
                    margin-bottom:22px;
                ">

                    ${infoBox(
                        "Department",
                        approval.department
                    )}

                    ${infoBox(
                        "Approval Type",
                        approval.type
                    )}

                    ${infoBox(
                        "State",
                        state
                    )}

                    ${infoBox(
                        "Investment",
                        investment
                    )}

                </div>


                <div style="margin-bottom:20px;">

                    <h3 style="
                        margin:0 0 8px;
                        color:#1f2937;
                    ">
                        What is this approval?
                    </h3>

                    <p style="
                        margin:0;
                        color:#4b5563;
                        line-height:1.6;
                    ">
                        ${escapeHTML(
                            approval.purpose
                        )}
                    </p>

                </div>


                <div style="
                    background:#eff6ff;
                    border:1px solid #bfdbfe;
                    border-radius:10px;
                    padding:15px;
                    margin-bottom:24px;
                ">

                    <strong style="
                        color:#1d4ed8;
                    ">
                        📋 Application Process
                    </strong>

                    <ol style="
                        margin:10px 0 0 20px;
                        padding:0;
                        color:#374151;
                        line-height:1.8;
                    ">

                        <li>
                            Verify applicant and business details
                        </li>

                        <li>
                            Upload required documents
                        </li>

                        <li>
                            Submit the application
                        </li>

                        <li>
                            Track application status
                        </li>

                    </ol>

                </div>


                <div style="
                    display:flex;
                    gap:12px;
                ">

                    <button
                        id="closeApprovalDetailsBtn"
                        type="button"
                        style="
                            flex:1;
                            padding:13px;
                            border:1px solid #d1d5db;
                            border-radius:8px;
                            background:white;
                            color:#374151;
                            font-weight:600;
                            cursor:pointer;
                        "
                    >
                        Close
                    </button>


                    <button
                        id="applyApprovalBtn"
                        type="button"
                        style="
                            flex:1;
                            padding:13px;
                            border:none;
                            border-radius:8px;
                            background:#2563eb;
                            color:white;
                            font-weight:600;
                            cursor:pointer;
                        "
                    >
                        Apply Now →
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    document
        .getElementById(
            "closeApprovalDetails"
        )
        .onclick =
            () => modal.remove();


    document
        .getElementById(
            "closeApprovalDetailsBtn"
        )
        .onclick =
            () => modal.remove();


    document
        .getElementById(
            "applyApprovalBtn"
        )
        .onclick =
            function () {

                modal.remove();

                openApplicationForm(
                    approval,
                    state,
                    industry,
                    investment
                );

            };


    modal.firstElementChild.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                modal.firstElementChild
            ) {

                modal.remove();

            }

        }
    );

}


// =========================================================
// INFO BOX
// =========================================================

function infoBox(label, value) {

    return `

        <div style="
            background:#f8fafc;
            padding:14px;
            border-radius:10px;
        ">

            <div style="
                color:#64748b;
                font-size:12px;
                margin-bottom:5px;
            ">
                ${escapeHTML(label)}
            </div>

            <strong>
                ${escapeHTML(value)}
            </strong>

        </div>

    `;

}


// =========================================================
// APPLICATION FORM
// =========================================================

async function openApplicationForm(
    approval,
    state,
    industry,
    investment
) {

    const oldModal =
        document.getElementById(
            "applicationModal"
        );

    if (oldModal) {
        oldModal.remove();
    }

    const modal =
        document.createElement("div");

    modal.id =
        "applicationModal";


    modal.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            background:rgba(15,23,42,0.65);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:100001;
            padding:20px;
        ">

            <div style="
                background:white;
                width:100%;
                max-width:700px;
                max-height:92vh;
                overflow-y:auto;
                border-radius:16px;
                padding:30px;
                box-shadow:0 25px 70px rgba(0,0,0,0.3);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    margin-bottom:22px;
                ">

                    <div>

                        <div style="
                            color:#2563eb;
                            font-size:13px;
                            font-weight:700;
                            margin-bottom:5px;
                        ">
                            NEW APPLICATION
                        </div>

                        <h2 style="
                            margin:0;
                            color:#111827;
                        ">
                            ${escapeHTML(
                                approval.name
                            )}
                        </h2>

                    </div>

                    <button
                        id="closeApplicationModal"
                        type="button"
                        style="
                            border:none;
                            background:#f3f4f6;
                            width:38px;
                            height:38px;
                            border-radius:50%;
                            font-size:22px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>


                <div style="
                    background:#f8fafc;
                    padding:14px;
                    border-radius:10px;
                    margin-bottom:22px;
                    color:#475569;
                    font-size:14px;
                ">

                    <strong>Location:</strong>
                    ${escapeHTML(state)}

                    &nbsp; | &nbsp;

                    <strong>Industry:</strong>
                    ${escapeHTML(industry)}

                    &nbsp; | &nbsp;

                    <strong>Investment:</strong>
                    ${escapeHTML(investment)}

                </div>


                <form id="applicationForm">

                    <h3 style="
                        margin:0 0 15px;
                        color:#1f2937;
                    ">
                        Applicant Details
                    </h3>


                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:15px;
                        margin-bottom:18px;
                    ">

                        <div>

                            <label>
                                Applicant Name *
                            </label>

                            <input
                                type="text"
                                id="applicationApplicantName"
                                required
                                style="${inputStyle()}"
                            >

                        </div>


                        <div>

                            <label>
                                Business Name *
                            </label>

                            <input
                                type="text"
                                id="applicationBusinessName"
                                required
                                style="${inputStyle()}"
                            >

                        </div>

                    </div>


                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:15px;
                        margin-bottom:18px;
                    ">

                        <div>

                            <label>
                                State *
                            </label>

                            <input
                                type="text"
                                id="applicationState"
                                required
                                style="${inputStyle()}"
                            >

                        </div>


                        <div>

                            <label>
                                District *
                            </label>

                            <input
                                type="text"
                                id="applicationDistrict"
                                required
                                style="${inputStyle()}"
                            >

                        </div>

                    </div>


                    <div style="margin-bottom:18px;">

                        <label>
                            Business Address *
                        </label>

                        <textarea
                            id="applicationAddress"
                            rows="3"
                            required
                            style="${inputStyle()};resize:vertical;"
                        ></textarea>

                    </div>


                    <h3 style="
                        margin:8px 0 15px;
                        color:#1f2937;
                    ">
                        Documents
                    </h3>


                    <div style="
                        background:#f8fafc;
                        border:1px dashed #94a3b8;
                        border-radius:10px;
                        padding:18px;
                        margin-bottom:10px;
                    ">

                        <label style="
                            font-weight:600;
                            display:block;
                            margin-bottom:8px;
                        ">
                            Upload Supporting Document
                        </label>

                        <input
                            type="file"
                            id="applicationDocuments"
                            accept=".pdf,.jpg,.jpeg,.png"
                            style="
                                width:100%;
                                box-sizing:border-box;
                            "
                        >

                        <small style="
                            display:block;
                            margin-top:8px;
                            color:#64748b;
                        ">
                            Accepted formats: PDF, JPG, JPEG, PNG.
                            Maximum size: 5 MB.
                        </small>

                    </div>


                    <div style="
                        background:#eff6ff;
                        border:1px solid #bfdbfe;
                        border-radius:10px;
                        padding:13px;
                        margin:18px 0;
                        color:#1e40af;
                        font-size:13px;
                        line-height:1.5;
                    ">

                        🔒 Your application and uploaded document
                        will be submitted to the Sahaj Setu backend
                        for processing and tracking.

                    </div>


                    <button
                        type="submit"
                        id="submitApplicationBtn"
                        style="
                            width:100%;
                            padding:14px;
                            border:none;
                            border-radius:9px;
                            background:#2563eb;
                            color:white;
                            font-size:16px;
                            font-weight:700;
                            cursor:pointer;
                        "
                    >
                        Submit Application →
                    </button>

                </form>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    document
        .getElementById(
            "closeApplicationModal"
        )
        .onclick =
            () => modal.remove();


    modal.firstElementChild.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                modal.firstElementChild
            ) {

                modal.remove();

            }

        }
    );


    await fillApplicationDetails();


    document
        .getElementById(
            "applicationForm"
        )
        .addEventListener(
            "submit",
            function (event) {

                submitApplication(
                    event,
                    approval,
                    state,
                    industry,
                    investment
                );

            }
        );

}


// =========================================================
// FILL APPLICATION DETAILS
// =========================================================

async function fillApplicationDetails() {

    const token =
        localStorage.getItem("sahajSetuToken");

    if (!token) return;

    try {

        const userResponse =
            await fetch(
                `${API_BASE_URL}/auth/me`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const userData =
            await userResponse.json();

        if (
            userData.success &&
            userData.user
        ) {

            const nameInput =
                document.getElementById(
                    "applicationApplicantName"
                );

            if (nameInput) {

                nameInput.value =
                    userData.user.name || "";

            }

        }


        const businessResponse =
            await fetch(
                `${API_BASE_URL}/business/me`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const businessData =
            await businessResponse.json();

        if (
            businessData.success &&
            businessData.business
        ) {

            const business =
                businessData.business;

            const values = {

                applicationBusinessName:
                    business.businessName,

                applicationState:
                    business.state,

                applicationDistrict:
                    business.district,

                applicationAddress:
                    business.address

            };

            Object.keys(values).forEach(
                function (id) {

                    const element =
                        document.getElementById(id);

                    if (element) {

                        element.value =
                            values[id] || "";

                    }

                }
            );

        }

    } catch (error) {

        console.error(
            "Application details loading error:",
            error
        );

    }

}


// =========================================================
// SUBMIT APPLICATION
// =========================================================

async function submitApplication(
    event,
    approval,
    state,
    industry,
    investment
) {

    event.preventDefault();

    const submitButton =
        document.getElementById(
            "submitApplicationBtn"
        );

    const applicantName =
        document.getElementById(
            "applicationApplicantName"
        ).value.trim();

    const businessName =
        document.getElementById(
            "applicationBusinessName"
        ).value.trim();

    const applicationState =
        document.getElementById(
            "applicationState"
        ).value.trim();

    const district =
        document.getElementById(
            "applicationDistrict"
        ).value.trim();

    const address =
        document.getElementById(
            "applicationAddress"
        ).value.trim();

    const fileInput =
        document.getElementById(
            "applicationDocuments"
        );

    const files =
        fileInput
            ? Array.from(fileInput.files)
            : [];


    const token =
        localStorage.getItem(
            "sahajSetuToken"
        );


    if (!token) {

        alert(
            "Session expired. Please login again."
        );

        window.location.href =
            "login.html";

        return;

    }


    if (
        !applicantName ||
        !businessName ||
        !applicationState ||
        !district ||
        !address
    ) {

        alert(
            "Please fill all required application details."
        );

        return;

    }


    if (files.length > 1) {

        alert(
            "Please upload only one document for this application."
        );

        return;

    }


    if (files.length > 0) {

        const file =
            files[0];

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Only PDF, JPG, JPEG and PNG files are allowed."
            );

            return;

        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Document size must be less than 5 MB."
            );

            return;

        }

    }


    submitButton.disabled =
        true;

    submitButton.textContent =
        "Submitting...";


    const formData =
        new FormData();


    formData.append(
        "approvalName",
        approval.name
    );

    formData.append(
        "department",
        approval.department
    );

    formData.append(
        "approvalType",
        approval.type
    );

    formData.append(
        "state",
        applicationState
    );

    formData.append(
        "industry",
        industry
    );

    formData.append(
        "investment",
        investment
    );

    formData.append(
        "applicantName",
        applicantName
    );

    formData.append(
        "businessName",
        businessName
    );

    formData.append(
        "district",
        district
    );

    formData.append(
        "address",
        address
    );


    if (files.length > 0) {

        formData.append(
            "document",
            files[0]
        );

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/applications`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


        const data =
            await response.json();


        console.log(
            "Application API Response:",
            data
        );


        if (response.status === 401) {

            logoutUser();
            return;

        }


        if (
            !response.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Application submission failed."
            );

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Submit Application →";

            return;

        }


        const application =
            data.application;


        const modal =
            document.getElementById(
                "applicationModal"
            );

        if (modal) {
            modal.remove();
        }


        showApplicationSuccess(
            application
        );


        updateApplicationStats();

    } catch (error) {

        console.error(
            "Application submission error:",
            error
        );

        alert(
            "Server se connection nahi ho pa raha. Backend check karo."
        );

        submitButton.disabled =
            false;

        submitButton.textContent =
            "Submit Application →";

    }

}


// =========================================================
// APPLICATION SUCCESS
// =========================================================

function showApplicationSuccess(
    application
) {

    const oldModal =
        document.getElementById(
            "applicationSuccessModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");

    modal.id =
        "applicationSuccessModal";


    modal.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            background:rgba(15,23,42,0.65);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:100002;
            padding:20px;
        ">

            <div style="
                background:white;
                width:100%;
                max-width:520px;
                border-radius:16px;
                padding:32px;
                text-align:center;
                box-shadow:0 25px 70px rgba(0,0,0,0.3);
            ">

                <div style="
                    width:64px;
                    height:64px;
                    margin:0 auto 18px;
                    border-radius:50%;
                    background:#dcfce7;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:32px;
                ">
                    ✓
                </div>


                <h2 style="
                    margin:0 0 10px;
                    color:#166534;
                ">
                    Application Submitted
                </h2>


                <p style="
                    color:#4b5563;
                    line-height:1.6;
                    margin-bottom:18px;
                ">
                    Your application has been submitted
                    successfully and saved to Sahaj Setu.
                </p>


                <div style="
                    background:#f8fafc;
                    border-radius:10px;
                    padding:16px;
                    margin-bottom:20px;
                ">

                    <div style="
                        color:#64748b;
                        font-size:12px;
                        margin-bottom:5px;
                    ">
                        APPLICATION ID
                    </div>

                    <strong style="
                        font-size:22px;
                        color:#1d4ed8;
                    ">
                        ${escapeHTML(
                            application.applicationId
                        )}
                    </strong>

                </div>


                <div style="
                    text-align:left;
                    background:#f8fafc;
                    padding:15px;
                    border-radius:10px;
                    margin-bottom:22px;
                    line-height:1.8;
                    color:#374151;
                ">

                    <div>
                        <strong>Approval:</strong>
                        ${escapeHTML(
                            application.approvalName
                        )}
                    </div>

                    <div>
                        <strong>Department:</strong>
                        ${escapeHTML(
                            application.department
                        )}
                    </div>

                    <div>
                        <strong>Status:</strong>
                        <span style="color:#166534;">
                            ${escapeHTML(
                                application.status
                            )}
                        </span>
                    </div>

                    <div>
                        <strong>Document:</strong>
                        ${
                            application.documents &&
                            application.documents.length > 0
                                ? escapeHTML(
                                    application.documents[0]
                                        .originalName
                                )
                                : "No document uploaded"
                        }
                    </div>

                </div>


                <button
                    id="successCloseBtn"
                    type="button"
                    style="
                        width:100%;
                        padding:13px;
                        border:none;
                        border-radius:8px;
                        background:#2563eb;
                        color:white;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    Back to Dashboard
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    document
        .getElementById("successCloseBtn")
        .addEventListener(
            "click",
            function () {

                modal.remove();

                loadMyApplications();

            }
        );

}


// =========================================================
// GET MY APPLICATIONS
// =========================================================

async function loadMyApplications() {

    const token =
        localStorage.getItem(
            "sahajSetuToken"
        );

    if (!token) return;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/applications/me`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            logoutUser();
            return;

        }


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                "Application loading failed:",
                data.message
            );

            return;

        }


        const applications =
            data.applications || [];


        console.log(
            "My Applications:",
            applications
        );


        // IMPORTANT
        window.myApplications =
            applications;


        // Render applications
        renderApplicationData(
            applications
        );


        // Load inspections
        loadInspectionsForApplications(
            applications
        );


    } catch (error) {

        console.error(
            "Load applications error:",
            error
        );

    }

}


// =========================================================
// RENDER APPLICATION DATA
// =========================================================

function renderApplicationData(
    applications
) {

    const statNumbers =
        document.querySelectorAll(
            ".stat-number"
        );


    if (statNumbers.length > 1) {

        statNumbers[1].textContent =
            applications.length;

    }


    const trackingCard =
        document.querySelector(
            ".tracking-card"
        );


    if (!trackingCard) return;


    // Remove ONLY dynamic application cards
    trackingCard
        .querySelectorAll(
            ".sahaj-application-item"
        )
        .forEach(
            item => item.remove()
        );


    // Remove previous inspection cards
    trackingCard
        .querySelectorAll(
            ".inspection-tracking-card"
        )
        .forEach(
            item => item.remove()
        );


    if (
        !applications ||
        applications.length === 0
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "sahaj-application-item";

        empty.style.cssText = `
            margin-top:15px;
            padding:25px;
            text-align:center;
            border:1px dashed #cbd5e1;
            border-radius:12px;
            background:#f8fafc;
            color:#64748b;
        `;

        empty.innerHTML = `

            <div style="font-size:32px;">
                📋
            </div>

            <h4 style="
                margin:8px 0 5px;
                color:#334155;
            ">
                No Applications Yet
            </h4>

            <p style="
                margin:0;
                font-size:13px;
            ">
                Your submitted applications will appear here.
            </p>

        `;

        trackingCard.appendChild(
            empty
        );

        return;

    }


    applications.forEach(
        function (application) {

            const item =
                document.createElement("div");

            item.className =
                "sahaj-application-item";

            item.style.cssText = `
                margin-top:15px;
                padding:18px;
                border:1px solid #e5e7eb;
                border-radius:12px;
                background:#fff;
            `;


            const submittedDate =
                application.submittedAt
                    ? new Date(
                        application.submittedAt
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "-";


            const status =
                application.status ||
                "Submitted";


            let statusClass =
                "status-review";


            if (status === "Approved") {
                statusClass =
                    "status-approved";
            }


            if (
                status === "Rejected" ||
                status === "Query Raised"
            ) {
                statusClass =
                    "status-query";
            }


            item.innerHTML = `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:15px;
                ">

                    <div>

                        <div style="
                            color:#2563eb;
                            font-size:11px;
                            font-weight:700;
                        ">
                            APPLICATION
                        </div>

                        <h4 style="
                            margin:5px 0;
                            color:#111827;
                            font-size:16px;
                        ">
                            ${escapeHTML(
                                application.approvalName
                            )}
                        </h4>

                        <div style="
                            color:#64748b;
                            font-size:12px;
                        ">
                            ${escapeHTML(
                                application.applicationId
                            )}
                        </div>

                    </div>


                    <span class="status ${statusClass}">
                        ${escapeHTML(status)}
                    </span>

                </div>


                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(150px,1fr));
                    gap:10px;
                    margin-top:15px;
                ">

                    ${applicationInfoBox(
                        "Department",
                        application.department
                    )}

                    ${applicationInfoBox(
                        "Submitted",
                        submittedDate
                    )}

                    ${applicationInfoBox(
                        "Location",
                        `${application.district || "-"}, ${application.state || "-"}`
                    )}

                </div>


                <div style="
                    margin-top:15px;
                    padding-top:12px;
                    border-top:1px solid #f1f5f9;
                    color:#64748b;
                    font-size:12px;
                ">

                    ${
                        application.documents &&
                        application.documents.length > 0
                            ? "📄 Document uploaded"
                            : "📄 No document uploaded"
                    }

                </div>

            `;


            trackingCard.appendChild(
                item
            );

        }
    );

}


// =========================================================
// APPLICATION INFO BOX
// =========================================================

function applicationInfoBox(
    label,
    value
) {

    return `

        <div style="
            background:#f8fafc;
            padding:10px;
            border-radius:8px;
        ">

            <small style="
                color:#94a3b8;
            ">
                ${escapeHTML(label)}
            </small>

            <div style="
                color:#334155;
                font-size:12px;
                font-weight:600;
                margin-top:4px;
            ">
                ${escapeHTML(value || "-")}
            </div>

        </div>

    `;

}


// =========================================================
// UPDATE APPLICATION STATS
// =========================================================

function updateApplicationStats() {

    loadMyApplications();

}


// =========================================================
// JOINT INSPECTION
// =========================================================

async function loadMyInspection(
    applicationId
) {

    const token =
        localStorage.getItem(
            "sahajSetuToken"
        );

    if (
        !token ||
        !applicationId
    ) {
        return null;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/inspections/${encodeURIComponent(applicationId)}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        // No inspection yet
        if (
            response.status === 404
        ) {
            return null;
        }


        if (!response.ok) {

            console.warn(
                "Inspection API:",
                data.message
            );

            return null;

        }


        return data.inspection || null;


    } catch (error) {

        console.error(
            "LOAD INSPECTION ERROR:",
            error
        );

        return null;

    }

}


// =========================================================
// LOAD INSPECTIONS FOR APPLICATIONS
// =========================================================

async function loadInspectionsForApplications(
    applications
) {

    if (
        !Array.isArray(applications) ||
        applications.length === 0
    ) {
        return;
    }


    for (
        const application
        of applications
    ) {

        if (
            !application.applicationId
        ) {
            continue;
        }


        const inspection =
            await loadMyInspection(
                application.applicationId
            );


        if (inspection) {

            renderInspectionCard(
                inspection,
                application.applicationId
            );

        }

    }

}


// =========================================================
// RENDER INSPECTION CARD
// =========================================================

function renderInspectionCard(
    inspection,
    applicationId
) {

    const trackingCard =
        document.querySelector(
            ".tracking-card"
        );

    if (!trackingCard) return;


    const oldCard =
        trackingCard.querySelector(
            `.inspection-tracking-card[data-application-id="${CSS.escape(applicationId)}"]`
        );

    if (oldCard) {
        oldCard.remove();
    }


    const card =
        document.createElement("div");

    card.className =
        "inspection-tracking-card";

    card.dataset.applicationId =
        applicationId;


    card.style.cssText = `
        margin-top:18px;
        padding:20px;
        border:1px solid #dbeafe;
        border-radius:14px;
        background:#f8fbff;
        box-shadow:0 5px 18px rgba(37,99,235,0.06);
    `;


    const departments =
        Array.isArray(
            inspection.departments
        )
            ? inspection.departments
            : [];


    const departmentHTML =
        departments.length
            ? departments
                .map(
                    department => `
                        <span style="
                            display:inline-block;
                            padding:6px 10px;
                            margin:3px;
                            background:#eff6ff;
                            border:1px solid #bfdbfe;
                            border-radius:20px;
                            font-size:12px;
                            color:#1d4ed8;
                            font-weight:600;
                        ">
                            ${escapeHTML(
                                department
                            )}
                        </span>
                    `
                )
                .join("")
            : "No departments assigned";


    const status =
        inspection.status ||
        "Coordination Required";


    const statusClass =
        getInspectionStatusClass(
            status
        );


    card.innerHTML = `

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:15px;
            margin-bottom:18px;
        ">

            <div>

                <div style="
                    font-size:12px;
                    color:#2563eb;
                    font-weight:700;
                    margin-bottom:5px;
                ">
                    🤝 JOINT INSPECTION
                </div>

                <h3 style="
                    margin:0;
                    color:#111827;
                    font-size:18px;
                ">
                    Coordinated Inspection
                </h3>

                <p style="
                    margin:5px 0 0;
                    color:#64748b;
                    font-size:12px;
                ">
                    Application ID:
                    <strong>
                        ${escapeHTML(
                            applicationId
                        )}
                    </strong>
                </p>

            </div>


            <span style="
                padding:7px 11px;
                border-radius:20px;
                font-size:11px;
                font-weight:700;
                white-space:nowrap;
                ${statusClass}
            ">
                ${escapeHTML(status)}
            </span>

        </div>


        <div style="
            display:grid;
            grid-template-columns:
                repeat(auto-fit,minmax(180px,1fr));
            gap:12px;
        ">

            ${inspectionInfoBox(
                "Departments",
                departmentHTML,
                true
            )}

            ${inspectionInfoBox(
                "Suggested Date",
                inspection.suggestedDate
                    ? formatInspectionDate(
                        inspection.suggestedDate
                    )
                    : "Not suggested"
            )}

            ${inspectionInfoBox(
                "Scheduled Date",
                inspection.scheduledDate
                    ? formatInspectionDate(
                        inspection.scheduledDate
                    )
                    : "Not scheduled"
            )}

            ${inspectionInfoBox(
                "Location",
                inspection.location ||
                "Not available"
            )}

        </div>


        <div style="
            margin-top:15px;
            padding:13px;
            background:white;
            border:1px solid #e5e7eb;
            border-radius:10px;
        ">

            <strong style="
                color:#475569;
                font-size:12px;
            ">
                Notes
            </strong>

            <p style="
                margin:6px 0 0;
                color:#64748b;
                font-size:13px;
                line-height:1.5;
            ">
                ${escapeHTML(
                    inspection.notes ||
                    "No additional notes."
                )}
            </p>

        </div>


        <div style="
            margin-top:16px;
        ">

            <div style="
                font-size:12px;
                font-weight:700;
                color:#475569;
                margin-bottom:10px;
            ">
                Inspection Progress
            </div>

            ${renderInspectionProgress(
                status
            )}

        </div>

    `;


    trackingCard.appendChild(
        card
    );

}


// =========================================================
// INSPECTION INFO BOX
// =========================================================

function inspectionInfoBox(
    label,
    value,
    rawHTML = false
) {

    return `

        <div style="
            background:white;
            padding:12px;
            border:1px solid #e5e7eb;
            border-radius:10px;
        ">

            <div style="
                color:#94a3b8;
                font-size:11px;
                margin-bottom:5px;
            ">
                ${escapeHTML(label)}
            </div>

            <div style="
                color:#334155;
                font-size:12px;
                font-weight:600;
                line-height:1.5;
            ">
                ${
                    rawHTML
                        ? value
                        : escapeHTML(value || "-")
                }
            </div>

        </div>

    `;

}


// =========================================================
// INSPECTION PROGRESS
// =========================================================

function renderInspectionProgress(
    status
) {

    const steps = [
        "Coordination Required",
        "Date Suggested",
        "Scheduled",
        "Completed"
    ];


    const labels = [
        "Coordination",
        "Date Suggested",
        "Scheduled",
        "Completed"
    ];


    const currentIndex =
        steps.indexOf(status);


    return `

        <div style="
            display:flex;
            align-items:flex-start;
            gap:5px;
            overflow-x:auto;
            padding-bottom:5px;
        ">

            ${steps.map(
                function (step, index) {

                    let background =
                        "#e5e7eb";

                    let color =
                        "#64748b";

                    let symbol =
                        index + 1;


                    if (
                        status !== "Cancelled" &&
                        index < currentIndex
                    ) {

                        background =
                            "#22c55e";

                        color =
                            "white";

                        symbol =
                            "✓";

                    }


                    if (
                        index === currentIndex &&
                        status !== "Cancelled"
                    ) {

                        background =
                            "#2563eb";

                        color =
                            "white";

                    }


                    if (
                        status === "Cancelled"
                    ) {

                        background =
                            "#dc2626";

                        color =
                            "white";

                    }


                    return `

                        <div style="
                            flex:1;
                            min-width:90px;
                            text-align:center;
                        ">

                            <div style="
                                width:28px;
                                height:28px;
                                margin:0 auto 6px;
                                border-radius:50%;
                                background:${background};
                                color:${color};
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                font-size:12px;
                                font-weight:700;
                            ">
                                ${symbol}
                            </div>

                            <div style="
                                font-size:10px;
                                color:#64748b;
                                font-weight:600;
                            ">
                                ${labels[index]}
                            </div>

                        </div>

                    `;

                }
            ).join("")}

        </div>


        ${
            status === "Cancelled"
                ? `
                    <div style="
                        margin-top:10px;
                        padding:10px;
                        border-radius:8px;
                        background:#fef2f2;
                        color:#b91c1c;
                        font-size:12px;
                    ">
                        ⚠ Inspection has been cancelled.
                    </div>
                `
                : ""
        }

    `;

}


// =========================================================
// INSPECTION STATUS CLASS
// =========================================================

function getInspectionStatusClass(
    status
) {

    switch (status) {

        case "Coordination Required":

            return `
                background:#fef3c7;
                color:#92400e;
            `;

        case "Date Suggested":

            return `
                background:#dbeafe;
                color:#1d4ed8;
            `;

        case "Scheduled":

            return `
                background:#dcfce7;
                color:#166534;
            `;

        case "Completed":

            return `
                background:#d1fae5;
                color:#065f46;
            `;

        case "Cancelled":

            return `
                background:#fee2e2;
                color:#991b1b;
            `;

        default:

            return `
                background:#f1f5f9;
                color:#475569;
            `;

    }

}


// =========================================================
// INSPECTION DATE FORMAT
// =========================================================

function formatInspectionDate(
    date
) {

    if (!date) {
        return "Not available";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "Not available";
    }


    return parsed.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =========================================================
// QUICK ACTIONS
// =========================================================

function setupQuickActions() {

    const buttons =
        document.querySelectorAll(
            ".action-button"
        );

    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const text =
                        button.innerText.trim();


                    if (
                        text.includes(
                            "Apply for Approval"
                        )
                    ) {

                        const section =
                            document.querySelector(
                                ".approvals-card"
                            );

                        if (section) {

                            section.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                        return;

                    }


                    if (
                        text.includes(
                            "Upload Documents"
                        )
                    ) {

                        showMessage(
                            "Please open an approval and click Apply Now to upload documents."
                        );

                        return;

                    }


                    if (
                        text.includes(
                            "Track Application"
                        )
                    ) {

                        const section =
                            document.querySelector(
                                ".tracking-card"
                            );

                        if (section) {

                            section.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                        loadMyApplications();

                        return;

                    }


                    if (
                        text.includes(
                            "View Notifications"
                        )
                    ) {

                        showMessage(
                            "Notifications section will be connected next."
                        );

                    }

                }
            );

        }
    );

}


// =========================================================
// QUESTION BUTTONS
// =========================================================

function setupQuestionButtons() {

    const buttons =
        document.querySelectorAll(
            ".question, .question-button"
        );

    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    askAssistant(
                        button.innerText.trim()
                    );

                }
            );

        }
    );

}


// =========================================================
// NOTIFICATIONS
// =========================================================

function setupNotifications() {

    const notification =
        document.querySelector(
            ".notification-icon, .bell"
        );

    if (!notification) return;

    notification.addEventListener(
        "click",
        function () {

            showMessage(
                "Notifications opened"
            );

        }
    );

}


// =========================================================
// LOGOUT
// =========================================================

function setupLogout() {

    const buttons =
        document.querySelectorAll(
            "#logout, .logout"
        );

    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    logoutUser();

                }
            );

        }
    );

}


function logoutUser() {

    localStorage.removeItem(
        "sahajSetuToken"
    );

    localStorage.removeItem(
        "sahajSetuUser"
    );

    window.location.href =
        "login.html";

}


// =========================================================
// AI ASSISTANT
// =========================================================

function askAssistant(
    question
) {

    showMessage(
        "AI Assistant: " +
        question
    );

}


// =========================================================
// MESSAGE
// =========================================================

function showMessage(
    message
) {

    alert(message);

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}