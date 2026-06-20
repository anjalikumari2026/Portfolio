# Dynamic Portfolio API Integration Guide

This guide documents the complete integration between the React frontend and Node.js backend for a fully dynamic portfolio website with admin management capabilities.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Environment Configuration](#environment-configuration)
4. [Core Infrastructure](#core-infrastructure)
5. [API Services](#api-services)
6. [Admin Pages](#admin-pages)
7. [Public Pages](#public-pages)
8. [Authentication Flow](#authentication-flow)
9. [File Uploads](#file-uploads)
10. [Error Handling](#error-handling)
11. [Deployment Considerations](#deployment-considerations)

---

## Architecture Overview

The portfolio follows a clean separation between frontend and backend:

- **Frontend**: React + Vite with client-side routing
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT-based with localStorage persistence
- **API Communication**: Axios with interceptors for token management
- **State Management**: React Context for auth, component state for data

### Key Design Decisions

1. **Centralized API Configuration**: Single source of truth for API endpoints in `src/api/endpoints.js`
2. **Service Layer Pattern**: Reusable service functions for each resource type
3. **Token Interception**: Automatic JWT attachment to requests via Axios interceptors
4. **Graceful Degradation**: Public pages fallback to static data if backend is unavailable
5. **Protected Routes**: JWT-based route protection for admin pages

---

## Project Structure

```
Alok-Portfolio/
├── src/
│   ├── api/
│   │   ├── axios.js          # Axios instance with interceptors
│   │   └── endpoints.js      # Centralized API endpoint definitions
│   ├── components/
│   │   └── common/
│   │       ├── EmptyState.jsx    # Empty state UI component
│   │       ├── Loader.jsx         # Loading spinner component
│   │       └── ProtectedRoute.jsx # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state management
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── experience/
│   │   │   │   └── ManageExperience.jsx
│   │   │   ├── skills/
│   │   │   │   └── ManageSkills.jsx
│   │   │   ├── certificates/
│   │   │   │   └── ManageCertificates.jsx
│   │   │   ├── profile/
│   │   │   │   └── ManageProfile.jsx
│   │   │   ├── projects/
│   │   │   │   └── ManageProjects.jsx
│   │   │   ├── resume/
│   │   │   │   └── ManageResume.jsx
│   │   │   ├── messages/
│   │   │   │   └── ContactMessages.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   └── public/
│   │       ├── HomePage.jsx
│   │       ├── AboutPage.jsx
│   │       ├── ProjectsPage.jsx
│   │       ├── ContactPage.jsx
│   │       └── CertificatesPage.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   ├── projectService.js
│   │   ├── skillService.js
│   │   ├── experienceService.js
│   │   ├── certificateService.js
│   │   ├── resumeService.js
│   │   └── contactService.js
│   └── App.jsx
├── .env.example
└── package.json
```

---

## Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend Environment Variables

The backend should have its own `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

## Core Infrastructure

### 1. Axios Configuration (`src/api/axios.js`)

The Axios instance is configured with:
- Base URL from environment variables
- Request interceptor for JWT token attachment
- Response interceptor for error handling and auto-logout

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("portfolio-auth-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || "An unexpected error occurred.";
    if (error?.response?.status === 401) {
      localStorage.removeItem("portfolio-auth-token");
      localStorage.removeItem("portfolio-auth-user");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(new Error(message));
  },
);
```

### 2. API Endpoints (`src/api/endpoints.js`)

Centralized endpoint definitions:

```javascript
const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  PROFILE: {
    GET: "/profile",
    CREATE: "/profile",
    UPDATE: "/profile",
  },
  PROJECTS: {
    BASE: "/projects",
    BY_ID: (id) => `/projects/${id}`,
  },
  // ... other endpoints
};
```

### 3. Authentication Context (`src/context/AuthContext.jsx`)

Manages authentication state and provides:
- `user`: Current user object
- `token`: JWT token
- `isAuthenticated`: Boolean flag
- `loading`: Initial hydration state
- `login()`: Store credentials
- `logout()`: Clear credentials
- `setUser()`: Update user profile

### 4. Protected Route Component (`src/components/common/ProtectedRoute.jsx`)

Wraps admin routes to enforce authentication:
- Checks authentication status
- Redirects to login if not authenticated
- Listens for logout events
- Shows loading state during hydration

---

## API Services

Each resource has a dedicated service file in `src/services/`:

### Service Pattern

```javascript
import api from "../api/axios";
import ENDPOINTS from "../api/endpoints";

const getResource = async () => {
  try {
    const { data } = await api.get(ENDPOINTS.RESOURCE.BASE);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createResource = async (resourceData) => {
  try {
    const { data } = await api.post(ENDPOINTS.RESOURCE.BASE, resourceData);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateResource = async (id, resourceData) => {
  try {
    const { data } = await api.put(ENDPOINTS.RESOURCE.BY_ID(id), resourceData);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteResource = async (id) => {
  try {
    const { data } = await api.delete(ENDPOINTS.RESOURCE.BY_ID(id));
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const resourceService = {
  getResource,
  createResource,
  updateResource,
  deleteResource,
};
export default resourceService;
```

### Available Services

1. **authService.js**: Login, logout, get current admin
2. **profileService.js**: Get, create, update profile (with avatar upload)
3. **projectService.js**: CRUD for projects (with thumbnail upload)
4. **skillService.js**: CRUD for skills
5. **experienceService.js**: CRUD for work experience
6. **certificateService.js**: CRUD for certificates (with image upload)
7. **resumeService.js**: Upload and delete resume
8. **contactService.js**: Send messages, get messages, mark as read, delete

---

## Admin Pages

All admin pages follow a consistent pattern:

### Common Features

1. **Loading State**: Shows spinner while fetching data
2. **Empty State**: Shows message when no data exists
3. **Error Handling**: Toast notifications for API errors
4. **CRUD Operations**: Create, read, update, delete via service functions
5. **Form Validation**: Basic client-side validation
6. **Confirmation Dialogs**: Confirm before destructive actions

### Example: ManageExperience

```javascript
export default function ManageExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ role: "", company: "", period: "", desc: "", tags: "" });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await experienceService.getExperiences();
      setExperiences(data.experiences || data);
    } catch (error) {
      toast.error(error.message || "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.role) return;
    setSubmitting(true);
    try {
      const entry = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (editing) {
        await experienceService.updateExperience(editing, entry);
        toast.success("Experience updated successfully");
      } else {
        await experienceService.createExperience(entry);
        toast.success("Experience added successfully");
      }
      setModal(false);
      fetchExperiences();
    } catch (error) {
      toast.error(error.message || "Failed to save experience");
    } finally {
      setSubmitting(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await experienceService.deleteExperience(id);
      toast.success("Experience deleted successfully");
      fetchExperiences();
    } catch (error) {
      toast.error(error.message || "Failed to delete experience");
    }
  };

  // ... JSX with loading, empty state, and list rendering
}
```

---

## Public Pages

Public pages fetch data from the backend with graceful fallback to static data.

### Pattern

```javascript
export default function HomePage() {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, projectsData, profileData] = await Promise.all([
          skillService.getSkills().catch(() => ({ skills: [] })),
          projectService.getProjects().catch(() => ({ projects: [] })),
          profileService.getProfile().catch(() => ({ profile: null })),
        ]);
        
        setSkills(skillsData.skills || skillsData);
        setProjects(projectsData.projects || projectsData);
        setProfile(profileData.profile || profileData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // Render with fallback to static data if arrays are empty
}
```

### Updated Pages

1. **HomePage**: Fetches profile, skills (preview), and featured projects
2. **AboutPage**: Fetches profile, experience, and skills (grouped by category)
3. **ProjectsPage**: Fetches all projects with filtering and search
4. **ContactPage**: Sends messages via contact service
5. **CertificatesPage**: Fetches certificates from backend

---

## Authentication Flow

### Login Process

1. User enters credentials in `Login.jsx`
2. Form validation checks required fields
3. `authService.loginAdmin()` sends POST request to `/auth/login`
4. On success, response contains `{ token, user }`
5. `AuthContext.login()` stores token and user in localStorage
6. User is redirected to `/dashboard`

### Token Management

- **Storage**: JWT token stored in `localStorage` as `portfolio-auth-token`
- **Attachment**: Axios request interceptor adds `Authorization: Bearer {token}` header
- **Validation**: Backend validates token on protected routes
- **Expiry**: 401 responses trigger auto-logout via response interceptor

### Logout Process

1. User clicks logout or token expires
2. `AuthContext.logout()` clears localStorage
3. Dispatches `auth:logout` event
4. `ProtectedRoute` listens and redirects to `/admin/login`

---

## File Uploads

### FormData Pattern

For file uploads (profile avatar, project thumbnails, certificate images, resume):

```javascript
const formData = new FormData();
formData.append("file", file);
formData.append("title", "Project Title");
// ... other fields

const isFormData = formData instanceof FormData;
const { data } = await api.post(ENDPOINTS.PROJECTS.BASE, formData, {
  headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
});
```

### Services Supporting Uploads

- **profileService**: Avatar image
- **projectService**: Thumbnail image
- **certificateService**: Certificate image
- **resumeService**: PDF/DOC file

---

## Error Handling

### Centralized Error Handling

1. **Axios Interceptor**: Normalizes error messages
2. **Toast Notifications**: User-friendly error messages
3. **Try-Catch Blocks**: Service-level error handling
4. **Fallback Data**: Public pages show static data on API failure

### Error Message Pattern

```javascript
try {
  const data = await service.getData();
  setData(data);
} catch (error) {
  toast.error(error.message || "Failed to load data");
  // Optionally set fallback data
}
```

---

## Deployment Considerations

### Frontend Deployment

1. **Environment Variables**: Set `VITE_API_BASE_URL` to production backend URL
2. **Build**: Run `npm run build` to create production bundle
3. **Hosting**: Deploy to Vercel, Netlify, or similar
4. **CORS**: Ensure backend allows frontend domain

### Backend Deployment

1. **Environment Variables**: Set production values for MongoDB URI, JWT secret
2. **Build**: No build step required (Node.js)
3. **Hosting**: Deploy to Render, Railway, or similar
4. **Security**: Use HTTPS, secure JWT secret, enable rate limiting

### Security Best Practices

1. **JWT Secret**: Use strong, randomly generated secrets
2. **Token Expiry**: Set reasonable token expiration
3. **HTTPS**: Always use HTTPS in production
4. **Input Validation**: Validate on both client and server
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **CORS**: Configure CORS to allow only trusted domains

---

## Missing Components & Improvements

### Potential Enhancements

1. **Caching**: Implement React Query or SWR for data caching
2. **Optimistic Updates**: Update UI immediately, rollback on error
3. **Real-time Updates**: WebSocket integration for live updates
4. **Image Optimization**: Add image CDN integration
5. **Analytics**: Track admin actions and page views
6. **Audit Logs**: Log all admin changes for accountability
7. **Role-Based Access**: Multiple admin roles with different permissions
8. **Bulk Operations**: Bulk delete/edit for efficiency
9. **Search**: Advanced search with filters
10. **Export/Import**: Export data to CSV/JSON

### Backend Considerations

1. **Validation**: Add Joi/Zod validation middleware
2. **Sanitization**: Sanitize user inputs to prevent XSS
3. **Rate Limiting**: Implement express-rate-limit
4. **File Storage**: Use S3 or Cloudinary for file uploads
5. **Backup**: Regular database backups
6. **Monitoring**: Add logging and monitoring (Sentry, LogRocket)

---

## Troubleshooting

### Common Issues

**Issue: 401 Unauthorized on protected routes**
- Solution: Check token in localStorage, verify backend JWT validation

**Issue: CORS errors**
- Solution: Configure backend CORS to allow frontend origin

**Issue: File uploads failing**
- Solution: Check backend multer configuration, ensure FormData is used

**Issue: Public pages showing no data**
- Solution: Check backend is running, verify API base URL

**Issue: Auto-logout on page refresh**
- Solution: Check token persistence in localStorage, verify token expiry

---

## Summary

This implementation provides a complete, production-ready dynamic portfolio system with:

- ✅ JWT-based authentication
- ✅ Protected admin routes
- ✅ Full CRUD operations for all content types
- ✅ File upload support
- ✅ Loading and error states
- ✅ Graceful degradation
- ✅ Centralized API configuration
- ✅ Reusable service layer
- ✅ Toast notifications
- ✅ Responsive design

The architecture is scalable, maintainable, and follows React best practices.
