# 💰 Finance Data Processing & Access Control Backend

## 📌 Overview

This project is a backend system for a finance dashboard that manages financial records, user roles, and access control. It provides APIs for handling transactions, enforcing role-based permissions, and generating summary-level analytics for dashboards.

The system is designed with a focus on clean architecture, scalability, and real-world backend practices.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure login and registration
* Role-based access control (RBAC)
* Prevent login for inactive users

### 👤 User & Role Management

* Create and manage users
* Assign roles: **Admin, Analyst, Viewer**
* Update user roles and status (active/inactive)
* Admin-only user management APIs

### 💰 Financial Records Management

* Create, update, delete financial records
* Fields:

  * Amount
  * Type (income / expense)
  * Category
  * Date
  * Notes
* Filtering support:

  * By type
  * By category
  * By date range

### 🔍 Search & Pagination

* Search records by category or notes
* Pagination support for large datasets

### 📊 Dashboard APIs

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Monthly trends
* Recent activity

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT
* **Other Tools:** bcryptjs, dotenv

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-link>
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

Server will run on:

```
http://localhost:3000
```

---

## 📡 API Endpoints

### 🔐 Auth Routes

* `POST /auth/register` → Register user
* `POST /auth/login` → Login user

---

### 👤 User Routes (Admin Only)

* `GET /users` → Get all users
* `PUT /users/:id` → Update user
* `DELETE /users/:id` → Delete user

---

### 💰 Record Routes

* `POST /records` → Create record (Admin)
* `GET /records` → Get records (Admin, Analyst)
* `PUT /records/:id` → Update record (Admin)
* `DELETE /records/:id` → Delete record (Admin)

#### 🔍 Query Parameters:

* `type=income/expense`
* `category=food`
* `startDate=YYYY-MM-DD`
* `endDate=YYYY-MM-DD`
* `search=keyword`
* `page=1`
* `limit=5`

---

### 📊 Dashboard Routes

* `GET /dashboard/summary`
* `GET /dashboard/categories`
* `GET /dashboard/trends`
* `GET /dashboard/recent`

---

## 🔑 Role Permissions

| Role    | Permissions                   |
| ------- | ----------------------------- |
| Admin   | Full access (users + records) |
| Analyst | View records + dashboard      |
| Viewer  | View dashboard only           |

---

## ⚠️ Validation & Error Handling

* Required field validation
* Duplicate user prevention
* Invalid credentials handling
* Proper HTTP status codes (400, 401, 403, 500)

---

## 📌 Assumptions

* Only admins can modify records and users
* Analysts can only view records and analytics
* Viewers have read-only dashboard access
* Soft delete is not implemented (hard delete used)

---

## ⭐ Additional Features Implemented

* JWT Authentication
* Pagination for records
* Search functionality
* Inactive user login restriction

---

## 📦 Future Improvements

* Soft delete for records
* Rate limiting
* API documentation (Swagger)
* Unit & integration tests

---

## 👨‍💻 Author

Rishika Thatipamula

---

## 📎 Notes

This project was built as part of a backend engineering assignment to demonstrate API design, access control, and data processing capabilities.
