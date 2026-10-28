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
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI, JWT secret, and SMTP credentials
```

### 3. Seed admin user
```bash
npm run seed
```

### 4. Run development servers
```bash
npm run dev
```

This starts both the Express backend (port 5000) and React dev server (port 5173).

## Project Structure

```
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── server/          # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
└── package.json     # Root scripts
```

## Default Admin Login
- **Email**: admin@chittukurumbakam.com
- **Password**: changeme123

> ⚠️ Change these credentials immediately after first login.

## Environment Variables

See `server/.env.example` for all required configuration.
