# Zenith - AI-Powered Academic Hub

A comprehensive, modern web application designed to empower students with AI-driven tools and intuitive productivity features. Built with a focus on academic success, personal development, and financial management, Zenith combines cutting-edge AI technology with user-friendly design to create the ultimate student companion.

## Live Link: https://zenith-academic-hub.netlify.app

## 🌟 Overview

Zenith is a full-stack academic productivity platform that leverages Google Gemini AI to provide intelligent insights, automated scheduling, and personalized study recommendations. The application features a modern, responsive design with UNDP blue and white color scheme, ensuring accessibility and professional aesthetics across all devices.

## 🚀 Key Features

### 📊 Core Academic Tools

#### Smart Dashboard
- **Real-time Overview**: Comprehensive view of academic progress, upcoming classes, and financial status
- **Exam Countdown**: Customizable countdown timers for important exams and deadlines
- **Next Class Display**: Intelligent scheduling showing your next upcoming class with instructor details
- **Budget Snapshot**: Quick financial overview with income, expenses, and balance tracking
- **AI Insights Integration**: Personalized recommendations and study analytics

#### Class Management System
- **Course Organization**: Add and manage multiple classes with detailed information
- **Schedule Integration**: Weekly class schedules with day, time, and instructor tracking
- **Class Analytics**: Track attendance and performance across different subjects
- **Instructor Management**: Store and manage instructor contact information

#### Intelligent Study Planner
- **Task Management**: Create, organize, and track academic tasks and assignments
- **Priority System**: High, medium, and low priority classification for effective task management
- **Deadline Tracking**: Visual deadline management with urgency indicators
- **Subject Organization**: Categorize tasks by subject for better organization
- **Progress Monitoring**: Track completion rates and study patterns

#### Focus Mode (Pomodoro Timer)
- **Customizable Sessions**: 25-minute work sessions with 5-minute breaks
- **Productivity Pet**: Gamified experience with a growing plant that represents your focus sessions
- **Session Tracking**: Persistent storage of completed focus sessions
- **Visual Timer**: Large, clear countdown display with session status indicators
- **Break Management**: Automatic transition between work and break periods

#### AI-Powered Mind Mapping
- **Topic Generation**: AI creates comprehensive mind maps from any subject or topic
- **Visual Learning**: Interactive node-based concept organization
- **Customizable Structure**: Adjustable difficulty levels and node counts
- **Study Integration**: Export mind maps for offline study sessions
- **Concept Connections**: Visual representation of relationships between ideas

#### Comprehensive Budget Tracker
- **Transaction Management**: Add, edit, and categorize income and expenses
- **Category System**: Predefined categories (food, transport, books, entertainment, others)
- **Financial Analytics**: Visual spending patterns and category breakdowns
- **Monthly Summaries**: Automatic calculation of income, expenses, and savings
- **Balance Tracking**: Real-time financial health monitoring

### 🤖 AI-Powered Features

#### AI Study Buddy (Chat Assistant)
- **Interactive Chat**: Real-time conversation with AI for academic support
- **Context-Aware Responses**: AI understands your study context and provides relevant advice
- **Study Techniques**: Personalized recommendations for effective learning methods
- **Motivation Support**: Encouraging messages and study motivation tips
- **Quick Suggestions**: Pre-defined conversation starters for common study topics

#### Smart Study Recommendations
- **Performance Analysis**: AI analyzes your task completion patterns and study habits
- **Subject Focus**: Identifies subjects that need more attention based on completion rates
- **Time Optimization**: Recommends optimal study hours based on your productivity patterns
- **Schedule Gaps**: Identifies free time slots for focused study sessions
- **Priority Alerts**: Highlights urgent tasks and upcoming deadlines

#### AI Schedule Optimization
- **Intelligent Planning**: AI automatically schedules tasks based on class times and priorities
- **Time Slot Analysis**: Finds optimal study periods within your existing schedule
- **Priority-Based Scheduling**: High-priority tasks scheduled during peak productivity hours
- **Conflict Resolution**: Automatically avoids scheduling conflicts with classes
- **Efficiency Recommendations**: Suggests improvements to your study schedule

#### Budget AI Insights
- **Spending Pattern Analysis**: AI identifies spending trends and potential issues
- **Category Analysis**: Detailed breakdown of spending by category with recommendations
- **Financial Health Assessment**: Comprehensive evaluation of your financial situation
- **Savings Optimization**: Recommendations for improving savings rates
- **Goal Setting**: AI-assisted financial goal creation and tracking

#### Voice Notes Integration
- **Speech-to-Text**: Convert voice recordings to text for easy note-taking
- **AI Summarization**: Automatic summarization of voice notes for quick review
- **Study Integration**: Voice notes can be used to generate mind maps and study materials
- **Accessibility**: Hands-free note-taking for improved accessibility

#### Smart Q&A Generator
- **Practice Questions**: AI generates relevant practice questions based on your study materials
- **Multiple Choice Quizzes**: Automated quiz creation with varying difficulty levels
- **Flashcard Generation**: AI creates study flashcards from your notes and topics
- **Customizable Content**: Adjustable question count and difficulty settings
- **Study Material Integration**: Works with your existing notes and class materials

### 💫 User Experience & Design

#### Modern, Responsive Interface
- **UNDP Color Scheme**: Professional blue and white design following UNDP branding guidelines
- **Mobile-First Design**: Optimized for all screen sizes from mobile to desktop
- **Touch-Friendly**: Large buttons and intuitive touch interactions
- **Accessibility Features**: High contrast, keyboard navigation, and screen reader support
- **Dark/Light Theme**: Adaptive theming based on user preferences

#### Real-Time Synchronization
- **Cross-Device Sync**: Seamless data synchronization across all devices
- **Offline Support**: Core functionality available without internet connection
- **Auto-Save**: Automatic saving of user data and preferences
- **Conflict Resolution**: Intelligent handling of data conflicts during synchronization

#### Performance & Reliability
- **Fast Loading**: Optimized bundle sizes and lazy loading for quick page loads
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Data Validation**: Client and server-side validation for data integrity
- **Security**: JWT-based authentication with secure cookie fallback

## 🛠 Technology Stack

### Frontend Architecture
- **Framework**: React 18.2.0 with modern hooks and functional components
- **Build Tool**: Vite 7.1.4 for fast development and optimized production builds
- **Styling**: Tailwind CSS 3.3.2 with custom UNDP theme and responsive design
- **State Management**: React Context API for global state management
- **Routing**: React Router v6.4.0 with protected routes and lazy loading
- **Authentication**: JWT tokens with secure HTTP-only cookie fallback
- **Animations**: Framer Motion 12.23.12 for smooth UI transitions
- **Development**: ESLint for code quality and PostCSS for CSS processing

### Backend Architecture
- **Runtime**: Node.js with Express 5.1.0 framework
- **Database**: MongoDB with Mongoose 8.18.0 ODM for data modeling
- **Authentication**: JWT-based secure authentication with bcrypt password hashing
- **API Design**: RESTful architecture with comprehensive error handling
- **Middleware**: CORS, cookie parsing, and custom authentication middleware
- **Development**: Nodemon for development auto-restart and cross-env for environment variables

### AI Integration & Services
- **AI Engine**: Google Gemini AI (gemini-1.5-flash model)
- **AI Features**:
  - Natural Language Processing for chat interactions
  - Content Generation (mind maps, quizzes, flashcards)
  - Smart Analytics and pattern recognition
  - Voice processing and text summarization
  - Intelligent scheduling and task prioritization

### Database Schema
- **User Model**: Secure user authentication with email validation and password hashing
- **Class Model**: Course management with scheduling and instructor information
- **Task Model**: Academic task tracking with priority and deadline management
- **Transaction Model**: Financial transaction tracking with categorization
- **Data Relationships**: User-centric design with proper data isolation and security

### Security & Performance
- **Authentication**: JWT tokens with secure cookie fallback
- **Data Validation**: Client and server-side validation with Mongoose schemas
- **CORS Configuration**: Secure cross-origin resource sharing
- **Password Security**: bcrypt hashing with salt rounds
- **API Security**: Protected routes with authentication middleware
- **Performance**: Optimized database queries and efficient data structures

## 📡 API Documentation

### Authentication Endpoints

#### User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /api/auth/user
Authorization: Bearer jwt_token_here
```

#### User Logout
```http
POST /api/auth/logout
Authorization: Bearer jwt_token_here
```

### Academic Management Endpoints

#### Class Management
```http
# Get all classes
GET /api/classes
Authorization: Bearer jwt_token_here

# Create new class
POST /api/classes
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "subject": "Mathematics",
  "day": "Monday",
  "startTime": "09:00",
  "endTime": "10:30",
  "instructor": "Dr. Smith",
  "location": "Room 101"
}

# Update class
PUT /api/classes/:id
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "subject": "Advanced Mathematics",
  "day": "Tuesday"
}

# Delete class
DELETE /api/classes/:id
Authorization: Bearer jwt_token_here
```

### Task Management Endpoints

#### Task Operations
```http
# Get all tasks
GET /api/tasks
Authorization: Bearer jwt_token_here

# Create new task
POST /api/tasks
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "topic": "Complete calculus homework",
  "subject": "Mathematics",
  "priority": "high",
  "deadline": "2024-01-15T23:59:59Z",
  "description": "Solve problems 1-20 from chapter 5"
}

# Update task
PUT /api/tasks/:id
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "completed": true,
  "completedAt": "2024-01-14T15:30:00Z"
}

# Delete task
DELETE /api/tasks/:id
Authorization: Bearer jwt_token_here
```

### AI-Powered Endpoints

#### AI Study Buddy Chat
```http
POST /api/ai/chat
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "message": "How can I improve my study habits?",
  "context": "study"
}
```

**Response:**
```json
{
  "response": "Here are some effective study techniques...",
  "context": "study",
  "suggestions": [
    "Ask me about time management",
    "Get help with exam preparation",
    "Learn about focus techniques"
  ],
  "isAI": true
}
```

#### Study Recommendations
```http
GET /api/ai/study-recommendations
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "recommendations": [
    {
      "type": "subject",
      "priority": "high",
      "message": "Focus more on Mathematics - you've only completed 2 tasks in this subject.",
      "action": "Schedule dedicated study time for Mathematics"
    }
  ]
}
```

#### Schedule Optimization
```http
POST /api/ai/optimize-schedule
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "tasks": [
    {
      "topic": "Math homework",
      "subject": "Mathematics",
      "priority": "high",
      "deadline": "2024-01-15T23:59:59Z"
    }
  ],
  "preferences": {}
}
```

#### Mind Map Generation
```http
POST /api/ai/mindmap
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "topic": "Photosynthesis",
  "text": "Photosynthesis is the process by which plants convert light energy into chemical energy...",
  "count": 6,
  "difficulty": "medium"
}
```

#### Quiz Generation
```http
POST /api/ai/quiz
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "topic": "World War II",
  "text": "World War II was a global conflict...",
  "count": 5,
  "difficulty": "medium"
}
```

#### Flashcard Generation
```http
POST /api/ai/flashcards
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "topic": "Biology",
  "text": "Cell structure and function notes...",
  "count": 8,
  "difficulty": "easy"
}
```

#### Budget AI Insights
```http
GET /api/ai/budget-insights?month=1&year=2024
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "insights": [
    {
      "type": "warning",
      "message": "Your expenses are 85% of your income.",
      "recommendation": "Try to reduce expenses or increase income to build savings"
    }
  ],
  "summary": {
    "totalIncome": 2000,
    "totalExpense": 1700,
    "savingsRate": "15.0",
    "transactionCount": 25,
    "categoryCount": 5
  }
}
```

### Financial Management Endpoints

#### Transaction Management
```http
# Get all transactions
GET /api/transactions
Authorization: Bearer jwt_token_here

# Get monthly summary
GET /api/transactions/summary/month
Authorization: Bearer jwt_token_here

# Create transaction
POST /api/transactions
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "type": "expense",
  "amount": 25.50,
  "category": "food",
  "note": "Lunch at cafeteria",
  "date": "2024-01-15T12:30:00Z"
}

# Update transaction
PUT /api/transactions/:id
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "amount": 30.00,
  "note": "Updated lunch cost"
}

# Delete transaction
DELETE /api/transactions/:id
Authorization: Bearer jwt_token_here
```

### Q&A Endpoints

#### Q&A Management
```http
# Get Q&A items
GET /api/qa
Authorization: Bearer jwt_token_here

# Create Q&A item
POST /api/qa
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "question": "What is the capital of France?",
  "answer": "Paris",
  "subject": "Geography"
}

# Update Q&A item
PUT /api/qa/:id
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "answer": "Paris is the capital and largest city of France"
}

# Delete Q&A item
DELETE /api/qa/:id
Authorization: Bearer jwt_token_here
```

### Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 16.0.0 or higher ([Download here](https://nodejs.org/))
- **MongoDB**: Version 4.4 or higher ([Download here](https://www.mongodb.com/try/download/community))
- **Git**: For version control ([Download here](https://git-scm.com/))
- **Google Gemini API Key**: For AI features ([Get API key here](https://makersuite.google.com/app/apikey))

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/zenith.git
cd zenith
```

2. **Install dependencies:**
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Set up environment variables:**
```bash
# Backend environment setup
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/zenith
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/zenith

# JWT Secret (generate a strong secret)
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Client Origin (for CORS)
CLIENT_ORIGIN=http://localhost:5173
```

```bash
# Frontend environment setup
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env` with your configuration:
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Zenith
```

4. **Start MongoDB:**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

5. **Start the development servers:**
```bash
# Terminal 1 - Backend server
cd server
npm run dev

# Terminal 2 - Frontend development server
cd frontend
npm run dev
```

6. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/health

### Development Workflow

#### Backend Development
```bash
cd server

# Start development server with auto-reload
npm run dev

# Run production build
npm start

# Check for linting issues
npm run lint
```

#### Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Project Structure

```
zenith/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages/routes
│   │   ├── layouts/        # Layout components
│   │   ├── lib/            # Utility libraries
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets
│   └── dist/               # Production build output
├── server/                 # Node.js backend application
│   ├── models/             # MongoDB data models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Express middleware
│   └── config/             # Configuration files
├── Deploy/                 # Deployment configurations
└── docs/                   # Documentation files
```

## 🌐 Deployment

Zenith supports deployment on multiple platforms with comprehensive configuration options.

### Frontend Deployment

#### Vercel Deployment
1. **Connect your repository to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

2. **Configure environment variables in Vercel:**
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

3. **Deploy:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from frontend directory
   cd frontend
   vercel --prod
   ```

#### Netlify Deployment
1. **Build configuration (`netlify.toml`):**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy:**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli
   
   # Deploy
   cd frontend
   netlify deploy --prod --dir=dist
   ```

### Backend Deployment

#### Railway Deployment
1. **Connect to Railway:**
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `server` directory

2. **Configure environment variables:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zenith
   JWT_SECRET=your_production_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   CLIENT_ORIGIN=https://your-frontend-url.com
   ```

3. **Deploy:**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Deploy
   cd server
   railway login
   railway up
   ```

#### Render Deployment
1. **Create a new Web Service on Render**
2. **Configure build settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Set environment variables in Render dashboard**

### Database Setup

#### MongoDB Atlas (Recommended for Production)
1. **Create a MongoDB Atlas account:**
   - Visit [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Configure network access (whitelist your IP)
   - Create a database user

2. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/zenith?retryWrites=true&w=majority
   ```

3. **Update environment variables with Atlas connection string**

#### Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongod
```

### Environment Configuration

#### Production Environment Variables

**Backend (.env):**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zenith

# Security
JWT_SECRET=your_super_secure_production_jwt_secret_here
NODE_ENV=production

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
CLIENT_ORIGIN=https://your-frontend-domain.com

# Server
PORT=3000
```

**Frontend (.env):**
```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Zenith
```

### SSL/HTTPS Configuration

For production deployments, ensure SSL certificates are properly configured:

- **Vercel/Netlify**: Automatic SSL with custom domains
- **Railway/Render**: Automatic SSL for default domains
- **Custom domains**: Configure SSL certificates through your hosting provider

### Monitoring and Logging

#### Health Checks
- Backend health endpoint: `GET /health`
- Frontend health check: Built into the application

#### Error Monitoring
Consider integrating error monitoring services:
- **Sentry**: For error tracking and performance monitoring
- **LogRocket**: For session replay and debugging
- **New Relic**: For application performance monitoring

### Backup and Recovery

#### Database Backups
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/zenith" --out=backup/

# Restore from backup
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/zenith" backup/zenith/
```

#### Automated Backups
Set up automated backups through:
- **MongoDB Atlas**: Built-in backup service
- **Cron jobs**: For local MongoDB instances
- **Cloud storage**: AWS S3, Google Cloud Storage for backup storage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.


Built with ❤️ for students, by Nahar. Empowering academic success through AI innovation.
