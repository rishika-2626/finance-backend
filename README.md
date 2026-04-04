# 💰 Finance Data Processing & Access Control Backend

## 📌 Overview

This project is a backend system for a finance dashboard that manages financial records, user roles, and access control. It provides APIs for handling transactions, enforcing role-based permissions, and generating summary-level analytics for dashboards.

The system is designed with a clean architecture and demonstrates real-world backend development practices.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure login and registration
* Role-based access control (Admin, Analyst, Viewer)
* Prevent login for inactive users

### 👤 User & Role Management

* Create and manage users
* Assign roles and update status
* Admin-only access for managing users

### 💰 Financial Records Management

* Create, update, delete financial records
* Fields include amount, type, category, date, and notes
* Filtering support (type, category, date range)

### 🔍 Search & Pagination

* Search records by category or notes
* Pagination for efficient data handling

### 📊 Dashboard APIs

* Total income, total expenses, net balance
* Category-wise breakdown
* Monthly trends
* Recent activity

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcryptjs

---

## ⚙️ Setup Instructions

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

## 📡 API Endpoints

### 🔐 Auth

* POST `/auth/register`
* POST `/auth/login`

### 👤 Users (Admin Only)

* GET `/users`
* PUT `/users/:id`
* DELETE `/users/:id`

### 💰 Records

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

### 📊 Dashboard

* GET `/dashboard/summary`
* GET `/dashboard/categories`
* GET `/dashboard/trends`
* GET `/dashboard/recent`

---

## 🔑 Role Permissions

| Role    | Permissions              |
| ------- | ------------------------ |
| Admin   | Full access              |
| Analyst | View records + dashboard |
| Viewer  | Dashboard only           |

---

## 🧠 Design Decisions

* JWT used for stateless authentication
* Role-based middleware ensures secure access
* MongoDB chosen for flexible schema design
* Dashboard aggregation handled on backend

---

## 🗃️ Data Modeling

* Users and records stored in MongoDB
* Records linked to users via `createdBy`
* Enum fields used for roles and transaction types

---

## 🛡️ Validation & Error Handling

The backend includes proper validation and error handling to ensure reliability:

* Input validation for required fields (e.g., username, email, password, amount)
* Prevention of duplicate users during registration
* Meaningful error messages for invalid operations
* Proper HTTP status codes used:

  * `400` – Bad Request
  * `401` – Unauthorized
  * `403` – Forbidden
  * `500` – Internal Server Error
* Role-based access control prevents unauthorized actions
* Inactive users are restricted from logging in

---

## 🗃️ Data Persistence

The application uses **MongoDB**, a document-based NoSQL database, for data storage.

* Mongoose is used for schema definition and data modeling
* User and financial records are stored as separate collections
* Relationships are maintained using references (e.g., `createdBy`)
* This approach allows flexible and scalable data management

---
## 📦 Postman Collection

The API can be easily tested using the included Postman collection.

### 📁 Location

```
postman/finance-backend.postman_collection.json
```

### 🚀 How to Use

1. Open Postman
2. Click **Import**
3. Select the collection file from the `postman/` folder
4. Run the requests directly

### 🔐 Authentication

For protected routes, add the JWT token in headers:

```
Authorization: Bearer YOUR_TOKEN
```

Alternatively, you can set a Postman environment variable:

```
token = YOUR_JWT_TOKEN
```

and use:

```
Authorization: Bearer {{token}}
```

This allows seamless testing of all authenticated endpoints.

---

## ⭐ Additional Features

* Pagination for efficient data handling
* Search functionality using regex queries
* Role-based access control
* JWT Authentication
* Inactive user login restriction
* Rate limiting for API protection

---

## 🧪 Testing

All APIs were tested using Postman with JWT-based authentication and role-based access verification.

---

## 📸 API Screenshots

### 🔐 Register

![Register](./screenshots/Register.png)

---

### 🔑 Login

![Login](./screenshots/Login.png)

---

### 👤 Get All Users

![Get Users](./screenshots/Get-all-users.png)

---

### 🚫 Forbidden Access

![Forbidden](./screenshots/Get-users-(forbidden).png)

---

### 💰 Create / Manage Records

![Records](./screenshots/Get-all-records.png)

---

### ✏️ Update User Status (Active → Inactive)

![Update User](./screenshots/Update-user.png)

---

### 🔍 Search

![Search](./screenshots/Search.png)

---

### 📄 Pagination

![Pagination](./screenshots/Pagination.png)

---

### 🔍 Filter

![Filter](./screenshots/filter.png)

---

### 📊 Dashboard Summary ⭐

![Dashboard](./screenshots/Dashboard-Summary.png)

---

### 📊 Dashboard Trends

![Trends](./screenshots/dashboard-trends.png)

---

## 📎 Notes

This project was built as part of a backend engineering assignment to demonstrate API design, access control, and data processing capabilities.

---

## 👨‍💻 Author

Rishika Thatipamula
