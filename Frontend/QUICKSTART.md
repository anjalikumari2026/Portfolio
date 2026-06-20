# 🚀 MERN Portfolio - Quick Start Guide

## ✅ All Issues Fixed & Production-Ready

This portfolio application is now fully debugged, with all integration issues resolved and a professional MERN architecture implemented.

---

## 🎯 Quick Start

### Prerequisites

- Node.js v18+ installed
- MongoDB running locally or cloud connection ready
- Cloudinary account configured (.env already has credentials)

### 1. Start Frontend

```bash
cd Alok-Portfolio
npm install          # Only if not done before
npm run dev
```

**Access:** http://localhost:5173

### 2. Start Backend

```bash
cd Portfolio-backend
npm install          # Only if not done before
npm run dev
```

**Access:** http://localhost:5000

### 3. Access Admin Dashboard

- Navigate to: http://localhost:5173/login
- Login with admin credentials
- Dashboard available at: http://localhost:5173/dashboard

---

## 🔐 Default Admin Credentials

If no admin exists, create one via direct database entry or API call:

```javascript
// Create admin via backend terminal
// Use bcryptjs to hash password: bcrypt.hashSync("password", 10)
```

Or register via API:

```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## 📋 What Was Fixed

### ✓ Backend

- [x] Standardized all routes to REST conventions
- [x] Added missing CRUD operations (update for skills, certificates, experience)
- [x] Implemented JWT authentication with `/auth/me` endpoint
- [x] Fixed CORS to support local development
- [x] Integrated Cloudinary for file uploads
- [x] Added proper error handling and validation

### ✓ Frontend

- [x] Fixed routing with AppRoutes
- [x] Implemented complete login flow
- [x] Integrated AuthContext with localStorage persistence
- [x] Fixed API endpoints to match backend routes
- [x] Added proper axios interceptors
- [x] Configured environment variables

### ✓ Integration

- [x] Frontend ↔ Backend connection verified
- [x] API endpoints match service calls
- [x] File uploads with Cloudinary working
- [x] Protected routes enforcing authentication
- [x] JWT token auto-renewal on requests

---

## 📁 Project Structure

```
Alok-Portfolio/                   # Frontend
├── src/
│   ├── api/           # Axios + endpoints
│   ├── components/    # Reusable UI
│   ├── context/       # Auth/Theme
│   ├── pages/         # Route pages
│   ├── services/      # API calls
│   └── routes/        # Router setup
├── .env.local         # Config
└── package.json

Portfolio-backend/                # Backend
├── controllers/       # Business logic
├── models/            # MongoDB schemas
├── routes/            # REST routes
├── middleware/        # Auth/Upload
├── config/            # DB/Cloud config
├── .env               # Config
└── package.json
```

---

## 🔌 API Endpoints

### Auth

```
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Current user
```

### Resources (CRUD)

```
GET    /api/projects                # Get all
POST   /api/projects                # Create (auth)
PUT    /api/projects/:id            # Update (auth)
DELETE /api/projects/:id            # Delete (auth)

GET    /api/skills                  # Get all
POST   /api/skills                  # Create (auth)
PUT    /api/skills/:id              # Update (auth)
DELETE /api/skills/:id              # Delete (auth)

GET    /api/certificates            # Get all
POST   /api/certificates            # Create (auth, with image)
PUT    /api/certificates/:id        # Update (auth, optional image)
DELETE /api/certificates/:id        # Delete (auth)

GET    /api/experience              # Get all
POST   /api/experience              # Create (auth)
PUT    /api/experience/:id          # Update (auth)
DELETE /api/experience/:id          # Delete (auth)

GET    /api/profile                 # Get
POST   /api/profile                 # Create (auth)
PUT    /api/profile                 # Update (auth)

GET    /api/resume                  # Get
POST   /api/resume                  # Upload (auth, with file)
DELETE /api/resume/:id              # Delete (auth)

POST   /api/contact                 # Send message (public)
GET    /api/contact                 # Get messages (auth)
DELETE /api/contact/:id             # Delete (auth)
```

---

## 🎨 UI Features Preserved

✓ Dark futuristic glassmorphism design  
✓ Smooth animations with Framer Motion  
✓ Responsive design with TailwindCSS  
✓ Toast notifications for feedback  
✓ Loading skeletons for better UX  
✓ Light/Dark theme toggle

All original design patterns and styling remain unchanged.

---

## 🔍 Testing the Application

### Test Public Routes

1. Visit http://localhost:5173 (Home)
2. Navigate to /about, /projects, /certificates, /contact
3. Submit contact form (POST /api/contact)

### Test Admin Features

1. Go to /login
2. Enter credentials and submit
3. Token saved to localStorage
4. Redirected to /dashboard
5. Can create/edit/delete resources

### Test File Uploads

1. Create a project with image file
2. Image automatically uploaded to Cloudinary
3. Update existing resource with new image
4. Delete resource (image deleted from Cloudinary)

---

## 🐛 Troubleshooting

### Issue: Cannot connect to backend

**Solution:**

- Ensure backend is running: `npm run dev` in Portfolio-backend
- Check if port 5000 is available
- Verify .env has VITE_API_BASE_URL=http://localhost:5000/api

### Issue: Login fails with "Admin not found"

**Solution:**

- Create admin account first via database or API
- Verify MongoDB connection in .env
- Check backend logs for errors

### Issue: File upload fails

**Solution:**

- Verify Cloudinary credentials in .env
- Check if CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET are correct
- Ensure proper FormData formatting in frontend

### Issue: "CORS error"

**Solution:**

- Backend might not be running
- Check if http://localhost:5173 is in allowed origins
- Clear browser cache and cookies

---

## 📦 Dependencies

**Frontend:** React, React Router, Axios, TailwindCSS, Framer Motion, React Hook Form, Toast  
**Backend:** Express, MongoDB, Mongoose, JWT, Bcrypt, Multer, Cloudinary, CORS, Morgan

All dependencies are installed and ready to use.

---

## 🚀 Production Deployment

1. Build frontend: `npm run build`
2. Deploy to hosting (Vercel, Netlify, etc.)
3. Deploy backend to cloud (Render, Heroku, Railway, etc.)
4. Update .env with production URLs
5. Verify all APIs work on production

See **ARCHITECTURE_AND_FIXES.md** for detailed deployment checklist.

---

## 📚 Documentation

- **ARCHITECTURE_AND_FIXES.md** - Comprehensive technical documentation
- **README.md** - This file
- **.env.example** - Environment variables template

---

## 🎓 Architecture Highlights

✓ **Scalable:** Clean separation of concerns with services, controllers, models  
✓ **Secure:** JWT authentication, password hashing, protected routes  
✓ **Professional:** REST API, proper error handling, centralized configuration  
✓ **Modern:** Latest React patterns, hooks, context API  
✓ **Maintainable:** Organized file structure, reusable components, clear naming

---

## 💡 Tips for Development

1. Use React DevTools to inspect component state
2. Use Network tab to see API calls
3. Use backend logs for debugging
4. Check localStorage for token persistence
5. Use Postman to test API endpoints independently

---

## 🤝 Need Help?

Refer to **ARCHITECTURE_AND_FIXES.md** for:

- Detailed API documentation
- Debugging tips
- Common issues and solutions
- Technical stack explanation
- File structure explanation

---

**Happy coding! 🎉**

Your MERN portfolio application is now fully functional and production-ready.
