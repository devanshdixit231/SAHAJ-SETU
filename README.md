🚀 Sahaj Setu

Every approval, one intelligent journey.

Sahaj Setu is a unified, AI-assisted platform designed to simplify the
journey of entrepreneurs through industrial approvals, application
tracking, risk assessment, delay prediction, and coordinated
inspections.

The project is being developed for Smart India Hackathon 2026 under
the problem statement:

"Efficiency in streamlining industrial approvals, compliance
processes, and access to government support services."

🎯 Problem Statement

Entrepreneurs and businesses often need to obtain multiple approvals
from different government departments. The process can involve:

Multiple departments and portals

Repeated document submission

Limited visibility into application status

Lack of coordination between departments

Unclear processing timelines

Separate inspection processes

Difficulty identifying approval requirements

Sahaj Setu aims to bring this journey into a single, transparent and
intelligent platform.

💡 Our Solution

Sahaj Setu provides a centralized workflow where an entrepreneur can:

Create an account

Set up a business profile

Discover relevant approvals

Get approval recommendations

View approval details

Submit an application

Upload required documents

Receive a unique application ID

Track the application

Get risk and delay insights

Coordinate joint inspections

Government officers can review applications, assess risk, predict
possible delays, update application status, and manage joint inspections
from an officer dashboard.

✨ Current Features

🔐 Authentication & User Management

User registration

User login

Officer login

JWT-based authentication

Role-based access control

Protected API routes

🏢 Business Profile

Business information management

Business type

Industry

Investment details

State and district

Business address

MongoDB persistence

💡 Approval Discovery

Know Your Approvals interface

Approval recommendations

Approval details

Department information

Approval type and business relevance

📝 Application Management

Application form

Application API

Automatic application ID generation

Application storage in MongoDB

Applicant application retrieval

Application tracking

Application status management

📎 Document Upload

Actual document upload support

Multipart form-data handling

Uploaded document metadata stored with applications

👨‍💼 Officer Dashboard

Officer-specific dashboard

Application overview

Application search and filtering

Application review

Application status updates

Risk assessment

Delay prediction

Joint inspection management

⚠️ Risk Scoring

Sahaj Setu currently uses a rule-based risk scoring engine for
demonstration purposes.

It considers factors such as: - Document availability - Investment
category - Industry type - Application status - Business address
availability

The system generates: - Risk score - Risk level - Risk factors -
Recommendation

⏱️ Delay Prediction

A rule-based delay prediction service currently estimates: - Expected
processing time - Minimum/maximum processing range - Delay risk -
Predicted delay - Reasons contributing to delay

The current implementation is a demonstrative intelligence layer and
is not presented as a production ML model.

🤝 Joint Inspection Coordination

Officers can: - Create a joint inspection - Add multiple departments -
Suggest an inspection date - Add inspection location - Add coordination
notes - Schedule inspections - Update inspection status - Monitor
inspection progress

Applicants can see inspection tracking information from their
application dashboard.

🏗️ Technology Stack

Frontend

HTML5

CSS3

JavaScript

Responsive dashboard UI

Backend

Node.js

Express.js

REST APIs

JWT Authentication

Multer for document uploads

bcryptjs for password hashing

Database

MongoDB

Mongoose

Development Tools

VS Code

Git

GitHub

Thunder Client / API testing tools

MongoDB

📁 Project Structure

NSWS/
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── businessController.js
│   │   └── inspectionController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── officerMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Application.js
│   │   ├── Business.js
│   │   ├── Inspection.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── businessRoutes.js
│   │   └── inspectionRoutes.js
│   │
│   ├── services/
│   │   ├── delayPredictionService.js
│   │   └── riskScoringService.js
│   │
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── Frontend/
    ├── app.js
    ├── dashboard.html
    ├── login.html
    ├── login.js
    ├── login.css
    ├── register.html
    ├── register.js
    ├── register.css
    ├── style.css
    ├── officer-dashboard.html
    ├── officer-dashboard.js
    └── officer-dashboard.css

🔄 Application Workflow

User Registration/Login
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
 ┌───────────────────────────┐
 │     Officer Dashboard     │
 └───────────────────────────┘
          ↓
     Risk Assessment
          ↓
     Delay Prediction
          ↓
 Joint Inspection Coordination
          ↓
   Application Status Update

🔌 Main API Modules

Authentication

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Business

GET /api/business/me
PUT /api/business/me

Applications

POST  /api/applications
GET   /api/applications/me
GET   /api/applications/officer/all
GET   /api/applications/:applicationId
PATCH /api/applications/:applicationId/status
GET   /api/applications/:applicationId/risk
GET   /api/applications/:applicationId/delay

Joint Inspections

POST  /api/inspections
GET   /api/inspections/officer/all
GET   /api/inspections/:applicationId
PATCH /api/inspections/:applicationId/schedule
PATCH /api/inspections/:applicationId/status

⚙️ Local Setup

1. Clone the repository

git clone <YOUR-GITHUB-REPOSITORY-URL>
cd NSWS

2. Install backend dependencies

cd Backend
npm install

3. Configure environment variables

Create a .env file inside Backend/:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sahaj_setu
JWT_SECRET=your_secure_jwt_secret

4. Start the backend

For development:

npm run dev

Or:

node server.js

The backend runs on:

http://localhost:5000

5. Run the frontend

Open the Frontend folder and launch the HTML pages using a local
development server such as VS Code Live Server.

🔒 Environment & Security

Do not commit sensitive credentials to GitHub.

Add the following to .gitignore:

node_modules/
.env
uploads/

The repository should contain an example environment file if required:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

📊 Current Development Status

Module                                Status

🎨 Login/Register UI                  ✅
🔐 JWT Authentication                 ✅
👤 User/Officer Roles                 ✅
🏢 Business Profile                   ✅
🗄️ MongoDB Connection                 ✅
💡 Know Your Approvals                ✅
📋 Approval Recommendation            ✅
📄 Approval Details                   ✅
📝 Application Form                   ✅
🚀 Application API                    ✅
🆔 Application ID Generation          ✅
📊 Application Storage & Retrieval    ✅
📎 Document Upload                    ✅
🖥️ Real Application API Integration   ✅
📊 Real Application Tracking          ✅
👨‍💼 Officer Dashboard                  ✅
⚠️ Risk Scoring                       ✅
⏱️ Delay Prediction                   ✅
🤝 Joint Inspection Coordination      ✅
🔔 Real Notifications                 ⏳
🤖 AI Assistant                       ⏳
🧾 Compliance / Trust Score           ⏳
🏛️ Government-Service Integration     ⏳
🧪 Final Testing & Polishing          ⏳

🚀 Future Roadmap

Phase 1 --- Intelligence

AI conversational assistant

Smarter approval recommendations

ML-based risk scoring

ML-based delay prediction

Document intelligence and validation

Phase 2 --- Compliance

Compliance tracking

Compliance reminders

Business compliance history

Portable compliance/trust score

Phase 3 --- Government Integration

Integration with government services and APIs

Department-level workflow integration

Real-time application status synchronization

Notifications and alerts

Phase 4 --- Production Readiness

Advanced security

Audit logs

Role and permission management

Performance optimization

Automated testing

Deployment

Monitoring and analytics

🎯 Vision

Sahaj Setu aims to make the industrial approval journey:

Simple → Transparent → Predictable → Coordinated

Instead of entrepreneurs navigating disconnected approval processes,
Sahaj Setu brings the journey together through a unified platform with
intelligent assistance.

Every approval, one intelligent journey.

👥 Team

TEAM SAHAJ

Built for Smart India Hackathon 2026.

📌 Project Status

🚧 Active Development

This repository contains the current working implementation of Sahaj
Setu. Features marked as pending are planned for subsequent development
phases.
done
