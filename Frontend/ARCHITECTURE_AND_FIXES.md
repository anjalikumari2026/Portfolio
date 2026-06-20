# MERN Portfolio - Complete Architecture & Fixes Guide

## ✓ All Issues Fixed & Architecture Standardized

This document summarizes all the debugging and fixes applied to your MERN portfolio application.

---

## PROJECT STRUCTURE

### Frontend (Root Directory)

```
Alok-Portfolio/
├── src/
│   ├── api/
│   │   ├── axios.js          (Axios interceptor with JWT + error handling)
│   │   └── endpoints.js      (Centralized API endpoints)
│   ├── assets/
│   ├── components/           (Reusable UI components)
│   ├── context/              (React Context - Auth, Theme)
│   ├── hooks/                (Custom hooks)
│   ├── layouts/              (MainLayout, AdminLayout)
│   ├── pages/                (Route pages)
│   ├── routes/               (AppRoutes with protected routes)
│   ├── services/             (API service functions)
│   ├── styles/               (Global styles)
│   ├── utils/                (Helpers, validation)
│   ├── App.jsx               (DEPRECATED - use AppRoutes)
│   ├── main.jsx              (App entry point with providers)
│   └── index.css
├── .env.local                (Local development config)
├── .env.example              (Template)
├── vite.config.js
├── package.json
└── index.html
```

### Backend (Portfolio-backend/)

```
Portfolio-backend/
├── config/
│   ├── dbconnect.js         (MongoDB connection)
│   ├── cloudinary.js        (Cloudinary configuration)
│   └── multer.js            (Removed - using inline middleware)
├── controllers/             (Business logic for each resource)
├── middleware/
│   ├── authMiddleware.js    (JWT verification)
│   ├── uploadMiddleware.js  (Multer disk storage)
│   └── errorMiddleware.js
├── models/                  (MongoDB schemas)
├── routes/                  (REST API routes)
├── utils/
│   ├── generateToken.js
│   └── responseHandler.js
├── index.js                 (Express app setup)
├── .env                     (Local environment variables)
├── .env.example             (Template)
└── package.json
```

---

## KEY FIXES APPLIED

### 1. Backend Routes Standardized to REST Conventions

**Before (Non-RESTful):**

```
POST   /api/project/create
PUT    /api/project/update/:id
DELETE /api/project/delete/:id
```

**After (REST):**

```
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

**Routes Updated:**

- `/api/projects` - Projects CRUD
- `/api/skills` - Skills CRUD (added missing UPDATE)
- `/api/certificates` - Certificates CRUD (added missing UPDATE)
- `/api/experience` - Experience CRUD (added missing UPDATE)
- `/api/profile` - Profile CRUD
- `/api/resume` - Resume upload/download
- `/api/contact` - Contact form (public POST, admin GET/DELETE)
- `/api/auth` - Authentication (login, logout, get current user)

---

### 2. Frontend Endpoints Configuration

**File:** `src/api/endpoints.js`

Updated to match backend REST routes:

```javascript
const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  PROJECTS: {
    BASE: "/projects",
    BY_ID: (id) => `/projects/${id}`,
  },
  // ... etc
};
```

**Axios Configuration:** `src/api/axios.js`

- BaseURL: `http://localhost:5000/api` (supports VITE_API_BASE_URL env var)
- JWT token auto-attached to all requests
- Auto-logout on 401 (expired token)
- Centralized error handling

---

### 3. Authentication Flow Implemented

**Login Flow:**

1. User enters email/password in Login.jsx
2. Calls `authService.loginAdmin()` → POST `/auth/login`
3. Backend returns `{ success, token, user }`
4. Frontend calls `login()` in AuthContext
5. Token + user saved to localStorage
6. User redirected to `/dashboard`
7. Protected routes check `isAuthenticated` flag

**Files Modified:**

- `src/pages/admin/Login.jsx` - Integrated with API & AuthContext
- `src/context/AuthContext.jsx` - Manages auth state + localStorage
- `src/routes/ProtectedRoute.jsx` - Guards admin routes
- `src/routes/AppRoutes.jsx` - Proper routing structure
- Backend `authController.js` - Added getCurrentAdmin + logoutAdmin

**Auth Service:** `src/services/authService.js`

```javascript
loginAdmin(credentials); // POST /auth/login
logoutAdmin(); // POST /auth/logout
getCurrentAdmin(); // GET /auth/me
```

---

### 4. CORS Configuration Fixed

**Before:** Hardcoded to production URL

```javascript
cors({
  origin: "https://alok-portfolio-7di6.onrender.com",
  credentials: true,
});
```

**After:** Supports localhost + production

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://alok-portfolio-7di6.onrender.com",
];

cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

---

### 5. File Upload Integration

**Multer Middleware:** `Portfolio-backend/middleware/uploadMiddleware.js`

- Disk storage to temporary files
- Used in routes for single file uploads

**Cloudinary Integration:**

- Added to: `projectController.js`, `certificateController.js`, `resumeController.js`
- Automatic upload to Cloudinary on create/update
- Folder structure: `portfolio/projects`, `portfolio/certificates`, `portfolio/resumes`
- File deletion on resource deletion

**Routes with File Upload:**

```javascript
// Projects
router.post("/", isAuthenticated, upload.single("image"), createProject);
router.put("/:id", isAuthenticated, upload.single("image"), updateProject);

// Certificates
router.post("/", isAuthenticated, upload.single("image"), createCertificate);
router.put("/:id", isAuthenticated, upload.single("image"), updateCertificate);

// Resume
router.post("/", isAuthenticated, upload.single("resume"), uploadResume);
```

**Frontend FormData Usage:**

```javascript
const formData = new FormData();
formData.append("title", "Project Title");
formData.append("description", "...");
formData.append("image", fileInput.files[0]);

// Service automatically detects FormData and sets proper headers
await projectService.createProject(formData);
```

---

### 6. Missing CRUD Operations Added

**Skills:**

- ✓ CREATE (POST /skills)
- ✓ READ (GET /skills)
- ✓ UPDATE (PUT /skills/:id) - **ADDED**
- ✓ DELETE (DELETE /skills/:id)

**Certificates:**

- ✓ CREATE (POST /certificates)
- ✓ READ (GET /certificates)
- ✓ UPDATE (PUT /certificates/:id) - **ADDED**
- ✓ DELETE (DELETE /certificates/:id)

**Experience:**

- ✓ CREATE (POST /experience)
- ✓ READ (GET /experience)
- ✓ UPDATE (PUT /experience/:id) - **ADDED**
- ✓ DELETE (DELETE /experience/:id)

---

### 7. Environment Variables Setup

**Frontend (.env.local):**

```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend (.env):**

```
PORT=5000
MONGO_URI=mongodb+srv://Alok:...@cluster0.k36rexu.mongodb.net/portfolio
JWT_SECRET=mysecretkey
CLOUD_NAME=dwe2zetpw
CLOUD_API_KEY=435291759561681
CLOUD_API_SECRET=MfaigPP2_nZLNUZ3HGoIekPIRl4
NODE_ENV=development
```

---

## HOW TO RUN THE PROJECT

### Frontend Setup

```bash
cd Alok-Portfolio

# Install dependencies (if not already done)
npm install

# Create/verify .env.local exists with:
# VITE_API_BASE_URL=http://localhost:5000/api

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

### Backend Setup

```bash
cd Portfolio-backend

# Install dependencies (if not already done)
npm install

# Verify .env file exists with all variables

# Start development server
npm run dev
```

**Backend runs on:** `http://localhost:5000`

### Database Requirements

- MongoDB running locally or connection string in .env
- Cloudinary account configured in .env

---

## API DOCUMENTATION

### Authentication Endpoints

**Login**

```
POST /api/auth/login
Body: { email, password }
Response: { success, token, user: { id, name, email, role } }
```

**Get Current User**

```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { success, user }
```

**Logout**

```
POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response: { success, message }
```

### Projects CRUD

```
GET    /api/projects              (public)
GET    /api/projects/:id          (public)
POST   /api/projects              (authenticated, with image file)
PUT    /api/projects/:id          (authenticated, with optional image)
DELETE /api/projects/:id          (authenticated)
```

### Skills CRUD

```
GET    /api/skills                (public)
POST   /api/skills                (authenticated)
PUT    /api/skills/:id            (authenticated)
DELETE /api/skills/:id            (authenticated)
```

### Certificates CRUD

```
GET    /api/certificates          (public)
POST   /api/certificates          (authenticated, with image)
PUT    /api/certificates/:id      (authenticated, with optional image)
DELETE /api/certificates/:id      (authenticated)
```

### Experience CRUD

```
GET    /api/experience            (public)
POST   /api/experience            (authenticated)
PUT    /api/experience/:id        (authenticated)
DELETE /api/experience/:id        (authenticated)
```

### Profile

```
GET    /api/profile               (public)
POST   /api/profile               (authenticated)
PUT    /api/profile               (authenticated)
```

### Resume

```
GET    /api/resume                (public)
POST   /api/resume                (authenticated, with file)
DELETE /api/resume/:id            (authenticated)
```

### Contact

```
POST   /api/contact               (public - no auth required)
GET    /api/contact               (authenticated - admin only)
DELETE /api/contact/:id           (authenticated - admin only)
```

---

## FILE STRUCTURE EXPLANATION

### Frontend Services (`src/services/`)

Each service module handles API calls for a resource:

```javascript
// Example: projectService.js
import api from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

export const getProjects = async () => {
  const { data } = await api.get(ENDPOINTS.PROJECTS.BASE);
  return data;
};
```

### Frontend Context (`src/context/`)

Global state management:

- **AuthContext.jsx** - User authentication state
  - `login(token, user)` - Store user session
  - `logout()` - Clear user session
  - `isAuthenticated` - Check if user is logged in
  - `loading` - Hydration state from localStorage
- **ThemeContext.jsx** - Dark/light theme

### Frontend Hooks (`src/hooks/`)

- **useAuth.js** - Access AuthContext
- **useFetch.js** - Fetch data with loading state
- **useInView.js** - Detect element visibility
- **useTheme.js** - Access ThemeContext

### Backend Controllers

Each controller exports functions for route handlers:

```javascript
// Example: projectController.js
exports.createProject = async (req, res) => {
  /* ... */
};
exports.getAllProjects = async (req, res) => {
  /* ... */
};
exports.getSingleProject = async (req, res) => {
  /* ... */
};
exports.updateProject = async (req, res) => {
  /* ... */
};
exports.deleteProject = async (req, res) => {
  /* ... */
};
```

### Backend Middleware

- **authMiddleware.js** - JWT verification
  - Extracts token from Authorization header
  - Verifies signature with JWT_SECRET
  - Attaches user to `req.user`
- **uploadMiddleware.js** - Multer configuration
  - Saves uploaded files temporarily
  - Single file upload support

---

## DEBUGGING TIPS

### Frontend Issues

1. **Check browser console** for JavaScript errors
2. **Check Network tab** to see API requests/responses
3. **Verify .env.local** has correct VITE_API_BASE_URL
4. **Check localStorage** for token persistence
5. **Verify Redux/Context** state in React DevTools

### Backend Issues

1. **Check terminal logs** for errors
2. **Verify MongoDB connection** with correct URI
3. **Check .env variables** for typos
4. **Test endpoints** with Postman/curl
5. **Verify JWT_SECRET** is same in all places
6. **Check Cloudinary credentials** for file uploads

### Common Issues & Fixes

**"Cannot POST /api/projects"**

- Backend might not be running
- Route might not be registered in index.js
- Check if multer is interfering

**"401 Unauthorized"**

- Token might be expired (7 days)
- Token might be missing from request
- Check Authorization header format: `Bearer <token>`

**"CORS error"**

- Frontend URL not in CORS whitelist
- Make sure backend is on port 5000
- Check if credentials are set correctly

**File upload fails**

- Cloudinary credentials might be wrong
- Multer might not have upload folder created
- Check if file field name matches (`image`, `resume`)

---

## PRODUCTION DEPLOYMENT CHECKLIST

- [ ] Set `NODE_ENV=production` in backend .env
- [ ] Use production MongoDB URI
- [ ] Update CORS origins to production domain
- [ ] Set strong JWT_SECRET (not "mysecretkey")
- [ ] Update VITE_API_BASE_URL to production API
- [ ] Run `npm run build` for frontend
- [ ] Deploy frontend build to hosting
- [ ] Deploy backend to cloud provider
- [ ] Verify all environment variables
- [ ] Test all API endpoints
- [ ] Monitor error logs

---

## NEXT STEPS

1. **Start both servers** (frontend on :5173, backend on :5000)
2. **Register/create admin account** via backend
3. **Test login flow** at `/login`
4. **Access dashboard** at `/dashboard`
5. **Test CRUD operations** for all resources
6. **Test file uploads** for projects, certificates, resume
7. **Verify authentication** on protected routes

---

## TECHNICAL STACK

**Frontend:**

- React 19 with Vite
- React Router v7 (latest)
- TailwindCSS + Glassmorphism
- Axios for API calls
- React Hot Toast for notifications
- Context API for state management
- Framer Motion for animations

**Backend:**

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for image/file storage
- Bcrypt for password hashing
- CORS for cross-origin requests

---

This application follows enterprise-level MERN architecture with proper separation of concerns, security practices, and scalable design patterns.
