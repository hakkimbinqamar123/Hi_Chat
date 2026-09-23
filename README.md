<h1 align="center">
  <br>
  
  <br>
  Hi Chat: Fullstack Video & Messaging Platform
  <br>
</h1>

<h4 align="center">A feature-rich real-time communication platform built with modern web technologies.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#environment-variables">Environment Variables</a>
</p>


## Key Features

- **Real-time Messaging:** Chat instantly with typing indicators, online status, and emoji reactions.
- **Video Calling:** Seamless 1-on-1 and group video calls with screen sharing.
- **AI Chatbot Integration:** Built-in AI assistant powered by Google's Gemini models.
- **Secure Authentication:** JWT-based authentication to keep your data safe.
- **Theme Personalization:** Over 30 beautiful, dynamic UI themes to choose from.
- **Global State Management:** Lightning-fast state updates via Zustand.

## Tech Stack

* **Frontend:** React, TailwindCSS, Zustand, TanStack Query, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Real-time Infrastructure:** Stream (Chat & Video)
* **AI:** Google Generative AI (Gemini)

---

## Environment Variables

To run this project, you will need to add the following environment variables to your respective `.env` files.

### Backend (`/backend/.env`)

```env
PORT=5001
MONGO_URI=your_mongo_db_connection_string
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_secure_jwt_secret
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (`/frontend/.env`)

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## How To Use

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run the Application locally

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```

> **Note:** Make sure you have added your API keys in the `.env` files before starting the servers!
