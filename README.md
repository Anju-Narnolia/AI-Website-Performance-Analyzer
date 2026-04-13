# AI Website Performance Analyzer

A comprehensive web application that analyzes website performance using Google Lighthouse and provides AI-powered optimization suggestions powered by OpenAI.

## Features

- **Performance Analysis**: Comprehensive website performance audits using Google Lighthouse
- **AI Suggestions**: Intelligent recommendations for performance optimization powered by OpenAI
- **User Authentication**: Secure registration and login system with JWT tokens
- **Performance Tracking**: Track and analyze performance metrics over time
- **Responsive Design**: Modern, mobile-friendly user interface built with React and Tailwind CSS
- **RESTful API**: Well-organized backend API with Express.js
- **Docker Support**: Containerized deployment with Docker Compose for easy setup

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Performance Analysis**: Google Lighthouse
- **AI Integration**: OpenAI API
- **Browser Automation**: Chrome Launcher

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React & React Icons
- **HTTP Client**: Fetch API

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx

## Project Structure

```
AI-Website-Performance-Analyzer/
├── backend/                    # Express.js backend
│   ├── config.js              # Configuration settings
│   ├── server.js              # Main server entry point
│   ├── package.json           # Backend dependencies
│   ├── Dockerfile             # Backend container config
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── model/
│   │   ├── user.js            # User schema & model
│   │   ├── website.js         # Website schema & model
│   │   └── lighthouse.js      # Lighthouse results schema
│   ├── routes/
│   │   ├── userRoutes.js      # User management endpoints
│   │   ├── urlRoutes.js       # Website analysis endpoints
│   │   └── data.js            # Performance data endpoints
│   └── suggesion/
│       └── aiSuggestion.js    # AI suggestion engine
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # React entry point
│   │   ├── pages/
│   │   │   ├── login.tsx      # Login page
│   │   │   ├── register.tsx   # Registration page
│   │   │   ├── home.tsx       # Home page
│   │   │   ├── dashboard.tsx  # Dashboard page
│   │   │   ├── anaylise.tsx   # Analysis page
│   │   │   └── layout/
│   │   │       ├── navbar.tsx # Navigation component
│   │   │       └── footer.tsx # Footer component
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # Auth state management
│   │   │   └── useAuth.ts         # Custom auth hook
│   │   └── assets/            # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── Dockerfile             # Frontend container config
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── index.html             # HTML entry point
├── nginx/                      # Nginx configuration
│   └── Dockerfile             # Nginx container config
├── docker-compose.yml         # Multi-container orchestration
└── README.md                  # This file
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance)
- **Docker** & **Docker Compose** (for containerized setup)
- **OpenAI API Key** (for AI suggestions feature)
- **Google Chrome/Chromium** (for Lighthouse analysis)

## Installation

### Option 1: Local Development

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Website-Performance-Analyzer
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-analyzer
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

#### 4. Start Development Servers

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Option 2: Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: `http://localhost`
- Backend API: `http://localhost/api`

## Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-analyzer
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_api_key
CHROME_PATH=/path/to/chrome  # Optional, auto-detected if not set
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Website Analysis
- `POST /api/analyze` - Submit website for analysis
- `GET /api/analyze/:id` - Get analysis results
- `GET /api/analyses` - List all user analyses

### Performance Data
- `GET /api/data/performance` - Get performance metrics
- `GET /api/data/suggestions/:id` - Get AI suggestions

## Usage

1. **Register**: Create a new account on the registration page
2. **Login**: Log in with your credentials
3. **Analyze**: Enter a website URL to perform performance analysis
4. **View Results**: Review Lighthouse scores and metrics
5. **Get Suggestions**: Receive AI-powered optimization recommendations
6. **Track Progress**: Monitor performance improvements over time

## Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

**Backend:**
```bash
npm start        # Start server
npm run dev      # Start with nodemon (if configured)
```

### Code Quality

- Frontend uses **ESLint** for code linting
- TypeScript for type safety
- React best practices with hooks and functional components

## Features in Detail

### Performance Analysis
- Runs Google Lighthouse audits on any website
- Analyzes performance, accessibility, best practices, and SEO
- Stores historical analysis data

### AI Suggestions
- Powered by OpenAI GPT models
- Provides contextual optimization recommendations
- Tailored to specific performance issues

### User Authentication
- JWT-based secure authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

### Dashboard
- Visual performance metrics
- Historical trends and comparisons
- Quick access to suggestions and reports

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env` file
- Check network connectivity

### OpenAI API Error
- Verify `OPENAI_API_KEY` is correct
- Check API key permissions and quota
- Ensure key is not expired

### Lighthouse Analysis Fails
- Ensure Chrome/Chromium is installed
- Check if target website is accessible
- Verify Chrome path in configuration

### Port Already in Use
```bash
# Kill process on port (Windows PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Or use different port
PORT=3001 npm start
```

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

- [ ] Dashboard analytics and reporting
- [ ] Batch analysis scheduling
- [ ] Performance comparison tool
- [ ] Export reports (PDF/Excel)
- [ ] Team collaboration features
- [ ] Advanced filtering and search
- [ ] Mobile app

## Acknowledgments

- [Google Lighthouse](https://github.com/GoogleChrome/lighthouse) for performance auditing
- [OpenAI](https://openai.com) for AI capabilities
- [Express.js](https://expressjs.com) framework
- [React](https://react.dev) library
- Open-source community

---

**Last Updated**: April 2026

For the latest updates and documentation, visit the project repository.
