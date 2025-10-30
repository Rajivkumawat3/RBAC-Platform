
---

# 🧩 Auto-Generated CRUD + RBAC Platform — **Backend Setup Guide**

This backend powers the **Auto-Generated CRUD + RBAC Platform**, which dynamically generates database schemas and CRUD APIs with built-in Role-Based Access Control (RBAC).

---

## ⚙️ 1️⃣ Setup Instructions

### 🧩 Step 1 — Clone the Repository

```bash
cd backend
```

---
## ✅ 3️⃣ Summary

| Step | Description                             |
| ---- | --------------------------------------- |
| 1️⃣  | Clone repo & install dependencies       |
| 2️⃣  | Add your MySQL password in `config.env` |
| 3️⃣  | Create database `autocrud`              |
| 4️⃣  | Run server with `npm run dev`           |
| 5️⃣  | Test all APIs via Postman               |

---

👨‍💻 **Author:** Rajiv Kumawat
🎓 IIIT Gwalior 💼 Full Stack Developer
🔗 GitHub: [gedev009](https://github.com/gedev009)

---

Would you like me to now make a **Frontend/README.md** in the *same format* (setup → run → test flow)?


### 🧩 Step 2 — Install Dependencies

```bash
npm install
```

---

### 🧩 Step 3 — Configure Environment

A sample environment file is already included:
`src/config/config.env`

```env
PORT=3001
DB_NAME=autocrud
DB_USER=root
DB_PASS=            ← ⚠️ Add your MySQL root password here in string
DB_HOST=localhost
DB_PORT=3306
COOKIE_EXPIRE=50
JWT_EXPIRE=50d
JWT_SECRET=rajivkumarkumawat1234567
```

👉 **You only need to fill the `DB_PASS` field** with your local MySQL password.

---

### 🧩 Step 4 — Setup Database

Open your **MySQL Workbench** (or terminal) and create the database manually:

```sql
CREATE DATABASE autocrud;
```

> Sequelize will automatically create tables when you start the backend.

---

### 🧩 Step 5 — Start Backend Server

```bash
npm run dev
```

If setup is correct, you’ll see:

```
✅ MySQL Database connected
✅ Server running on port 3001
```

Backend runs at → **[http://localhost:3001](http://localhost:3001)**

---

## 🧠 2️⃣ Test Backend APIs (via Postman)

### 🔹 Base URL:

```
http://localhost:3001
```

---

### 🧍 1. Register a New User

**POST** `/auth/register`
**Body (JSON):**

```json
{
  "name": "Rajiv",
  "email": "rajiv@gmail.com",
  "password": "123456",
  "role": "Admin"
}
```

**Response:**

```json
{ "success": true, "user": { "id": 1, "name": "Rajiv", "role": "Admin" } }
```

---

### 🔐 2. Login User

**POST** `/auth/login`

```json
{
  "email": "rajiv@gmail.com",
  "password": "123456"
}
```

Response includes JWT cookie automatically.

---

### 👤 3. Get Current Logged-in User

**GET** `/auth/me`

→ Add header:
`Cookie: token=<JWT_TOKEN>`

**Response:**

```json
{ "success": true, "user": { "name": "Rajiv", "role": "Admin" } }
```

---

### 🏗️ 4. Publish a New Schema (Admin Only)

**POST** `/admin/models/publish`
Add header:
`Authorization: Bearer <JWT_TOKEN>`

**Body:**

```json
{
  "name": "Employee",
  "fields": [
    { "name": "name", "type": "string", "required": true },
    { "name": "age", "type": "number" },
    { "name": "role", "type": "string" }
  ],
  "rbac": {
    "Admin": ["all"],
    "Manager": ["create", "read", "update"],
    "Viewer": ["read"]
  }
}
```

**Response:**

```json
{ "success": true, "message": "Model Employee published successfully" }
```

> 🎯 This automatically creates `/api/employee` CRUD routes.

---

### 📋 5. CRUD Operations (Dynamic Model)

| Action   | Method | URL               | Example Body                                   |
| -------- | ------ | ----------------- | ---------------------------------------------- |
| Create   | POST   | `/api/employee`   | `{ "name": "John", "age": 25, "role": "Dev" }` |
| Read All | GET    | `/api/employee`   | —                                              |
| Update   | PUT    | `/api/employee/1` | `{ "age": 26 }`                                |
| Delete   | DELETE | `/api/employee/1` | —                                              |

---

### 👥 6. Manage Users (Admin Only)

**GET** `/admin/users`
→ Lists all registered users.

---
