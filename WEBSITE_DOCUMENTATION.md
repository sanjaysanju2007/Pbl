# 🌈 Chittukurumbakam Play School — Website & Architecture Documentation

> **Official Comprehensive Technical & Functional Documentation**  
> **Application Version**: 1.0.0  
> **Theme**: "Sunny Beginnings" (Warm, Trustworthy, Early-Childhood Focus)  
> **Technology Stack**: React 19, Vite 8, Node.js, Express 4.21, Cloud Firestore / MongoDB, JWT, Nodemailer  

---

## 1. Executive Summary & Project Purpose

**Chittukurumbakam Play School** is an early-childhood educational institution offering foundational programs for **Playgroup, Nursery, LKG, and UKG** in Tiruppur, Tamil Nadu. 

The web application is a full-stack digital campus designed to serve two primary audiences:
1. **Parents & Prospective Families**: Provides an immersive, trustworthy showcase of the school's child-centric philosophy, campus safety protocols, curriculum, photo/video galleries, a 4-step online admissions application wizard with document upload, and real-time application status tracking.
2. **School Administrators & Admissions Officers**: A secure, protected administrative dashboard for managing admissions, reviewing uploaded documents, tracking status history, exporting CSV rosters, scheduling events, broadcasting announcements, responding to parental enquiries, and updating website content.

---

## 2. Design System: "Sunny Beginnings"

The user interface follows the **"Sunny Beginnings"** design system—a warm, welcoming, high-contrast, parent-centric design specifically crafted to inspire confidence in young parents.

### 2.1 Design Tokens & Palette

Centralized in [`frontend/src/index.css`](file:///d:/projects/Pbl/frontend/src/index.css):

| CSS Variable | Hex Code | Visual Role |
| :--- | :--- | :--- |
| `--color-primary` | `#1F7AB8` | Sky Blue: Primary action buttons, active navigation states, hyperlinks |
| `--color-primary-light` | `#DCEFFB` | Soft Sky Blue: Hover states, badge backgrounds, pill highlights |
| `--color-accent` | `#FFC93C` | Sunny Yellow: Attention highlights, badges, feature icons, secondary CTAs |
| `--color-accent-soft` | `#FFF3C4` | Warm Cream Yellow: Section backgrounds, table headers, footer background |
| `--color-bg` | `#FFFBF0` | Warm Cream: Global page background (softer than sterile pure white) |
| `--color-surface` | `#FFFFFF` | Pure White: Elevated cards, modal dialogs, input containers |
| `--color-text` | `#1F3A5F` | Deep Navy: Headings, body copy, and high-contrast text on yellow *(WCAG AA compliant)* |
| `--color-text-muted` | `#5B6B80` | Slate Navy: Secondary descriptions, timestamps, input placeholders |
| `--color-border` | `#F1E6C8` | Soft Sand: Card borders, dividers, form field boundaries |
| `--color-success` | `#3FB984` | Mint Green: Approved badges, completed wizard steps, success alerts |
| `--color-warning` | `#F5A623` | Warm Amber: Under review tags, pending notices |
| `--color-error` | `#E5484D` | Soft Crimson: Validation errors, rejected statuses |

### 2.2 Typography & Sizing
* **Headings**: `"Nunito", sans-serif` (weights: 700, 800, 900) via Google Fonts — rounded, approachable, playful yet professional.
* **Body Text**: `"Inter", sans-serif` (weights: 400, 500, 600) via Google Fonts — clean, highly legible on mobile devices.
* **Base Size**: 16px minimum with a relaxed `1.6` line-height for effortless parent readability.

### 2.3 Shapes, Shadows & Transitions
* **Border Radii**: 12px for form inputs and buttons (minimum touch target height of 48px); 20px for cards, modals, and preview containers.
* **Box Shadows**: Soft gentle elevation (`0 4px 16px rgba(31, 58, 95, 0.08)`).
* **Animations**: Subtle micro-interactions powered by `framer-motion` with `prefers-reduced-motion` compliance.

---

## 3. System Architecture & Tech Stack

The application is structured into four clearly separated tiers: **Frontend (`frontend/`)**, **Backend API (`backend/`)**, **Database Persistence (`backend/database/`)**, and **Stateful File Storage (`storage/`)**.

```
                           +-------------------------------------+
                           |            USER BROWSER             |
                           +-------------------------------------+
                                      |               |
                         Public Pages |               | Admin Portal
                                      v               v
                           +-------------------------------------+
                           |     React 19 + Vite Frontend        |
                           |   (SPA, Framer Motion, Axios)       |
                           +-------------------------------------+
                                              |
                                HTTP API calls (/api/*)
                                Reverse Proxy (:5173 -> :5000)
                                              v
                           +-------------------------------------+
                           |      Express 4.21 REST Backend      |
                           |  (Rate Limit, Helmet, JWT, Multer)  |
                           +-------------------------------------+
                                 /            |            \
                                /             |             \
                               v              v              v
                  +----------------+  +---------------+  +----------------+
                  | Cloud Firestore|  | Local Storage |  | Stateful Files |
                  |  (Primary DB)  |  |  (Admissions  |  |  (PDFs, JPGs)  |
                  |  via Firebase  |  |  JSON Backup) |  |   /storage/    |
                  +----------------+  +---------------+  +----------------+
```

### 3.1 Stack Summary
* **Client Framework**: React 19.2 + Vite 8.2 Single Page Application (SPA).
* **Routing**: React Router v7.18 (`react-router-dom`).
* **Icons & Animation**: React Icons v5.7 (`react-icons/fi`), Framer Motion v13.1.
* **Server Runtime**: Node.js (v18+) with Express 4.21.
* **Security Middleware**: Helmet 7.1, Express Rate Limit 7.4 (100 req / 15 min), CORS 2.8.
* **Authentication**: Stateless JSON Web Tokens (`jsonwebtoken` v9) with Bcrypt password hashing (`bcryptjs` v2.4).
* **File Uploads**: Multer 1.4 for parsing multipart form submissions with file type validation and a 10MB limit.
* **Email Service**: Nodemailer 6.9 with customized HTML templates and non-blocking background dispatch.
* **Database & Persistence Options**:
  1. **Google Cloud Firestore** *(Primary Cloud NoSQL)*: Firebase Admin SDK v13 integration with collection repositories.
  2. **MongoDB / MongoDB Atlas** *(Mongoose 8.6)*: Full schema definitions with auto-reconnect timers.
  3. **Local JSON Fallback** *(Resilient Store)*: In-memory store + disk persistence (`admissions.json`) ensuring admissions never crash even if cloud databases are offline.

---

## 4. Feature Breakdown & Page Directory

### 4.1 Public Information Pages (16 Pages)

| Page | Route | Description & Highlights |
| :--- | :--- | :--- |
| **Home** | `/` | Hero section with background video showcase, value proposition stats strip, program highlights, safety badges, parent testimonials carousel, and direct admission CTA. |
| **About Us** | `/about` | Institutional background, early-childhood philosophy, teaching methodologies, and faculty credentials. |
| **Vision & Mission** | `/vision-mission` | Educational values, long-term goals, and foundational child-centric principles. |
| **Principal's Message** | `/principal-message` | Welcome letter from school leadership with photo and signature. |
| **Programs** | `/programs` | Detailed breakdown of Playgroup (1.5-2.5y), Nursery (2.5-3.5y), LKG (3.5-4.5y), and UKG (4.5-5.5y). Includes age criteria, timings, and daily routines. |
| **Curriculum** | `/curriculum` | Montessori-inspired play-way pedagogy, sensory learning, phonics, numeracy, fine/gross motor skill development. |
| **Facilities** | `/facilities` | Campus infrastructure: child-safe indoor play zones, outdoor play gym, sensory activity corners, audiovisual smart room, sanitized restrooms. |
| **Safety & Hygiene** | `/safety` | Child safety protocols, 24/7 CCTV surveillance, biometric pickup authorizations, background-checked staff, first-aid and pediatric tie-ups. |
| **Photo & Video Gallery** | `/gallery` | Filterable media gallery with category tabs (Campus, Celebrations, Daily Activities, Sports Day) and image lightbox. |
| **Events & Celebrations** | `/events` | Interactive timeline and calendar of upcoming school events, festivals, field trips, and parent-teacher meetings. |
| **Testimonials** | `/testimonials` | Verified feedback and quotes from alumni and currently enrolled families with star ratings. |
| **FAQs** | `/faqs` | Accordion FAQ organized by category (Admissions, Academics, Transportation, Safety, Health & Nutrition). |
| **Announcements** | `/announcements` | Real-time bulletin board for school notices, holiday circulars, and emergency alerts. |
| **Contact Us** | `/contact` | Google Map integration, phone numbers, email addresses, office hours, and interactive callback request form. |
| **General Enquiry** | `/enquiry` | Quick enquiry form for parents requesting a campus visit, brochure, or fee schedule. |
| **Page Not Found** | `*` | Custom 404 page with helpful navigation buttons and brand artwork. |

---

### 4.2 Multi-Step Admission Wizard (`/admission`)

The online admission form is a 4-step progressive wizard with live validation and file upload:

```
[ Step 1: Student Details ]
   ├── Full Child Name, Date of Birth, Gender, Blood Group
   └── Target Program (Playgroup, Nursery, LKG, UKG) & Academic Year
         │
         v
[ Step 2: Parent / Guardian Details ]
   ├── Father's Name, Mother's Name, Primary Contact Person
   ├── Mobile Phone, WhatsApp Number, Guardian Email Address
   └── Residential Address, City, Pincode
         │
         v
[ Step 3: Medical & Background Information ]
   ├── Known Allergies / Medical Conditions
   ├── Previous School / Playgroup Attended
   └── Preferred Contact Mode & Special Requests
         │
         v
[ Step 4: Document Upload & Parental Consent ]
   ├── Drag-and-drop file upload (Birth Certificate, Vaccination Chart, Photo)
   ├── Supported formats: PDF, JPEG, JPG, PNG (up to 10MB)
   └── Terms & Conditions consent checkbox
         │
         v
[ Submission Complete Screen ]
   ├── Generates Unique Reference Number: CKP-YYYY-XXXXX
   ├── Sends Instant Email Acknowledgment to Parent
   ├── Dispatches Admin Alert to Principal's Inbox
   └── Provides Direct Link to Track Application Status
```

---

### 4.3 Unified Portal (`/login`)

A dual-tab portal that handles both parent application tracking and administrative authentication:

1. **Tab 1 — Track Application Status (For Parents)**:
   - Inputs: Application Reference Number (e.g. `CKP-2026-48192`) + registered Guardian Phone or Email.
   - Outputs: Real-time visual timeline showing current status (`submitted`, `under_review`, `shortlisted`, `approved`, `rejected`), status history notes, and interview schedule instructions.
2. **Tab 2 — Admin & Staff Sign-In (For Staff)**:
   - Inputs: Administrator Email and Password.
   - Features: Password visibility toggle, error notifications, JWT issuance, and redirection to the `/admin/dashboard`.
   - Default credentials: `admin@chittukurumbakam.com` / `changeme123`.

---

### 4.4 Administrator Control Panel (`/admin/*`)

Protected under an `AdminLayout` wrapper with `AuthContext` validation and auto-logout on token expiration:

* **Executive Dashboard (`/admin/dashboard`)**:
  - Live metric counters: Total Applications, Submitted, Under Review, Shortlisted, Approved, Rejected, New Enquiries.
  - Recent Applications table with rapid status pills.
  - Quick-action shortcuts (Export CSV, Add Announcement, Post Event).
* **Admissions Manager (`/admin/admissions`)**:
  - Filterable by academic year, target program, and review status.
  - Search bar matching student name, parent name, application number, or phone.
  - Review drawer: Inspect student details, download uploaded documents, append internal administrative notes, and advance status.
  - **CSV Export**: One-click download of the complete applicant roster with all contact details.
* **Enquiry Management (`/admin/enquiries`)**:
  - Roster of parent enquiries, status updating (`new`, `contacted`, `resolved`), and follow-up notes.
* **Announcement Manager (`/admin/announcements`)**:
  - Create, publish, unpublish, and delete circulars and banner alerts.
* **Event Scheduler (`/admin/events`)**:
  - Manage school calendar dates, locations, and descriptions.
* **Gallery Manager (`/admin/gallery`)**:
  - Upload campus pictures or embed video showcase links with categorization.
* **Testimonials Manager (`/admin/testimonials`)**:
  - Review, approve, or hide parent reviews before they appear on the public website.
* **FAQ Manager (`/admin/faqs`)**:
  - Manage parent questions and reorder display sequence.

---

## 5. REST API Reference

All backend routes are prefixed with `/api`. Protected routes require a valid JWT passed in the HTTP header:  
`Authorization: Bearer <token>`

### 5.1 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates admin/staff and returns JWT token |
| `GET` | `/api/auth/me` | Protected | Returns profile of currently authenticated user |
| `POST` | `/api/auth/register` | Superadmin | Registers a new staff or admin user |

### 5.2 Admissions (`/api/admissions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admissions` | Public | Submits multi-step admission application with files |
| `POST/GET` | `/api/admissions/track` | Public | Tracks status using reference number & phone/email |
| `GET` | `/api/admissions` | Protected | Retrieves paginated and filtered admission records |
| `GET` | `/api/admissions/:id` | Protected | Gets single admission record with all documents |
| `PATCH`| `/api/admissions/:id` | Protected | Updates application status & admin notes |
| `GET` | `/api/admissions/export/csv` | Protected | Generates and streams CSV file of all admissions |
| `DELETE`| `/api/admissions/:id` | Protected | Deletes an admission application |

### 5.3 Enquiries (`/api/enquiries`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/enquiries` | Public | Submits a public parent enquiry |
| `GET` | `/api/enquiries` | Protected | Retrieves list of all enquiries with pagination |
| `PATCH`| `/api/enquiries/:id` | Protected | Updates enquiry follow-up status and notes |
| `DELETE`| `/api/enquiries/:id` | Protected | Removes an enquiry record |

### 5.4 Content, Events, & Media
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/announcements` | Public | Lists active published announcements |
| `POST` | `/api/announcements` | Protected | Creates a new announcement |
| `GET` | `/api/events` | Public | Lists upcoming published events |
| `POST` | `/api/events` | Protected | Adds an event to the school calendar |
| `GET` | `/api/gallery` | Public | Retrieves gallery photos and videos |
| `POST` | `/api/gallery` | Protected | Uploads a new photo/video to the gallery |
| `GET` | `/api/faqs` | Public | Retrieves categorized FAQs |
| `GET` | `/api/testimonials` | Public | Lists approved parent testimonials |
| `GET` | `/api/health` | Public | Returns server health status and timestamp |

---

## 6. Data Models & Schemas

### 6.1 Admission Schema (`admissions`)
```javascript
{
  applicationNumber: String,     // Unique ID: CKP-2026-48192
  childName: String,             // Required student name
  dateOfBirth: Date,             // Required birth date
  gender: String,                // Male / Female / Other
  program: String,               // Playgroup / Nursery / LKG / UKG
  academicYear: String,          // e.g. "2026-2027"
  preferredStartDate: Date,      // Preferred enrollment date
  bloodGroup: String,            // A+, B+, O+, AB+, etc.
  allergies: String,             // Medical conditions or "None"
  previousSchool: String,        // Past preschool or "None"
  primaryContactName: String,    // Guardian full name
  relationship: String,          // Father / Mother / Guardian
  guardianPhone: String,         // Primary mobile number
  guardianEmail: String,         // Notification email address
  alternatePhone: String,        // Backup phone
  address: String,               // Street address
  city: String,                  // City (Default: Tiruppur)
  pincode: String,               // Postal code
  preferredContactMethod: String,// Phone Call / WhatsApp / Email
  documents: [{                  // Uploaded files
    name: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: Date
  }],
  status: String,                // submitted | under_review | shortlisted | approved | rejected | waitlisted
  adminNotes: String,            // Internal notes from admissions staff
  statusHistory: [{              // Complete audit log of all status changes
    status: String,
    note: String,
    changedAt: Date,
    changedBy: String
  }],
  notificationStatus: {          // Email delivery tracking
    parentAcknowledged: Boolean,
    adminNotified: Boolean,
    lastAttemptAt: Date,
    deliveryError: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 6.2 Administrator User Schema (`adminUsers`)
```javascript
{
  name: String,                  // Administrator full name
  email: String,                 // Unique login email
  password: String,              // Bcrypt hashed password (10 rounds)
  role: String,                  // "superadmin" | "staff"
  isActive: Boolean,             // Account active status
  lastLogin: Date,
  createdAt: Date
}
```

---

## 7. Security & Compliance Measures

1. **Password Encryption**: All administrator credentials are protected via `bcryptjs` with salt work factor of 10. Passwords are never saved or returned in plaintext.
2. **Stateless Authorization**: JWT tokens are signed using a secret key and expire after 7 days (`JWT_EXPIRE`). Stored in `localStorage` and attached via Axios request interceptors.
3. **HTTP Header Hardening**: Helmet middleware is configured with permissive Cross-Origin Resource Policies to securely serve uploaded assets while preventing cross-site scripting and MIME sniffing.
4. **Rate Limiting**: Express Rate Limit throttles public endpoints to 100 requests per 15-minute window per IP to defend against brute-force attacks and denial-of-service attempts.
5. **File Upload Security**: Multer storage filters incoming files by MIME type (only PDFs, JPEGs, and PNGs for documents; only images and MP4s for gallery) and enforces a strict 10MB ceiling.
6. **Credential Protection**: Private service accounts (`serviceAccountKey.json`) and local `.env` files are explicitly excluded in `.gitignore` to prevent secret leakage.

---

## 8. Directory Map

```
Pbl/
├── package.json                      # Root npm scripts & workspace orchestrator
├── README.md                         # Quick-start documentation
├── WEBSITE_DOCUMENTATION.md          # Comprehensive technical guide (this document)
├── .gitignore                        # Git exclusion rules
│
├── frontend/                         # React 19 + Vite 8 Client
│   ├── index.html                    # Main HTML container with Google Fonts
│   ├── vite.config.js                # Vite config & API reverse proxy
│   ├── package.json                  # Frontend dependencies
│   ├── public/                       # Static public assets
│   │   ├── favicon.svg, icons.svg    # Vector icons
│   │   ├── logo.jpg                  # School crest
│   │   ├── images/hero/              # Campus and classroom photos
│   │   └── videos/                   # Classroom showcase background videos
│   └── src/
│       ├── main.jsx                  # React DOM mount point
│       ├── App.jsx                   # Central route table & AuthProvider
│       ├── api.js                    # Axios client with JWT interceptors
│       ├── index.css                 # Global design tokens & CSS variables
│       ├── context/                  # AuthContext.jsx (admin login state)
│       ├── components/layout/        # Navbar, Footer, Layout wrapper & styles
│       └── pages/                    # 16 public pages, Login portal, and Admin
│           ├── AdmissionForm.jsx     # 4-step admissions wizard
│           ├── Login.jsx             # Parent tracker & Admin login portal
│           ├── Home.jsx, About.jsx, Contact.jsx, etc.
│           └── admin/                # Admin dashboards & management modules
│
├── backend/                          # Express 4.21 REST API
│   ├── server.js                     # HTTP server, middleware stack, route mounts
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment variable blueprint
│   ├── serviceAccountKey.json.example# Firebase credentials template
│   ├── controllers/                  # Business logic (9 controller modules)
│   ├── routes/                       # Express routes (9 route files)
│   ├── middleware/                   # JWT auth.js & Multer upload.js
│   ├── services/
│   │   ├── emailService.js           # Responsive HTML emails & SMTP dispatch
│   │   └── storageService.js         # Hybrid fallback & Firestore sync
│   └── database/                     # Persistence Tier
│       ├── firebase.js               # Firebase Admin SDK & Firestore connection
│       ├── firestoreRepository.js    # Firestore collection CRUD repositories
│       ├── connection.js             # Mongoose MongoDB connection
│       ├── models/                   # 9 Mongoose schemas (Admissions, Users, etc.)
│       ├── seeds/                    # Database seeding scripts (MongoDB & Firebase)
│       └── fallback/                 # Local JSON fallback store (admissions.json)
│
└── storage/                          # Uploaded User Files
    └── uploads/
        ├── documents/                # Uploaded birth certificates & IDs
        └── gallery/                  # Uploaded photo & video assets
```

---

## 9. Operating, Seeding & Development Guide

### 9.1 Initial Setup
```bash
# 1. Install all root, frontend, and backend dependencies
npm run install-all

# 2. Configure environment
cp backend/.env.example backend/.env
```

### 9.2 Database Provisioning (Choose One)
* **Option A: Google Cloud Firestore (Recommended)**:
  1. Generate your Service Account key in the Firebase Console.
  2. Save it as `backend/serviceAccountKey.json`.
  3. Run the Firestore seeder:
     ```bash
     npm run seed:firebase
     ```
* **Option B: Local / Atlas MongoDB**:
  1. Ensure MongoDB service is running or set `MONGO_URI` in `backend/.env`.
  2. Run the MongoDB seeder:
     ```bash
     npm run seed
     ```

### 9.3 Launching the Application
```bash
# Start both Backend (:5000) and Frontend (:5173) simultaneously
npm run dev
```

### 9.4 Default Administrative Access
* **Portal URL**: `http://localhost:5173/login` $\rightarrow$ select **"Admin & Staff Portal"**
* **Email**: `admin@chittukurumbakam.com`
* **Password**: `changeme123`
