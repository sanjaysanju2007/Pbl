# 🌈 Chittukurumbakam Play School

A fully responsive, professional MERN stack website for Chittukurumbakam Play School — an early-childhood education institution offering Playgroup, Nursery, LKG, and UKG programs.

## Tech Stack

- **MongoDB** + Mongoose — Database & ODM
- **Express.js** — REST API backend
- **React.js** (Vite) — Frontend SPA
- **Node.js** — Server runtime
- **JWT** — Admin authentication
- **Nodemailer** — Email notifications

## Quick Start

### 1. Install dependencies
```bash
npm run install-all
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your JWT secret and SMTP credentials
```

### 3. Configure Firebase Firestore (Cloud Database)
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create/select your project.
2. Under **Build**, select **Firestore Database** and click **Create database**.
3. Go to **Project Settings** (gear icon) -> **Service accounts** tab.
4. Click **Generate new private key** and download the JSON file.
5. Rename the downloaded file to `serviceAccountKey.json` and place it in the `backend/` folder (or copy from `backend/serviceAccountKey.json.example`).
6. Seed the initial admin user and data into Firestore:
```bash
npm run seed:firebase
```

### 4. Run development servers
```bash
npm run dev
```

This starts both the Express backend (port 5000) and React dev server (port 5173).

## Project Structure

```
├── frontend/        # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── backend/         # Express REST API
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── server.js
├── database/        # Database models, connection, and seeds
│   ├── models/
│   ├── seeds/
│   ├── fallback/
│   └── connection.js
├── storage/         # Stateful user-uploaded files
│   └── uploads/
│       ├── documents/
│       └── gallery/
└── package.json     # Root scripts & orchestration
```

## Default Admin Login
- **Email**: admin@chittukurumbakam.com
- **Password**: changeme123

> ⚠️ Change these credentials immediately after first login.

## Environment Variables

See `backend/.env.example` for all required configuration.
