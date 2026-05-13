# Multi-Tenant Finance Data Processing & Access Control Backend

## Overview

This project is a **multi-tenant financial management backend API** built using Node.js, Express.js, and MongoDB.

The system enables multiple organizations to securely manage financial records with:

* strict tenant isolation
* role-based access control (RBAC)
* JWT authentication
* audit logging
* dashboard analytics
* Docker containerization

Each user belongs to a specific organization, and all data access is restricted within that organization to ensure complete isolation between tenants.

The project demonstrates real-world backend engineering concepts including authentication, authorization, scalable API design, middleware architecture, audit logging, and service-layer based backend structure.

---

## Features

### Multi-Tenant Architecture

* Support for multiple organizations (tenants)
* Each user belongs to a specific organization
* Strict organization-level data isolation
* Shared database with organization-scoped queries
* Secure tenant separation enforced throughout the backend

---

### Authentication & Authorization

* JWT-based authentication
* Secure login and registration
* Role-based access control (Admin, Analyst, Viewer)
* Prevent login for inactive users
* Password hashing using bcryptjs

---

### Role-Based Access Control (RBAC)

| Role    | Permissions                   |
| ------- | ----------------------------- |
| Admin   | Full access (CRUD operations) |
| Analyst | Create + view records         |
| Viewer  | View-only access              |

---

### User Management

Admins can:

* View organization users
* Update user roles
* Activate/deactivate users
* Delete users

Additional protections:

* Prevent self-deletion
* Prevent self-role modification
* Organization-scoped user management

---

### Financial Records Management

* Create, update, delete financial records
* Fields include amount, type, category, date, and notes
* Records are scoped to organizations
* Filtering support (type, category, date range)

---

### Search & Pagination

* Search records using regex (category, notes)
* Pagination for efficient large dataset handling

---

### Dashboard APIs

* Total income, expenses, net balance
* Category-wise breakdown
* Monthly trends
* Recent activity

---

### Audit Logging

The system maintains audit logs for critical actions.

* Tracks all record-related actions:

  * CREATE
  * UPDATE
  * DELETE
* Logs include:

  * action
  * acting user
  * target user
  * record
  * organization
  * timestamp

---

## Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcryptjs

---

## Authentication & Security

* JSON Web Token
* bcryptjs
* express-rate-limit

---

## Dev Tools

* Docker
* Docker Compose
* Nodemon
* Postman

---

## Project Structure

```
finance-backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── recordController.js
│   │   └── dashboardController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Organization.js
│   │   ├── Record.js
│   │   └── AuditLog.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── recordRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   └── services/
│       └── dashboardService.js
│
├── Dockerfile
├── docker-compose.yml
├── server.js
├── package.json
└── .env
```
---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/rishika-2626/finance-backend.git
cd finance-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## Docker Support 

The project is fully containerized using Docker.

### Docker Features

* Node.js containerization
* Docker Compose support
* Environment variable support
* Production-ready setup

## API Endpoints

### Auth

* POST `/auth/register`
* POST `/auth/login`

### Users (Admin Only)

* GET `/users`
* PUT `/users/:id`
* DELETE `/users/:id`

### Records

* POST `/records`
* GET `/records`
* PUT `/records/:id`
* DELETE `/records/:id`

Query params:

* `type`
* `category`
* `search`
* `page`
* `limit`

---

## Design Decisions

* Multi-tenant architecture implemented using organization-based scoping
* Data isolation enforced at query level using `organization` field
* JWT used for stateless authentication with organization context
* Role-based middleware ensures secure access control
* MongoDB chosen for flexible schema design
* Audit logging implemented for traceability of actions

---

## Data Modeling

### Collections:

#### Users

* username
* email
* password
* role
* status
* organization
* timestamps

#### Organizations

* name
* timestamps

#### Records

* amount
* type
* category
* date
* notes
* createdBy
* organization
* timestamps

#### AuditLogs

* action
* user
* targetUser
* record
* organization
* timestamps

---

## Security & Validation

* Input validation for required fields
* Duplicate user prevention
* JWT authentication for protected routes
* Role-based access enforcement
* Organization-based data isolation
* Proper HTTP status codes:

  * `400` – Bad Request
  * `401` – Unauthorized
  * `403` – Forbidden
  * `404` – Not Found
  * `500` – Internal Server Error

---

## Testing

All APIs were tested using Postman with:

* JWT authentication
* Role-based access control
* Multi-tenant data isolation verification

---

## Postman Collection

The API can be tested using the provided Postman collection.

---

### Location

```
postman/Multi_Tenant_Finance_Backend.postman_collection.json
```
---

### Authentication

```
Authorization: Bearer YOUR_TOKEN
```

Or use:

```
Authorization: Bearer {{token}}
```

---

## Key Highlights

* Multi-tenant architecture
* Strict tenant isolation
* JWT authentication
* Role-Based Access Control (RBAC)
* Audit logging
* Dashboard analytics
* Docker containerization
* Modular scalable backend architecture

---

## Future Improvements

Planned enhancements:
* Email verification
* OAuth authentication (Google/GitHub)
* React frontend dashboard
* Organization invitation system
* Task management module
* CSV import/export
* File uploads
* Cloud deployment
* CI/CD pipelines
* Automated testing

---

## Notes

This project was built to demonstrate backend engineering concepts including API design, access control, authentication, authorization, data processing, and scalable backend architecture

---

## Author

Rishika Thatipamula
