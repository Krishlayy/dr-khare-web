# Dr. Supreet Khare - Personal Website & Admin CMS

## 📖 Project Overview
This project is the complete, full-stack personal website and content management system (CMS) for Dr. Supreet Khare. It showcases his clinical leadership, research publications, awards, and patient reviews, all powered by a secure backend that allows admins to update the site in real time without writing any code.

## 🏗️ Architecture
The system is built as a **monolithic MERN stack application** (for the final production build):
- **Frontend (Client):** Built with React, TypeScript, Tailwind CSS, and TanStack Router. It has been compiled into highly optimized static assets (HTML/CSS/JS).
- **Backend (Server):** Built with Node.js and Express.js. It serves the frontend static files and handles all secure `/api` routing.
- **Database:** MongoDB (using Mongoose schemas for strict data validation).

## 🚀 How to Run the Production Server
The frontend and backend have been merged into a single process. You do not need to run a separate React server.

1. Open your terminal.
2. Navigate to the backend server directory:
   ```bash
   cd dr-khare-website/server
   ```
3. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open your browser and navigate to: **http://localhost:5000**

## 🔐 Admin Panel Access
You can access the content management system to edit pages, manage media, and approve patient reviews at **http://localhost:5000/admin**.

- **Email:** `admin@drkhare.com`
- **Password:** `admin123`
*(Note: Please change this password from the dashboard after your first login!)*

## 🛣️ What We Need to Build Next (Roadmap)
While the core system is 100% functional and error-free, there are a few external systems and future features that still need to be connected:

1. **The AI Chatbot Integration:**
   - **Current State:** The frontend has a floating 3D Chatbot button (bottom right) that opens an iframe pointing to `http://localhost:3001`.
   - **What Needs to be Built:** The actual chatbot code is in a separate folder. That chatbot needs to be fully developed, deployed to a live URL, and then the `CHATBOT_URL` inside `src/components/FloatingChatbot.tsx` must be updated to point to that real URL.

2. **Cloudinary Media Hosting (Live Keys):**
   - **Current State:** The `.env` file uses "demo" keys for Cloudinary. To prevent image upload failures, the system currently catches "demo" uploads and saves them locally to the `server/uploads/` folder.
   - **What Needs to be Built:** Create a real Cloudinary account, get the live API keys, and update the `.env` file. The backend will automatically switch back to uploading files securely to the cloud.

3. **Analytics Dashboard Data:**
   - **Current State:** The UI for the dashboard is built, but you may want to connect it to real Google Analytics via the Site Settings tab.

## 🛠️ Folder Structure
- `frontend-reference/`: The original uncompiled React/TypeScript source code. Use this if you want to make UI changes, then run `npm run build` to re-generate the production files.
- `dr-khare-website/server/`: The Node.js Express backend.
- `dr-khare-website/server/public/`: The compiled, production-ready React frontend (served automatically by Express).
