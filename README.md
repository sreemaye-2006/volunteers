# Volunteer Registration System - Naye Pankh Foundation

A full-stack MERN (MongoDB, Express, React, Node.js) web application for managing volunteer registrations, featuring a premium glassmorphic user interface, secure administrator authentication, dynamic SVG charting dashboards, filtering, search capabilities, and spreadsheet reports generation.

---

## 🚀 Features

- **Public Landing Page**: Introduce the mission, view live cumulative impact metrics, and learn about the benefits of volunteering.
- **Fluid Registration Form**: Multi-attribute volunteer registration collecting name, email, phone, age, custom skills selection, availability, commitment hours, and motivations.
- **Admin Authentication**: Secure JWT-based administrative login portal.
- **Admin Dashboard**:
  - **Quick Metrics**: Instantly view counts for pending, approved, and rejected applications.
  - **SVG Chart Panels**: Dynamic, responsive visual bar graphs displaying top skill categories and availability splits.
  - **Management Grid Table**: Search, filter by status or skills, examine motivation letters in full detail via profile modals, and approve, reject, or delete records.
  - **CSV & JSON Reports**: Download formatted reports of volunteer profiles instantly based on active table searches and filters.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Custom CSS (with premium typography and animations), Lucide React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Security**: JSON Web Tokens (JWT), BcryptJS password hashing

---

## ⚙️ Project Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine
- [MongoDB](https://www.mongodb.com/) running locally (port `27017`) or a MongoDB Atlas URI

### 1. Backend Configuration
1. Navigate to the `backend` directory:
   ```bash
   cd backend
