# AI Website Performance Analyzer

A full-stack web application that analyzes website performance using Google Lighthouse audits and provides AI-powered optimization recommendations powered by Google Generative AI (Gemini). Features a complete user management system with profile editing, dashboard with advanced search/sort/filter, and detailed performance analytics.

## Features

- 🎯 **Lighthouse Performance Analysis**: Comprehensive website performance audits analyzing performance, accessibility, SEO, and best practices
- 🤖 **AI-Powered Suggestions**: Intelligent recommendations for optimization powered by Google Generative AI (Gemini Flash)
- 📊 **Advanced Dashboard**: Website history with real-time search, multi-level sorting, and performance filtering
- 🔐 **Secure Authentication**: JWT-based login with bcrypt password hashing and 1-hour token expiry
- 📈 **Historical Tracking**: Compare performance metrics across multiple analyses
- ⚡ **Real-time Analysis**: Instant feedback on website performance issues

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM for schema validation
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Performance Analysis**: Google Lighthouse for accurate audits
- **AI Integration**: Google Generative AI (Gemini Flash) for contextual suggestions
- **Browser Automation**: Chrome Launcher for webpage testing

### Frontend
- **Framework**: React 19 with TypeScript for type safety
- **Build Tool**: Vite for fast ES module bundling
- **Styling**: Tailwind CSS with dark theme preset
- **Routing**: React Router v6 for SPA navigation
- **Icons**: Lucide React for modern icon library
- **State Management**: Context API with custom hooks
- **HTTP Client**: Fetch API for REST communication

### DevOps
- **Containerization**: Docker for service isolation
- **Orchestration**: Docker Compose for multi-container setup
- **Reverse Proxy**: Nginx for frontend serving and API routing

## Prerequisites

- **Node.js** (v18 or higher) - JavaScript runtime
- **npm** or **yarn** - Package manager (npm included with Node.js)
- **MongoDB** (v5.0+) - Local instance or MongoDB Atlas cloud database
- **Google Generative AI API Key** - For Gemini Flash AI suggestions
- **Google Chrome/Chromium** (v90+) - For Lighthouse performance audits
- **Docker & Docker Compose** (optional) - For containerized deployment

## Installation

### Option 1: Local Development Setup

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd AI-Website-Performance-Analyzer
```

#### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-analyzer

# Authentication
JWT_SECRET=your_very_secure_jwt_secret_key_here_change_in_production

# Google Generative AI (Gemini)
API_KEY=your_google_generative_ai_api_key_from_https://ai.google.dev

```

#### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
```

#### Step 4: Start Development Servers

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Step 5: Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

### Option 2: Docker Compose Deployment

#### Prerequisites
- Docker and Docker Compose installed on your system

#### Setup Instructions

```bash
# 1. Clone the repository
git clone <repository-url>
cd AI-Website-Performance-Analyzer

# 2. Create environment files
# Create backend/.env with MongoDB URI, JWT_SECRET, and API_KEY
# Create frontend/.env with VITE_API_URL (or modify docker-compose.yml)

# 3. Build and start all services
docker-compose up --build

# 4. (Optional) Run in background
docker-compose up -d

# 5. Access the application
# Frontend: http://localhost
# Backend API: http://localhost/api
```

#### Stopping Services
```bash
# Stop running containers
docker-compose down

# Stop and remove volumes (careful - removes data!)
docker-compose down -v
```