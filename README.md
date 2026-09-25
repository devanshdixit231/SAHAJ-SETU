# 🚀 Sahaj Setu

> **Every approval, one intelligent journey.**

**Sahaj Setu** is a unified, AI-assisted platform designed to simplify the journey of entrepreneurs through industrial approvals, application tracking, risk assessment, delay prediction, and coordinated inspections.

Developed for **Smart India Hackathon 2026** under the problem statement:

> **Efficiency in streamlining industrial approvals, compliance processes, and access to government support services.**

---

## 🧩 The Problem

Industrial businesses often need approvals from multiple government departments. The existing journey can involve:

- Multiple departments and portals
- Repeated document submission
- Limited visibility into application status
- Lack of inter-department coordination
- Unclear processing timelines
- Separate inspection processes
- Difficulty identifying which approvals are required

### Our Goal

Sahaj Setu brings this journey into a **single, transparent and intelligent platform**.

---

## 💡 Our Solution

Sahaj Setu provides a centralized workflow where an entrepreneur can:

1. Create an account
2. Set up a business profile
3. Discover relevant approvals
4. Get approval recommendations
5. View approval details
6. Submit an application
7. Upload required documents
8. Receive a unique application ID
9. Track the application
10. View risk and delay insights
11. Coordinate joint inspections

Government officers can use the officer dashboard to review applications, assess risk, identify possible delays, update application status and coordinate inspections.

---

## ✨ Key Features

### 🔐 Authentication & User Management
- User registration and login
- Officer login
- JWT-based authentication
- Role-based access control
- Protected API routes

### 🏢 Business Profile
- Business information management
- Business type and industry
- Investment details
- State and district
- Business address
- MongoDB persistence

### 💡 Approval Discovery
- Know Your Approvals
- Approval recommendations
- Approval details
- Department information
- Business-relevant approval information

### 📝 Application Management
- Application submission
- Automatic application ID generation
- MongoDB storage
- Applicant application retrieval
- Application tracking
- Application status management

### 📎 Document Management
- Multipart document upload
- Uploaded document metadata
- Document availability considered during risk assessment

### 👨‍💼 Officer Dashboard
- Application overview
- Search and filtering
- Application review
- Status updates
- Risk assessment
- Delay prediction
- Joint inspection management

### ⚠️ Risk Scoring
The current prototype uses a **rule-based risk scoring engine** for demonstration.

Factors include:
- Document availability
- Investment category
- Industry type
- Application status
- Business address availability

Outputs:
- Risk score
- Risk level
- Risk factors
- Recommendation

### ⏱️ Delay Prediction
The current prototype uses a **rule-based demonstrative intelligence layer**, not a production ML model.

It estimates:
- Expected processing time
- Minimum/maximum processing range
- Delay risk
- Predicted delay
- Reasons contributing to delay

### 🤝 Joint Inspection Coordination
Officers can:
- Create joint inspections
- Add multiple departments
- Suggest inspection dates
- Add inspection locations
- Add coordination notes
- Schedule inspections
- Update inspection status
- Monitor inspection progress

Applicants can view inspection tracking information from their dashboard.

---

## 🔄 Application Workflow

```text
User Registration / Login
          ↓
Business Profile
          ↓
Know Your Approvals
          ↓
Approval Recommendation
          ↓
Approval Details
          ↓
Application Form
          ↓
Document Upload
          ↓
Application ID Generated
          ↓
MongoDB Storage
          ↓
Application Tracking
          ↓
┌───────────────────────────────┐
│      Officer Dashboard        │
└───────────────────────────────┘
          ↓
Risk Assessment
          ↓
Delay Prediction
          ↓
Joint Inspection Coordination
          ↓
Application Status Update
```

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| APIs | REST APIs |
| Authentication | JWT, bcryptjs |
| Database | MongoDB, Mongoose |
| File Upload | Multer |
| Development | VS Code, Git, GitHub |
| API Testing | Thunder Client / API testing tools |

---

## 📁 Project Structure

```text
SAHAJ-SETU/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── app.js
│   ├── dashboard.html
│   ├── login.html
│   ├── login.js
│   ├── login.css
│   ├── register.html
│   ├── register.js
│   ├── register.css
│   ├── officer-dashboard.html
│   ├── officer-dashboard.js
│   └── officer-dashboard.css
│
├── SAHAJ_SETU_Officer_Dashboard_Proxy_Data.csv
└── README.md
```

---

## 🔌 Main API Modules

### Authentication
```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Business
```text
GET /api/business/me
PUT /api/business/me
```

### Applications
```text
POST  /api/applications
GET   /api/applications/me
GET   /api/applications/officer/all
GET   /api/applications/:applicationId
PATCH /api/applications/:applicationId/status
GET   /api/applications/:applicationId/risk
GET   /api/applications/:applicationId/delay
```

### Joint Inspections
```text
POST  /api/inspections
GET   /api/inspections/officer/all
GET   /api/inspections/:applicationId
PATCH /api/inspections/:applicationId/schedule
PATCH /api/inspections/:applicationId/status
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/devanshdixit231/SAHAJ-SETU.git
cd SAHAJ-SETU
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `Backend/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sahaj_setu
JWT_SECRET=your_secure_jwt_secret
```

### 4. Start the backend

Development mode:

```bash
npm run dev
```

Or:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Run the frontend

Open the required HTML files from the `Frontend` folder or serve the frontend through a local development server.

---

## 📊 Officer Dashboard & Power BI

The officer-side analytics layer is designed around:

- Application volume
- Application status
- Risk distribution
- Department-wise workload
- Processing time
- Delay trends
- Inspection coordination
- High-risk application identification

## 📚 Additional Data & References

A shared folder containing supporting material, additional data, references, research material and prototype resources is available here:

**[SAHAJ Setu — Additional Data & References](https://drive.google.com/drive/folders/1tROH7fBH_9YNkaG61yUzGEUp705kR-Gi?usp=drive_link)**

### Useful Research / Reference Sources

- **National Single Window System (NSWS)**  
  https://www.nsws.gov.in/

- **Maharashtra Single Window / MAITRI ecosystem**  
  https://maitri.mahaonline.gov.in/

- **Department for Promotion of Industry and Internal Trade (DPIIT)**  
  https://dpiit.gov.in/

- **World Bank — Doing Business / Business Regulation research archive**  
  https://www.worldbank.org/en/programs/business-enabling-environment

These sources provide background for understanding business regulation, approvals, investment facilitation and digital government-service workflows.

---

## 🧠 AI / Intelligence Layer

The current prototype intentionally separates **demonstration intelligence** from production-grade ML.

### Current Prototype

```text
Application Data
      ↓
Rule-Based Risk Scoring
      ↓
Risk Level + Factors
```

and

```text
Application Data
      ↓
Rule-Based Delay Estimation
      ↓
Expected Processing Time
      ↓
Delay Risk + Reasons
```

### Future ML Extension

The architecture can later be extended with historical application data for:

- ML-based delay prediction
- Risk classification
- Processing-time forecasting
- Department workload prediction
- Approval bottleneck detection

This keeps the current prototype transparent while leaving a clear path toward data-driven intelligence.

---

## 🎯 Expected Impact

Sahaj Setu aims to improve the industrial approval journey by:

- Reducing fragmented approval workflows
- Improving application visibility
- Helping officers prioritize applications
- Identifying potential delays earlier
- Supporting inter-department coordination
- Providing a centralized experience for entrepreneurs

---

## 🛡️ Prototype Disclaimer

Sahaj Setu is a **Smart India Hackathon 2026 prototype**.

Risk scoring and delay prediction in the current implementation are demonstrative rule-based systems. The proxy dataset is synthetic and intended only for development, dashboard design and demonstration.

The prototype should not be interpreted as a production government decision-making system.

---

## 👥 Team SAHAJ

**Project:** Sahaj Setu  
**Event:** Smart India Hackathon 2026  
**Problem Area:** Industrial approvals, compliance and government support services

---

## 📌 Repository

**GitHub:**  
https://github.com/devanshdixit231/SAHAJ-SETU

**Additional Data & References:**  
https://drive.google.com/drive/folders/1tROH7fBH_9YNkaG61yUzGEUp705kR-Gi?usp=drive_link


---

## 📄 License

This project is developed as a prototype for **Smart India Hackathon 2026**.
