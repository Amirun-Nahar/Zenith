# Zenith - AI-Powered Academic Hub

A modern, comprehensive web application designed to empower students with AI-driven tools and intuitive productivity features. Built with a focus on academic success and personal development.

## 🌟 Key Features

### 📊 Core Academic Tools
- **Smart Dashboard**: Personalized overview of your academic progress, upcoming tasks, and AI-driven insights
- **Class Management**: Organize courses, assignments, and academic schedules
- **Study Planner**: Intelligent task organization and deadline management
- **Focus Mode**: Enhanced productivity with Pomodoro timer and distraction blocking
- **Mind Mapping**: Visual learning and concept organization tools
- **Budget Tracker**: Student finance management and expense tracking

### 🤖 AI-Powered Features
- **AI Study Buddy**: Interactive chat assistant for academic support
- **Smart Q&A Generator**: AI-generated practice questions and study materials
- **Voice Notes**: Speech-to-text note-taking with AI summarization
- **Study Insights**: Personalized learning analytics and recommendations
- **Smart Scheduling**: AI-optimized study schedules based on your learning patterns
- **Budget Insights**: AI-driven financial advice and spending pattern analysis

### 💫 User Experience
- **Modern UI**: Clean, responsive design 
- **Real-time Updates**: Instant synchronization across devices
- **Accessibility**: Voice input support and keyboard navigation
- **Cross-platform**: Seamless experience across desktop and mobile devices

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Context API
- **Routing**: React Router v6
- **Authentication**: JWT with secure cookie fallback

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication
- **API**: RESTful architecture with comprehensive endpoints

### AI Integration
- **Engine**: Google Gemini AI
- **Features**: 
  - Natural Language Processing
  - Content Generation
  - Smart Analytics
  - Voice Processing

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - User logout

### Academic Management
- `GET /api/classes` - Retrieve classes
- `POST /api/classes` - Create class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Remove class

### Tasks & Planning
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### AI Features
- `POST /api/ai/chat` - AI study buddy interaction
- `POST /api/ai/generate-questions` - Create practice questions
- `GET /api/ai/insights` - Get personalized insights
- `POST /api/ai/voice-notes` - Process voice recordings

### Financial Management
- `GET /api/transactions` - Get transactions
- `POST /api/transactions` - Record transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Remove transaction

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Google Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zenith.git
cd zenith
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
```bash
# Backend (.env)
cp server/.env.example server/.env

# Frontend (.env)
cp frontend/.env.example frontend/.env
```

4. Start the development servers:
```bash
# Backend
cd server
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🌐 Deployment

The application supports multiple deployment platforms:

- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render
- **Database**: MongoDB Atlas

Detailed deployment instructions are available in:
- `DEPLOYMENT.md`
- `VERCEL_DEPLOYMENT.md`
- `FIREBASE_SETUP.md`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🆘 Support

For support:
- Create an issue in the repository
- Contact: support@zenith-app.com

---

Built with ❤️ for students, by students. Empowering academic success through AI innovation.