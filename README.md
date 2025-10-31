

# Auto-Generated CRUD + RBAC Platform

This project implements a **low-code CRUD + RBAC system** built with **Node.js**, **Express**, **React**, and **MySQL**, allowing users to dynamically define database models, auto-generate CRUD APIs, and manage access through **Role-Based Access Control (RBAC)**.

It’s designed to eliminate repetitive backend code and make internal tool development faster, secure, and visual.

---

## ⚙️ Project Structure

```
RBAC-Platform
├── backend     → Node.js + Express + Sequelize (MySQL)
├── frontend    → React + Vite
└── README.md      → Root setup + screenshots
```

---

## Setup Instructions

### 🖥️ 1️⃣ Backend Setup

To set up and run the backend, follow:
**[`./backend/README.md`](./backend/README.md)**

---

### 💻 2️⃣ Frontend Setup

To set up and run the frontend, follow:
**[`./frontend/README.md`](./frontend/README.md)**

---

## Tech Stack

* **Frontend:** React.js (Vite)
* **Backend:** Node.js + Express.js
* **Database:** MySQL (Sequelize ORM)
* **Authentication:** JWT + Cookies
* **RBAC:** Role-based access control (Admin / Manager / Viewer)

---

## Application Flow

Below is the step-by-step flow demonstrating the complete system journey.

---

### **1. Login Page**

Users can log in using email and password.
If you don’t have an account, move to the signup page.

<img width="1914" height="943" alt="Login Page" src="https://github.com/user-attachments/assets/c9b80f8b-acc2-4f75-ade6-523546ed38eb" />

---

### **2. Signup Page**

New users register with a role (Admin / Manager / Viewer).
Admins have full privileges; others get limited permissions.

<img width="1914" height="943" alt="Signup Page" src="https://github.com/user-attachments/assets/79f2019c-407c-46c9-84d2-ceb3fd71d4aa" />

---

### **3. Admin Dashboard — Create Schema**

Admins can create new schemas dynamically (like *Employee*, *Product*, etc.)
Each schema includes field definitions and per-role RBAC rules. 
Let's continue this example....

<img width="1914" height="888" alt="Admin Create Schema" src="https://github.com/user-attachments/assets/983f1e42-7976-4052-9e1a-283f37b3379b" />

---

### **4. View Schema & Role-Based Access**

All users can view schemas.
Actions (Create, Update, Delete) are shown dynamically based on the user’s role and schema permissions.

<img width="1914" height="943" alt="View Schema with RBAC" src="https://github.com/user-attachments/assets/157647a6-107a-498b-9612-3cb3f7771b65" />

---

### **5. Create Records in Schema**

Admins or Managers (as allowed) can add new records to the selected schema.

<img width="1914" height="888" alt="Create Record" src="https://github.com/user-attachments/assets/916af69c-663c-45b9-8acb-7943b202f0f2" />

---

### **6. Manage Users (Admin Only)**

Admins can view all registered users and change their roles directly from the dashboard.

<img width="1914" height="888" alt="Manage Users" src="https://github.com/user-attachments/assets/9f95f8bf-a270-4105-8c97-8d8124994bca" />

---

### **7. Manager Dashboard Example**

Managers can view and modify records but cannot create new schemas.

<img width="1914" height="911" alt="Manager Dashboard" src="https://github.com/user-attachments/assets/b97f780a-f351-4a6f-86c8-7b0834768c31" />

---

### **8. Viewer Dashboard Example**

Viewers can only see schema data — no write, edit, or delete permissions.

<img width="1914" height="911" alt="Viewer Dashboard" src="https://github.com/user-attachments/assets/282565c9-6ea6-4103-b295-f00aec527407" />

---
