# Dr. Supreet Khare Professional Website

A full-stack MERN application representing the professional portfolio, career milestones, and clinical research of Dr. Supreet Khare. This application is driven by a bespoke internal CMS, dynamic site content, and an integrated patient review system.

## Features

- **Dynamic Public Pages**: Home, Journey (Timeline), Publications, Insights (Blog), Contact, and Patient Reviews.
- **Admin Dashboard**: Full CRUD management of Blog Posts (with TipTap rich-text editor), Career Milestones, Publications, Site Content (hero text, bios), and Contact Messages.
- **Patient Reviews Module**: QR-code ready public submission form, admin moderation pipeline (Approve, Reject, Feature, Hide), and dashboard analytics.
- **Chatbot Ready**: A floating chatbot widget wired to a backend endpoint designed to serve dynamic knowledge-base content, structured for future RAG pipeline integration.
- **Security**: JWT authentication, bcrypt password hashing, express-rate-limit, and helmet security headers.

## Tech Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS, Framer Motion, Axios, Recharts, TipTap.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Multer for image uploads.

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (running locally on port 27017, or a MongoDB Atlas URI)

### 2. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Variables:
   Copy `.env.example` to `.env` and adjust variables as necessary:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/drkhare
   JWT_SECRET=your_jwt_secret_here_change_in_production
   CLIENT_URL=http://localhost:5173
   API_URL=http://localhost:5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Initializing the Admin User
To seed an initial admin user to access the dashboard:
1. With the backend running, send a `POST` request to `http://localhost:5000/api/auth/seed`.
   ```bash
   curl -X POST http://localhost:5000/api/auth/seed
   ```
2. Default credentials:
   - Email: `admin@drkhare.com`
   - Password: `admin123`
3. Navigate to `http://localhost:5173/admin/login` to log in.

## Folder Structure
```
dr-khare-website/
├── client/                 # React app
│   ├── src/
│   │   ├── components/     # UI components (Header, Footer, ChatWidget)
│   │   │   └── admin/      # Admin dashboard sub-components
│   │   ├── pages/          # Route components (Home, Journey, Blogs, Contact, LeaveReview)
│   │   ├── context/        # Auth Context
│   │   └── index.css       # Tailwind entry and rich-text styles
├── server/                 # Express app
│   ├── config/             # Config files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, error handling, rate limiting
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── uploads/            # Local image storage
└── README.md
```
