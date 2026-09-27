# 🚧 FixMyRoad

**FixMyRoad** is a full-stack civic issue reporting and management platform that enables users to report road-related problems, attach images, share their location, and track the progress of their complaints.

The platform provides a complete complaint lifecycle — from reporting a road issue to its resolution or rejection — with **email notifications automatically sent to the relevant users and administrators whenever a complaint is added, resolved, or rejected**.

---

## ✨ Features

### 👤 User Management

* User registration and authentication
* Session-based authentication
* MongoDB-backed session storage
* Protected complaint operations
* Secure access to user-specific complaint information

### 🚧 Complaint Management

* Submit road-related complaints
* Upload images with complaints
* View reported complaints
* Update complaints
* Delete complaints
* Follow up on complaints
* Reject complaints
* Resolve complaints
* Add resolution information and images
* Track the complaint throughout its lifecycle

### 📍 GPS & Interactive Maps

* Capture GPS coordinates for reported road problems
* Associate complaints with their geographical location
* Display reported road problems on an interactive map
* Visualize complaints based on their location
* Help users identify where reported road issues are located

### 📷 Image Uploads

* Upload images while submitting complaints
* Process multipart file uploads using Multer
* Associate images with complaints
* Support resolution images when resolving/updating complaints

### 📧 Email Notifications

The system automatically sends email notifications when important complaint events occur.

Emails are sent when:

* A new complaint is added
* A complaint is resolved
* A complaint is rejected

Notifications are sent to the relevant **user and administrator**, keeping both sides informed about changes to the complaint.

Email functionality is implemented using **Nodemailer**.

### 📩 Contact Us

* Dedicated contact/support functionality
* Backend API for handling contact requests

### 🔐 Backend Security

* Environment-based configuration
* Session-based authentication
* Protected complaint routes
* CORS configuration
* Server-side session management

---

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Sessions

* Express Session
* connect-mongodb-session

### File Uploads

* Multer

### Email

* Nodemailer

### Other Tools

* dotenv
* CORS

---

## 🏗️ Project Structure

```text
FixMyRoad/
│
├── client/                 # React frontend
│
├── controller/             # Application/business logic
│
├── model/                  # MongoDB/Mongoose models
│
├── router/                 # API routes
│
├── utils/                  # Utility/helper functions
│
├── media/                  # Uploaded complaint media
│
├── index.js                # Backend entry point
├── package.json            # Backend dependencies and scripts
├── package-lock.json
└── README.md
```

---

## 🔄 Application Workflow

```text
                         ┌─────────────────┐
                         │      User       │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    React        │
                         │    Frontend     │
                         └────────┬────────┘
                                  │
                                  │ HTTP Requests
                                  ▼
                         ┌─────────────────┐
                         │ Express Backend │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       ┌──────────────┐   ┌──────────────┐   ┌────────────────┐
       │ Authentication│   │  Complaint   │   │ GPS / Location│
       │ & Sessions   │   │  Management  │   │    Services    │
       └──────────────┘   └───────┬──────┘   └────────────────┘
                                  │
                     ┌────────────┼────────────┐
                     │            │            │
                     ▼            ▼            ▼
              ┌────────────┐ ┌──────────┐ ┌──────────────┐
              │  MongoDB   │ │  Media   │ │    Email     │
              │  Database  │ │  Uploads │ │ Notifications│
              └────────────┘ └──────────┘ └──────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Interactive Map │
                         │ Reported Issues │
                         └─────────────────┘
```

---

## 🔄 Complaint Lifecycle

FixMyRoad follows a structured complaint lifecycle:

```text
                    ┌─────────────────┐
                    │  Report Problem │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Upload Image +  │
                    │ GPS Location    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Store Complaint │
                    │    in MongoDB   │
                    └────────┬────────┘
                             │
                    📧 Email Notification
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Complaint Processing │
                  └──────────┬───────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
          ┌─────────────┐         ┌─────────────┐
          │   Resolve   │         │   Reject    │
          └──────┬──────┘         └──────┬──────┘
                 │                       │
                 ▼                       ▼
          📧 Email User + Admin   📧 Email User + Admin
```

---

## 📍 Location-Based Reporting

Each complaint can be associated with a geographical location.

This allows FixMyRoad to provide a visual representation of reported road problems through an interactive map.

```text
Road Issue
    │
    ├── Description
    ├── Image
    ├── Complaint Status
    └── GPS Coordinates
             │
             ▼
      Interactive Map
             │
             ▼
       Reported Issue
```

This makes it easier to understand the geographical distribution of reported road problems.

---

## 📧 Email Notification System

FixMyRoad uses **Nodemailer** to send automated email notifications for important complaint events.

### New Complaint

When a complaint is submitted:

```text
User submits complaint
        ↓
Complaint saved
        ↓
Email sent
        ├── User
        └── Admin
```

### Complaint Resolved

When a complaint is resolved:

```text
Complaint resolved
        ↓
Database updated
        ↓
Email notification
        ├── User
        └── Admin
```

### Complaint Rejected

When a complaint is rejected:

```text
Complaint rejected
        ↓
Database updated
        ↓
Email notification
        ├── User
        └── Admin
```

This provides real-time communication around the complaint lifecycle without requiring users to constantly check the application.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* MongoDB or MongoDB Atlas
* npm

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/nsufiyan/FixMyRoad.git
```

Navigate into the project:

```bash
cd FixMyRoad
```

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5000
DB_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

> Add any additional environment variables required by your local configuration.

**Never commit `.env` files, passwords, API keys, database credentials, or other secrets to GitHub.**

---

## ▶️ Running the Application

### Start the Backend

From the project root:

```bash
npm start
```

The backend will run on the configured port.

### Start the Frontend

Open another terminal:

```bash
cd client
npm start
```

The React development server will start the frontend application.

---

## 🔌 API Overview

The backend provides separate routes for different application modules.

### User Routes

```text
/user
```

Responsible for user-related functionality such as registration and authentication.

### Complaint Routes

```text
/complaint
```

Complaint functionality includes:

| Method    | Endpoint                   | Purpose                       |
| --------- | -------------------------- | ----------------------------- |
| POST      | `/complaint/add-complaint` | Create a complaint            |
| GET       | `/complaint/...`           | Retrieve complaints           |
| PUT/PATCH | `/complaint/...`           | Update a complaint            |
| DELETE    | `/complaint/...`           | Delete a complaint            |
| POST      | `/complaint/...`           | Follow up / reject complaints |

> Refer to the route implementation for the exact endpoint parameters and request bodies.

### Contact Us

```text
/contactus
```

Provides contact/support functionality.

---

## 🗄️ Database

FixMyRoad uses **MongoDB** as its primary database and **Mongoose** for database interaction.

The database stores application information such as:

* User information
* Complaint information
* Complaint status
* Complaint location
* Complaint images/references
* Resolution information
* Session information

---

## 🔒 Authentication

FixMyRoad uses session-based authentication.

The session architecture is based on:

```text
Express Session
       │
       ▼
MongoDB Session Store
       │
       ▼
Authenticated User
```

Protected routes validate the user's session before allowing access to protected complaint operations.

---

## 📸 Complaint Media

Users can attach images to their complaints.

The backend uses **Multer** to process multipart/form-data uploads.

Images can be associated with:

* Original complaint reports
* Complaint updates
* Resolution information

---

## 📧 Notification Architecture

Complaint events trigger email notifications through Nodemailer.

```text
             Complaint Event
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼
        Added    Resolved   Rejected
          │         │         │
          └─────────┼─────────┘
                    ▼
              Nodemailer
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       User Email          Admin Email
```

This keeps users and administrators informed throughout the complaint lifecycle.

---

## 🎯 Project Objective

The primary objective of FixMyRoad is to create a centralized digital platform for reporting, locating, tracking, and managing road-related problems.

Instead of relying entirely on manual reporting, users can:

```text
Identify Road Problem
        ↓
Capture Image
        ↓
Capture GPS Location
        ↓
Submit Complaint
        ↓
Complaint Stored
        ↓
Email Notification
        ↓
Complaint Processing
        ↓
       ┌───────────────┐
       │               │
       ▼               ▼
    Resolved         Rejected
       │               │
       └───────┬───────┘
               ▼
        Email Notification
```

The combination of **location-based reporting, image uploads, complaint management, authentication, and automated email notifications** provides a complete workflow for handling road-related complaints.

---

## 🔮 Future Improvements

Potential future enhancements include:

* 👨‍💼 Dedicated administrator dashboard
* 🔐 Role-based authorization
* 📊 Complaint analytics and reporting
* 🔔 Push notifications
* 🤖 AI-based pothole and road-damage detection
* ☁️ Cloud-based image storage
* 🧪 Automated unit and API testing
* 🚀 Production deployment
* 📱 Dedicated mobile application
* 🔎 Advanced complaint search and filtering
* ⭐ Complaint priority/severity classification
* 📈 Advanced administrative analytics

---

## 🧪 Testing

Automated testing can be expanded using tools such as:

* Jest
* Supertest
* React Testing Library

Important areas for testing include:

* User authentication
* Complaint creation
* Complaint updates
* Complaint resolution/rejection
* Image uploads
* GPS/location handling
* Email notifications
* Authorization
* API error handling

---

## 🔐 Security Considerations

Before deploying the application to production, additional security hardening should be considered:

* Validate uploaded file types
* Restrict upload sizes
* Generate secure unique filenames
* Hash passwords using a strong password-hashing algorithm
* Validate API request data
* Add rate limiting
* Use HTTPS
* Secure session cookies
* Keep credentials in environment variables
* Implement role-based authorization
* Add automated security testing

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.

2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.

4. Commit your changes:

```bash
git commit -m "Add your feature"
```

5. Push your branch:

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

---

## 📄 License

This project is currently available for educational and development purposes.

If you intend to distribute or modify the project under an open-source license, add an appropriate `LICENSE` file to the repository.

---

## 👨‍💻 Author

**SN Sufiyan**

GitHub: [@nsufiyan](https://github.com/nsufiyan)

---

## ⭐ Support

If you find **FixMyRoad** useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 🚧 FixMyRoad

> **Report road problems. Locate them. Track them. Resolve them.**

A full-stack civic issue reporting platform built to connect **users, road problems, locations, and administrators** through a single digital workflow.
