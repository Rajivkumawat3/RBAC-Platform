
# Auto-Generated CRUD + RBAC Platform — **Frontend Setup Guide**

This is the **frontend** of the *Auto-Generated CRUD + RBAC Platform*, built using **React + Vite**.
It provides a role-based dashboard for managing schemas, performing CRUD operations, and handling user roles dynamically.

---

## ⚙️ Setup Instructions

### Step 1 — Change Directory

```bash
cd frontend
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Start Frontend Server

```bash
npm run dev
```

The frontend runs on → **[http://localhost:5173](http://localhost:5173)**
Ensure your **backend** is already running at **[http://localhost:3001](http://localhost:3001)**

---

## 🚀 How It Works (User Flow)

### 1️⃣ **Register / Login**

* Open **`/register`** to create a new account.
* Choose a role → **Admin / Manager / Viewer / Custom**.
* If “Custom”, type a custom role name (e.g. *Teacher*).
* After registration, you’re redirected to the dashboard.
* Existing users can login via **`/login`**.

---

### 2️⃣ **Dashboard**

After login, the **Dashboard** shows different options depending on the user role.

#### Sidebar Buttons

| Button        | Role  | Description                        |
| --------------| ----- | ---------------------------------- |
| View Schemas  | All   | Browse existing models and records |
| Create Schema | Admin | Define and publish new schemas     |
| Manage Users  | Admin | Change user roles dynamically      |
| Logout        | All   | Clear session and logout           |

---

### 3️⃣ **Schema Management**

* Admin can publish schemas from **Create Schema**.
* Once created, all users can view these schemas in **View Schemas**.
* Each role sees only actions allowed by its **RBAC rules** (e.g., Viewer = read-only).

---

### 4️⃣ **Manage Users (Admin Only)**

* Admin can view all users from `/admin/users`.
* Update roles via dropdown (including custom roles).
* Updated roles reflect instantly across the app.

---

## 🧩 Tech Stack

| Tool                  | Purpose                    |
| --------------------- | -------------------------- |
| React + Vite          | Frontend framework         |
| React Router          | Navigation                 |
| Axios                 | API requests               |
| Tailwind / Custom CSS | UI Styling                 |
| JWT (Cookies)         | Authentication             |
| Dynamic RBAC          | Permission-based rendering |

---
