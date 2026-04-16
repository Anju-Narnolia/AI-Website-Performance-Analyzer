# AI Website Performance Analyzer

A full-stack web application that analyzes website performance using Google Lighthouse audits and provides AI-powered optimization recommendations powered by Google Generative AI (Gemini). Features a complete user management system with profile editing, dashboard with advanced search/sort/filter, and detailed performance analytics.

## Features

- 🎯 **Lighthouse Performance Analysis**: Comprehensive website performance audits analyzing performance, accessibility, SEO, and best practices
- 🤖 **AI-Powered Suggestions**: Intelligent recommendations for optimization powered by Google Generative AI (Gemini Flash)
- 👤 **User Profile Management**: Create account, edit profile, change password, secure logout
- 📊 **Advanced Dashboard**: Website history with real-time search, multi-level sorting, and performance filtering
- 🔐 **Secure Authentication**: JWT-based login with bcrypt password hashing and 1-hour token expiry
- 📈 **Historical Tracking**: Compare performance metrics across multiple analyses
- 🎨 **Beautiful UI**: Dark theme responsive design with Tailwind CSS and Lucide React icons
- ⚡ **Real-time Analysis**: Instant feedback on website performance issues

## Tech Stack

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

## Project Structure

```
AI-Website-Performance-Analyzer/
├── backend/                          # Express.js backend server
│   ├── config.js                    # Configuration & secrets (JWT_SECRET, API_KEY)
│   ├── server.js                    # Main server entry point with middleware setup
│   ├── package.json                 # Backend dependencies
│   ├── Dockerfile                   # Backend container configuration
│   ├── middleware/
│   │   └── auth.js                  # JWT token verification middleware
│   ├── model/
│   │   ├── user.js                  # User schema (name, email, password, companyName)
│   │   ├── website.js               # Website schema (userId, URL, name)
│   │   └── lighthouse.js            # Lighthouse schema (scores, metrics, reports)
│   ├── routes/
│   │   ├── userRoutes.js            # POST /register, /login; GET/PUT /profile
│   │   ├── urlRoutes.js             # POST /analyze; AI suggestion generation
│   │   └── data.js                  # GET /history; website history aggregation
│   └── suggesion/
│       ├── aiSuggestion.js          # Suggestion data model
│       └── aiSuggestionService.js   # Service layer for suggestion logic
├── frontend/                         # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx                  # Main app component with routing
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.css                  # Global application styles
│   │   ├── index.css                # Tailwind CSS directives
│   │   ├── pages/
│   │   │   ├── login.tsx            # User login page
│   │   │   ├── register.tsx         # User registration page
│   │   │   ├── home.tsx             # Landing/home page
│   │   │   ├── dashboard.tsx        # Website history with search/sort/filter
│   │   │   ├── anaylise.tsx         # Performance analysis page
│   │   │   ├── profile.tsx          # User profile management page (NEW)
│   │   │   ├── components/
│   │   │   │   └── CircularProgress.tsx  # Progress indicator component
│   │   │   └── layout/
│   │   │       ├── navbar.tsx       # Navigation header with auth state
│   │   │       └── footer.tsx       # Footer component
│   │   ├── context/
│   │   │   ├── AuthContext.ts       # Auth context type definitions
│   │   │   ├── AuthContext.tsx      # Auth provider component
│   │   │   └── useAuth.ts           # Custom authentication hook
│   │   └── assets/                  # Static images and files
│   ├── package.json                 # Frontend dependencies
│   ├── Dockerfile                   # Frontend container configuration
│   ├── vite.config.ts               # Vite bundler configuration
│   ├── tsconfig.json                # TypeScript compiler options
│   ├── tsconfig.app.json            # App-specific TypeScript config
│   ├── tsconfig.node.json           # Build tool TypeScript config
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML entry point
│   └── public/                      # Static assets served directly
├── nginx/                            # Nginx reverse proxy configuration
│   └── Dockerfile                   # Nginx container configuration
├── docker-compose.yml               # Multi-container orchestration config
└── README.md                        # This file
```

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

# Browser Automation (optional - auto-detected if not set)
CHROME_PATH=/path/to/chrome
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

## Configuration

### Environment Variables

#### Backend (.env - required)
```env
# Express Server
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai-analyzer
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ai-analyzer

# JWT Authentication
JWT_SECRET=your_secure_jwt_secret_change_in_production

# Google Generative AI API
API_KEY=your_google_generative_ai_api_key

# Optional: Chrome path for Lighthouse (auto-detected if omitted)
CHROME_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
```

**Important Security Notes:**
- JWT_SECRET should be a strong, random string (min 32 characters recommended)
- API_KEY is sensitive - never commit to version control
- Different secrets for development, staging, and production environments
- Use strong passwords and enable MongoDB authentication in production

#### Frontend (.env)
```env
# API Server URL for Fetch requests
VITE_API_URL=http://localhost:5000

# For production: VITE_API_URL=https://api.yourdomain.com
```

### Database Setup

#### Local MongoDB
```bash
# macOS (with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows (using MongoDB Community Server)
# Download from https://www.mongodb.com/try/download/community
```

#### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new project and cluster
3. Create a database user with strong credentials
4. Obtain connection string: `mongodb+srv://user:pass@cluster.mongodb.net/db`
5. Add your IP to the IP whitelist
6. Use connection string in `MONGODB_URI`

### Google Generative AI Setup

1. Visit https://ai.google.dev/
2. Click "Get API key" button
3. Create new API key in Google Cloud Console
4. Copy the key and add to backend `.env` as `API_KEY`
5. Note: Free tier includes usage limits

## API Endpoints

### Authentication & User Management

#### Register User
```
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "companyName": "Tech Corp"
}

Response: { token, userId, name, email, companyName }
```

#### Login User
```
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: { token, userId, name, email, companyName }
```

#### Get User Profile
```
GET /api/user/profile
Authorization: Bearer <token>

Response: { userId, name, email, companyName, createdAt }
```

#### Update User Profile
```
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",        // Optional
  "companyName": "New Corp", // Optional
  "password": "NewPass123"   // Optional
}

Response: { message: "Profile updated successfully" }
```

### Website Analysis

#### Submit Website for Analysis
```
POST /api/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com",
  "name": "My Website"
}

Response: { 
  projectId,
  scores: {
    performance: 85,
    accessibility: 92,
    seo: 88,
    bestPractices: 90
  },
  suggestions: {
    performance: { suggestions: [...] },
    accessibility: { suggestions: [...] },
    seo: { suggestions: [...] },
    bestPractices: { suggestions: [...] }
  }
}
```

#### Get Dashboard History
```
GET /api/dashboard/history
Authorization: Bearer <token>

Response: [{
  _id,
  URL,
  name,
  latestScore: {
    performance: 85,
    accessibility: 92,
    seo: 88,
    bestPractices: 90,
    testedAt: "2024-01-15T10:30:00Z"
  },
  totalReports: 5,
  createdAt
}]
```

### Authentication Headers
All protected endpoints (marked with 🔒) require:
```
Authorization: Bearer <jwt_token>
```

Tokens expire after **1 hour** and must be refreshed via new login.

## Usage Guide

### 1. Getting Started

1. **Visit the Application**
   - Go to `http://localhost:5173` (local development)
   - Or `http://localhost` (Docker deployment)

2. **Create Account**
   - Click "Sign Up" on the login page
   - Fill in: Name, Email, Password, Company Name
   - Click "Register"

3. **Login**
   - Use your registered email and password
   - Login redirects to the dashboard

### 2. Analyze a Website

1. **Navigate to Analysis**
   - Click "Analyze" in the navbar
   - Enter website URL (e.g., https://example.com)
   - Enter optional website name for tracking
   - Click "Analyze Website"

2. **View Results**
   - See Lighthouse scores for:
     - Performance (0-100)
     - Accessibility (0-100)
     - SEO (0-100)
     - Best Practices (0-100)
   - Get AI-generated suggestions for each category
   - Suggestions are specific and actionable

### 3. Dashboard Features

1. **View Website History**
   - See all previously analyzed websites
   - View latest performance scores for each
   - See average performance across all sites

2. **Search**
   - Search by website URL or name (case-insensitive)
   - Results update in real-time as you type

3. **Sort Options**
   - **Newest First**: Recently analyzed websites first
   - **Highest Score**: Best performing websites first
   - **Name (A-Z)**: Alphabetical by website name

4. **Filter by Performance**
   - **All**: Show all websites
   - **Excellent**: Performance scores 90+
   - **Good**: Performance scores 70-89
   - **Needs Work**: Performance scores <70

### 4. Profile Management

1. **Access Profile**
   - Click the user icon in navbar
   - Or click "My Profile" on dashboard

2. **Edit Profile**
   - Click "Edit Profile" button
   - Update name or company name
   - Click "Save Changes"

3. **Change Password**
   - Click "Edit Profile"
   - Enter new password (min 6 characters)
   - Confirm password matches
   - Click "Save Changes"

4. **Logout**
   - Click "Logout" button in profile
   - Or use logout in navbar
   - Redirects to login page

## Development

### Available Scripts

**Frontend (`frontend/` directory):**
```bash
npm run dev      # Start Vite development server with hot refresh
npm run build    # Build optimized production bundle
npm run lint     # Run ESLint to check code quality
npm run preview  # Preview production build locally
npm run typecheck # Run TypeScript type checking
```

**Backend (`backend/` directory):**
```bash
npm start        # Start Express server on PORT (default 5000)
npm run dev      # Start with nodemon for auto-reload on file changes
```

### Development Environment Setup

#### Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)
- **MongoDB for VS Code** (mongodb.mongodb-vscode)
- **REST Client** (humao.rest-client)

#### Code Quality & Style

**Frontend:**
- TypeScript strict mode for compile-time type safety
- ESLint configuration in `eslint.config.js`
- React 19 hooks with functional components
- Tailwind CSS for consistent styling
- Component folder structure with lazy loading

**Backend:**
- Express middleware for request validation
- JWT middleware for authentication
- Mongoose schemas with validation
- Error handling with try-catch blocks
- Environment variable validation on startup

#### Type Safety
```bash
# Frontend TypeScript checking
cd frontend
npm run typecheck

# Backend would use JSDoc comments for type hints
// @param {string} userId
// @returns {Promise<User>}
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Open Pull Request on GitHub
```

### Database Development

#### MongoDB Collections
- **users** - User accounts and profiles
- **websites** - Tracked websites for analysis
- **lighthouse** - Performance analysis results
- **suggestions** - AI-generated recommendations

#### Creating Indexes for Performance
```javascript
// In MongoDB shell
db.websites.createIndex({ userId: 1, createdAt: -1 })
db.lighthouse.createIndex({ projectId: 1, testedAt: -1 })
```

### Environment Variables for Development

**Backend .env (example):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-analyzer
JWT_SECRET=your_development_secret_key_change_in_production
API_KEY=your_test_gemini_api_key
CHROME_PATH=  # Leave empty for auto-detection
```

**Frontend .env (example):**
```env
VITE_API_URL=http://localhost:5000
```

### Hot Reload & Fast Refresh

- Frontend: Vite provides instant hot module replacement (HMR)
- Backend: Use `npm run dev` with nodemon for auto-restart on file changes
- No manual refresh needed during development

### Performance Profiling

**Frontend:**
```bash
# Build size analysis
npm run build -- --analyze

# Lighthouse audit
npm run preview  # Then run Lighthouse in Chrome DevTools
```

**Backend:**
```bash
# Monitor memory and CPU
node --inspect server.js
# Open chrome://inspect to debug
```

## Code Architecture

### Frontend Structure

**Page Components:**
- `pages/login.tsx` - Authentication entry point
- `pages/register.tsx` - User registration flow
- `pages/home.tsx` - Landing page
- `pages/dashboard.tsx` - Website history with S/S/F
- `pages/anaylise.tsx` - Analysis input and results display
- `pages/profile.tsx` - User account management

**Context & Hooks:**
- `context/AuthContext.tsx` - Auth state provider
- `context/useAuth.ts` - Custom hook for auth operations
- Provides user info, login, logout, register functions

**Layout Components:**
- `layout/navbar.tsx` - Navigation with auth state
- `layout/footer.tsx` - Application footer

### Backend Structure

**Routes:**
- `routes/userRoutes.js` - /register, /login, /profile endpoints
- `routes/urlRoutes.js` - /analyze endpoint with Lighthouse + AI
- `routes/data.js` - /history endpoint with aggregation

**Middleware:**
- `middleware/auth.js` - JWT verification and user extraction

**Models:**
- `model/user.js` - User schema with validation
- `model/website.js` - Website schema
- `model/lighthouse.js` - Analysis results schema

### Data Flow

```
1. User Registration
   ├─ Frontend Form → POST /api/register
   ├─ Backend Hash Password (bcrypt)
   ├─ Store User → MongoDB
   └─ Return JWT Token

2. Website Analysis
   ├─ Frontend Input URL → POST /api/analyze
   ├─ Backend Middleware (verify JWT)
   ├─ Run Lighthouse Audit
   ├─ Call Gemini AI for suggestions
   ├─ Store Results → MongoDB
   └─ Return Scores + Suggestions (JSON)

3. Dashboard View
   ├─ Frontend GET /api/dashboard/history
   ├─ Backend Middleware (verify JWT)
   ├─ Aggregate Latest Scores per Website
   ├─ Query MongoDB
   └─ Return Website Array with Latest Scores

4. Profile Update
   ├─ Frontend PUT /api/user/profile
   ├─ Backend Middleware (verify JWT)
   ├─ Validate Input
   ├─ Update MongoDB User Document
   └─ Return Success/Error
```

## Features in Detail

### 🎯 Performance Analysis
Leverages **Google Lighthouse** for comprehensive audits:
- **Performance**: Page load speed, JavaScript execution, rendering optimization
- **Accessibility**: Screen reader compatibility, keyboard navigation, color contrast
- **SEO**: Meta tags, sitemap, mobile-friendly, structured data
- **Best Practices**: HTTPS usage, library vulnerabilities, error logging
- Historical data storage for trend analysis

### 🤖 AI-Powered Suggestions
Powered by **Google Generative AI (Gemini Flash)**:
- Analyzes Lighthouse audit results
- Generates contextual, actionable recommendations
- Structured JSON responses with category-specific suggestions
- Prioritized recommendations based on impact
- Examples: Image optimization, lazy loading, code splitting strategies

### 👤 User Profile Management
Complete account control:
- **View Profile**: Display user information (name, email, company)
- **Edit Profile**: Update name and company name
- **Change Password**: Securely update with bcrypt hashing
- **Session Management**: Logout invalidates JWT token
- Validation: Name minimum 2 chars, password minimum 6 chars

### 📊 Advanced Dashboard
Website history with powerful filtering:
- **Real-time Search**: Filter by website URL or name instantly
- **Multi-level Sorting**:
  - By Date: Newest analyses first
  - By Performance Score: Highest scores first
  - By Name: Alphabetical A-Z ordering
- **Performance Filtering**:
  - Excellent: 90+ score (green)
  - Good: 70-89 score (yellow)
  - Needs Work: <70 score (red)
- **Aggregate Metrics**: Average performance across all websites
- **Website Cards**: Display name, URL, latest scores, total analysis count
- Responsive grid layout for desktop and mobile

### 🔐 Secure Authentication
Production-grade security:
- **JWT Tokens**: 1-hour expiry for stateless authentication
- **Password Hashing**: bcrypt with salt rounds for secure storage
- **Middleware Protection**: authMiddleware on all protected routes
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Server and client-side validation
- **Secure Token Storage**: localStorage with automatic cleanup on logout

### 📈 Historical Tracking & Analytics
Comprehensive data retention:
- All website analyses stored in MongoDB
- Easy comparison of performance improvements
- Track optimization progress over time
- Export-ready data structure for future features

## Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Failed
**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
- Ensure MongoDB is running: `mongod` (local) or check MongoDB Atlas status
- Verify `MONGODB_URI` in `.env` file matches your setup
- Check network connectivity and firewall settings
- For MongoDB Atlas, ensure your IP is whitelisted in IP Access List

```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017"
```

#### 2. Google API Key Invalid
**Error**: `API key not valid for Google Generative AI`

**Solutions:**
- Verify `API_KEY` in `.env` matches your Google Generative AI API key
- Ensure API key has Google AI Studio access enabled
- Check API key hasn't expired or been revoked
- Regenerate a new key from https://ai.google.dev/

```bash
# Verify .env is loaded
echo $API_KEY  # Should show your key (development only!)
```

#### 3. JWT Token Verification Failed
**Error**: `secretOrPublicKey is not valid key material`

**Solutions:**
- Ensure `JWT_SECRET` in `.env` is a valid string
- Check auth middleware is using named import: `import { JWT_SECRET } from "../config.js"`
- Verify JWT_SECRET is same in config.js and backend/.env
- Clear browser localStorage (old tokens from previous keys)

#### 4. Lighthouse Analysis Fails
**Error**: `Chrome process crashed` or `Cannot find Chrome executable`

**Solutions:**
- Install Chrome/Chromium:
  - macOS: `brew install google-chrome`
  - Linux: `sudo apt-get install chromium-browser`
  - Windows: Download from https://www.google.com/chrome/
- Set `CHROME_PATH` in `.env` if auto-detection fails:
  ```env
  # macOS
  CHROME_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
  
  # Linux
  CHROME_PATH=/usr/bin/chromium-browser
  
  # Windows
  CHROME_PATH=C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe
  ```
- Verify website is publicly accessible (Lighthouse can reach it)
- Check if target website blocks automated testing

#### 5. Port Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port 5000
# macOS/Linux
lsof -i :5000

# Windows PowerShell
Get-NetTCPConnection -LocalPort 5000 | Stop-Process -Force

# Use different port
PORT=3001 npm start
```

#### 6. CORS Errors in Frontend
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Verify `VITE_API_URL` in frontend `.env` is correct
- Check server.js has CORS middleware enabled
- Ensure backend server is running
- Check Authorization header is properly set in fetch requests

```typescript
// Correct fetch with auth
fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

#### 7. TypeScript Compilation Errors
**Error**: `Type errors in React components`

**Solutions:**
- Run type checking: `npx tsc --noEmit`
- Update TypeScript: `npm install --save-dev typescript@latest`
- Check interface definitions match API responses
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

#### 8. Docker Compose Build Fails
**Error**: `service "backend" build failed` or similar

**Solutions:**
```bash
# Clean up Docker
docker-compose down
docker system prune -a
docker volume prune

# Rebuild images
docker-compose build --no-cache
docker-compose up
```

### Debug Mode

Enable detailed logging:

**Backend (server.js):**
```javascript
// Add before route definitions
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

**Frontend (App.tsx):**
```typescript
// Enable React strict mode for development warnings
<React.StrictMode>
  <BrowserRouter>...</BrowserRouter>
</React.StrictMode>
```

### Getting Help

If issues persist:
1. Check console logs for specific error messages
2. Verify all `.env` variables are set correctly
3. Review API key permissions and quotas
4. Check MongoDB connection and collections exist
5. Ensure Node.js and npm versions are up to date
6. Open an issue on GitHub with error logs and reproduction steps

## Performance & Optimization

- Frontend optimized with Vite's fast refresh
- Lazy loading of components with React Router
- API caching where appropriate
- Database indexes on frequently queried fields
- Nginx reverse proxy for static asset compression

## Security

- JWT tokens for authentication
- Password hashing with bcrypt
- Environment variables for sensitive data
- CORS configuration for frontend-backend communication
- Input validation on both frontend and backend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation

## Roadmap

### Completed ✅
- [x] Core Lighthouse performance analysis
- [x] JWT authentication system
- [x] User registration and login
- [x] User profile management (view, edit, password change)
- [x] Dashboard with website history
- [x] Advanced search and filtering
- [x] Multi-level sorting (date, score, name)
- [x] AI-powered suggestions (Gemini integration)
- [x] MongoDB data persistence
- [x] Docker containerization

### Planned Features 🚀
- [ ] Batch analysis scheduling
- [ ] Performance comparison tool (before/after)
- [ ] Export reports (PDF/Excel format)
- [ ] Team collaboration features
- [ ] Analytics dashboard with charts
- [ ] Email notifications for analysis results
- [ ] API rate limiting and quota management
- [ ] Two-factor authentication (2FA)
- [ ] Mobile app (React Native)
- [ ] Custom alert thresholds
- [ ] Performance trend analysis
- [ ] Historical comparison graphs
- [ ] Browser extension for quick analysis
- [ ] Webhook integrations (Slack, Discord)
- [ ] Multi-language support

### InProgress 🔄
- [ ] Performance benchmarking against industry standards

## Acknowledgments

- [Google Lighthouse](https://github.com/GoogleChrome/lighthouse) - Comprehensive web audit tool
- [Google Generative AI](https://ai.google.dev) - Gemini Flash for intelligent suggestions
- [Google Chrome Launcher](https://github.com/GoogleChrome/chrome-launcher) - Browser automation
- [Express.js](https://expressjs.com) - Fast and minimalist web framework
- [React 19](https://react.dev) - Modern JavaScript UI library
- [MongoDB](https://www.mongodb.com) - NoSQL database
- [Vite](https://vitejs.dev) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Lucide React](https://lucide.dev) - Beautiful icon library
- [JWT](https://jwt.io) - Secure authentication mechanism
- [bcrypt](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- Open-source community for contributions and feedback

---

**Last Updated**: January 2025

For the latest updates and documentation, visit the [project repository](https://github.com/yourusername/AI-Website-Performance-Analyzer).

## Contributors

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Changelog

### v1.0.0 (Current)
- Initial release with core features
- Profile page and dashboard enhancements
- Google Generative AI integration
- Docker support for easy deployment
