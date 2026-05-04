# University Bus Management System

## Project Overview

The University Bus Management System is a full-stack web application designed to manage Kuwait University transportation services.

It supports three transportation services:

* **College Routes** – Transportation between colleges/campuses
* **Campus-Off Routes** – Fixed transportation between external KU campuses
* **Beeyout Service** – Home pickup/drop-off transportation for subscribed students

The system includes role-based dashboards for:

* **Admin**
* **Driver**
* **Student**

---

## Tech Stack

### Frontend

* React.js
* CSS / Custom Styling
* Axios / Fetch API

### Backend

* Node.js
* Express.js
* JWT Authentication
* Nodemailer (OTP Reset Password)

### Database

* MongoDB Atlas
* Mongoose ODM

---

## Features

### Authentication

* JWT Login/Register
* Role-Based Authorization
* Protected Routes Middleware
* OTP Password Reset via KU Email

### Admin Features

* Manage Users
* Manage Buses
* Manage Routes
* Assign Trips to Drivers
* Monitor Demand/Reports

### Driver Features

* View Assigned Trips
* Mark Arrived / Pickup Complete / Complete Trip

### Student Features

* View Trips
* Book Seats
* Check-In / Check-Out
* Beeyout Subscription
* Submit Reports

---

## Project Structure

```bash
project-root/
│
├── client/
│   └── bus-app/
│
├── server/
│
├── README.md
└── .env.example
```

---

## Installation Instructions

# 1. Clone Repository

```bash
git clone https://github.com/ShaikhahMuneer/ku-bus-management-system.git
cd ku-bus-management-system
```

---

# 2. Backend Setup

```bash
cd server
npm install
```

`.env` file inside `/server`:

i send it within the sumbition 

---

# 3. Seed Mock Data

```bash
npm run seed
```

This populates MongoDB Atlas with initial users, buses, routes, and trips.

---

# 4. Run Backend

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:3001
```

---

# 5. Frontend Setup

Open second terminal:

```bash
cd client/bus-app
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Test Accounts

### Admin

```text
Email: admin@ku.edu.kw
Password: 123456
```

### Driver

```text
Email: driver@ku.edu.kw
Password: 123456
```

### Student

```text
Email: student@ku.edu.kw
Password: 123456
```

---

## API Base URL

```text
http://localhost:3001/api
```

---

## Authentication Flow

1. User logs in/registers
2. Backend generates JWT token
3. Frontend stores token
4. Protected requests send:

```http
Authorization: Bearer <JWT_TOKEN>
```

5. Middleware validates token before access

---

## Important Notes for Instructor

### MongoDB Atlas

Project uses MongoDB Atlas cloud database.

### Environment Variables

A valid `.env` file is required to run the backend.

### Email OTP

Password reset requires Gmail App Password configured in `.env`.

---



## GitHub Repository

```text
https://github.com/ShaikhahMuneer/ku-bus-management-system.git
```

---



