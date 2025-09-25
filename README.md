# Multi-Tenant SaaS Notes Application

A full-stack, multi-tenant "Notes" application built with the MERN stack (MongoDB, Express, React, Node.js) and deployed on Vercel. This application is designed to allow different companies (tenants) to manage their notes securely, with strict data isolation and role-based access control.

## ✨ Features

-   **Multi-Tenancy:** Secure data isolation between tenants using a shared schema with a `tenantId`.
-   **Authentication:** Secure JWT (JSON Web Token) based authentication.
-   **Role-Based Access Control:**
    -   **Admin:** Can manage users and upgrade subscription plans.
    -   **Member:** Can create, read, update, and delete notes.
-   **Subscription Gating:**
    -   **Free Plan:** Limited to a maximum of 3 notes.
    -   **Pro Plan:** Unlimited notes.
-   **Payments:** Subscription upgrades handled via Razorpay.
-   **Full CRUD API:** A complete API for creating, reading, updating, and deleting notes.

## 🛠️ Tech Stack

-   **Frontend:** React (with Vite), Chakra UI
-   **Backend:** Node.js, Express
-   **Database:** MongoDB (with Mongoose)
-   **Deployment:** Vercel

## Multi-Tenancy Approach

This application uses a **Shared Schema with a Tenant ID** approach.

This is a highly scalable and cost-effective pattern for SaaS applications. A `tenants` collection stores information about each tenant (e.g., Acme, Globex). The `users` and `notes` collections each have a `tenantId` field which references the `tenants` collection. All API database queries are systematically filtered by the `tenantId` of the authenticated user, ensuring a user from one company can never access data from another.

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   Node.js and npm installed.
-   A MongoDB Atlas account and your connection string.
-   A Razorpay account for API keys.

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd multi-tenant-notes-app
    ```

2.  **Backend Setup:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install

    # Create a .env file and add your secret keys
    # Use your own values
    cp .env.example .env
    ```
    Your `backend/.env` file should look like this:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    FRONTEND_URL=http://localhost:5173
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```
    ```bash
    # Seed the database with test accounts
    npm run seed

    # Start the backend server
    npm start
    ```
    The backend will be running at `http://localhost:5000`.

3.  **Frontend Setup:**
    ```bash
    # Navigate to the frontend directory from the root
    cd frontend

    # Install dependencies
    npm install

    # Create a .env.local file
    cp .env.local.example .env.local
    ```
    Your `frontend/.env.local` file should look like this:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```
    ```bash
    # Start the frontend development server
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

## 🔑 Test Accounts

The password for all accounts is: **`password`**

#### Acme Inc. (Pro Plan)
-   **Email**: `admin@acme.test`
    -   **Role**: Admin
-   **Email**: `user@acme.test`
    -   **Role**: Member

#### Globex Corp. (Free Plan)
-   **Email**: `admin@globex.test`
    -   **Role**: Admin
-   **Email**: `user@globex.test`
    -   **Role**: Member

## 📄 API Endpoints

-   `GET /health`: Health check for the server.
-   `POST /api/auth/login`: User login.
-   `GET, POST /api/notes`: Get all notes or create a new note.
-   `GET, PUT, DELETE /api/notes/:id`: Get, update, or delete a specific note.
-   `POST /api/payment/create-order`: Create a Razorpay order for subscription upgrade.
-   `POST /api/payment/verify`: Verify a successful Razorpay payment.