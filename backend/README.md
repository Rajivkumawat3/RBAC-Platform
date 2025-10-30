
# 🧩 Auto-Generated CRUD + RBAC Platform — **Backend**

This backend enables **dynamic schema creation**, **auto-CRUD APIs**, and **role-based access control (RBAC)** with authentication.

---

## 🚀 Features

* ⚙️ Dynamic Model & CRUD API Generation
* 🔐 JWT + Cookie Auth
* 👥 RBAC (Admin / Manager / Viewer / Custom)
* 🧱 Sequelize ORM (MySQL)
* 📦 Auto Route Loading
* 🗂️ JSON-based Model Storage

---

## ⚙️ Setup

### 🧩 Prerequisites

* Node.js ≥ 18
* MySQL or MariaDB

### 🧠 Environment

Create `backend/src/config/config.env`:

```env
PORT=3001
DB_NAME=autocrud
DB_USER=root
DB_PASS=<⚠️ your-database-password-here>
DB_HOST=localhost
DB_PORT=3306
COOKIE_EXPIRE=50
JWT_EXPIRE=50d
JWT_SECRET=rajivkumarkumawat1234567
```

### 🗃️ Database

```sql
CREATE DATABASE autocrud;
```

---

## ▶️ Run Server

```bash
cd backend
npm install
npm run dev
```

Server → `http://localhost:3001`
✅ MySQL connected
✅ Server running on port 3001

---

## 🔗 API Overview

| Route                   | Method         | Description            | Auth | Role       |
| ----------------------- | -------------- | ---------------------- | ---- | ---------- |
| `/auth/register`        | POST           | Register user          | ❌    | Public     |
| `/auth/login`           | POST           | Login                  | ❌    | Public     |
| `/auth/me`              | GET            | Get current user       | ✅    | All        |
| `/auth/logout`          | GET            | Logout                 | ✅    | All        |
| `/admin/users`          | GET            | All users              | ✅    | Admin      |
| `/admin/models/publish` | POST           | Publish new schema     | ✅    | Admin      |
| `/admin/models`         | GET            | Get all schemas        | ✅    | Admin      |
| `/api/<model>`          | GET/POST       | Read / Create record   | ✅    | Role-based |
| `/api/<model>/:id`      | GET/PUT/DELETE | Read / Update / Delete | ✅    | Role-based |

---

## 🧾 Sample Requests

### 👤 Register

`POST /auth/register`

```json
{ "name": "Rajiv", "email": "rajiv@gmail.com", "password": "123456", "role": "Admin" }
```

### 🔐 Login

`POST /auth/login`

```json
{ "email": "rajiv@gmail.com", "password": "123456" }
```

### 🏗️ Publish Schema (Admin)

`POST /admin/models/publish`

```json
{
  "name": "Employee",
  "fields": [
    { "name": "name", "type": "string", "required": true },
    { "name": "age", "type": "number" }
  ],
  "rbac": {
    "Admin": ["all"],
    "Manager": ["create", "read", "update"],
    "Viewer": ["read"]
  }
}
```

---

### 📄 CRUD Example

| Action | Method | URL               | Body                            |
| ------ | ------ | ----------------- | ------------------------------- |
| Create | POST   | `/api/employee`   | `{ "name": "John", "age": 25 }` |
| Read   | GET    | `/api/employee`   | —                               |
| Update | PUT    | `/api/employee/1` | `{ "age": 28 }`                 |
| Delete | DELETE | `/api/employee/1` | —                               |

---

## 🧱 Key Files

| File                    | Description                        |
| ----------------------- | ---------------------------------- |
| `authController.js`     | Handles register, login, auth      |
| `adminController.js`    | Manage schema publishing           |
| `genericController.js`  | Dynamic CRUD logic                 |
| `rbac.js`               | Role-permission checks             |
| `dynamicModelLoader.js` | Creates Sequelize models from JSON |
| `modelWriter.js`        | Persists schema definitions        |

---

## ✅ Summary

1. Register & Login (Admin)
2. Publish Schema → CRUD APIs auto-generated
3. Role-based access applied dynamically

---
