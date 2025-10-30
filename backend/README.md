
---

# Auto-Generated CRUD + RBAC Platform — **Backend Setup Guide**
Built with Node.js, Express.js, Sequelize (MySQL), and JWT authentication,
this backend powers the Auto-Generated CRUD + RBAC Platform, enabling dynamic model creation, auto CRUD APIs, and role-based access control (RBAC).
---

## Setup Instructions

### Step 1 — Chnage Directory

```bash
cd backend
```


### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Configure Environment

A sample environment file is already included:
`/backend/src/config/config.env`

```env
PORT=3001
DB_NAME=autocrud
DB_USER=root
DB_PASS=            ← ⚠️ Add your MySQL root user password here
DB_HOST=localhost
DB_PORT=3306
COOKIE_EXPIRE=50
JWT_EXPIRE=50d
JWT_SECRET=rajivkumarkumawat1234567
```

**You only need to fill the `DB_PASS` field** with your local MySQL password.

---

### Step 4 — Setup Database

Open your **MySQL Workbench** (or terminal) and create the database manually:

```sql
CREATE DATABASE autocrud;
```

---

### Step 5 — Start Backend Server

```bash
npm run dev
```

If setup is correct, you’ll see:

```
MySQL Database connected
Server running on port 3001
```

Backend runs at → **[http://localhost:3001](http://localhost:3001)**

---

##  Test Backend APIs (via Postman)

### Base URL:

```
http://localhost:3001
```

---

### 1. Register a New User

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

### 2. Login User

**POST** `/auth/login`

```json
{
  "email": "rajiv@gmail.com",
  "password": "123456"
}
```

Response includes JWT cookie automatically.

---

### 3. Get Current Logged-in User

**GET** `/auth/me`

→ Add header:
`Cookie: token=<JWT_TOKEN>`

**Response:**

```json
{ "success": true, "user": { "name": "Rajiv", "role": "Admin" } }
```

---

### 4. Publish a New Schema (Admin Only)

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

> This automatically creates `/api/employee` CRUD routes.

---

### 5. CRUD Operations (Dynamic Model)

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
