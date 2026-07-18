# 🏛️ Nagar Setu - Smart Complaint Redressal System

A modern, AI-powered civic complaint management system that connects citizens with government departments for efficient issue resolution.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.14-blue.svg)](https://www.python.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Features
- **Multi-Role System**: Citizen, Officer, and Admin dashboards
- **Smart Complaint Management**: Submit, track, and resolve civic complaints
- **AI-Powered Features**:
  - Automatic category suggestion
  - Urgency detection
  - Sentiment analysis
  - Duplicate complaint detection
- **Real-time Updates**: Live status tracking and notifications
- **File Upload**: Support for images and videos
- **Geolocation**: Automatic location detection and manual entry
- **Public Tracking**: Track complaints without login
- **Heatmap Visualization**: Geographic complaint distribution

### 👤 Citizen Features
- Submit complaints with rich media
- Track complaint status in real-time
- Receive notifications on updates
- View complaint history
- Chat with assigned officers

### 👮 Officer Features
- View assigned complaints
- Accept/reject complaint assignments
- Update complaint status
- Add progress updates and comments
- Priority-based complaint filtering

### 👨‍💼 Admin Features
- User management (CRUD operations)
- Department management
- System-wide analytics
- Detailed reports and insights
- Export data to CSV

### 🎨 UI/UX Features
- Responsive design (mobile-friendly)
- Dark mode support
- Smooth animations
- Accessible (WCAG compliant)
- Toast notifications
- Loading states

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database (optional)
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Socket.io** - Real-time communication

### AI Service
- **Python 3.14** - Language
- **FastAPI** - API framework
- **scikit-learn** - ML models
- **NLTK** - Natural language processing
- **TF-IDF** - Text analysis
- **Uvicorn** - ASGI server

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control

---

## 📁 Project Structure

```
Nagar-Setu-Project/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API integration
│   │   ├── store/         # Redux state
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation
│   │   ├── utils/        # Helper functions
│   │   └── config/       # Configuration
│   ├── data/            # File storage (fallback)
│   └── package.json
│
├── ai-service/           # Python AI Service
│   ├── app/
│   │   ├── services/    # ML models
│   │   ├── utils/       # Text processing
│   │   └── main.py      # FastAPI app
│   └── requirements.txt
│
├── docs/                # Documentation
│   ├── features/       # Feature docs
│   ├── fixes/          # Bug fix history
│   ├── setup-guides/   # Installation guides
│   └── status/         # Progress tracking
│
└── docker-compose.yml  # Docker configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.8 or higher
- **MongoDB** (optional - app works with file storage)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/rohannagra/NagarSetu.git
cd NagarSetu
```

#### 2. Setup Backend

```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your configuration
```

**Backend Environment Variables** (`.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB (optional - app works without it)
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# Google Maps (optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### 3. Setup Frontend

```bash
cd client
npm install

# Create .env file
cp .env.example .env
```

**Frontend Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### 4. Setup AI Service

```bash
cd ai-service
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

#### 5. Start All Services

**Option A: Start Individually**

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev

# Terminal 3: AI Service
cd ai-service
uvicorn app.main:app --reload --port 8000
```

**Option B: Using Docker Compose**

```bash
docker-compose up
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **AI Service**: http://localhost:8000/docs

---

## 🔐 Usage

### Test Accounts

The system comes with pre-configured test accounts:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Citizen | citizen@test.com | password123 | Submit and track complaints |
| Officer | officer@test.com | password123 | Manage assigned complaints |
| Admin | admin@test.com | password123 | Full system access |

### Quick Start Guide

1. **Login**: Go to http://localhost:5173/login
2. **Choose Role**: Login with appropriate test account
3. **Explore Features**:
   - **Citizen**: Submit a complaint with AI suggestions
   - **Officer**: Accept and manage complaints
   - **Admin**: View analytics and manage users

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
POST   /api/auth/logout        - Logout user
POST   /api/auth/refresh       - Refresh access token
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password
PUT    /api/auth/profile       - Update profile
PUT    /api/auth/change-password - Change password
```

### Complaint Endpoints

```
POST   /api/complaints         - Submit complaint
GET    /api/complaints         - Get all complaints
GET    /api/complaints/:id     - Get single complaint
PATCH  /api/complaints/:id/status - Update status
PATCH  /api/complaints/:id/assign - Assign officer
POST   /api/complaints/:id/notes  - Add note
GET    /api/complaints/user/my-complaints - User's complaints
GET    /api/complaints/heatmap - Get heatmap data
```

### AI Service Endpoints

```
POST   /classify               - Classify complaint category
POST   /analyze-sentiment      - Analyze sentiment
POST   /detect-urgency         - Detect urgency level
POST   /find-duplicates        - Find similar complaints
```

Full API documentation: http://localhost:5000/api

---

## 🌟 Key Highlights

### File Storage Fallback
- Works **without MongoDB** setup
- Automatic fallback to JSON file storage
- Perfect for development and testing

### AI-Powered Intelligence
- Smart category prediction using ML
- Urgency detection from complaint text
- Sentiment analysis for priority
- Duplicate detection to reduce redundancy

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- XSS and CSRF protection

### Performance
- Code splitting and lazy loading
- Optimized bundle size
- Efficient API calls
- Debounced search
- Responsive images

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript for frontend
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

---

## 📝 Documentation

Detailed documentation is available in the `/docs` folder:

- **Setup Guides**: Installation and configuration
- **Features**: Detailed feature documentation
- **API Reference**: Complete API documentation
- **Troubleshooting**: Common issues and solutions

---

## 🐛 Known Issues

- Real-time updates require page refresh in file storage mode
- Complex queries limited in file storage mode
- Email notifications require SMTP configuration

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Voice complaint submission
- [ ] Chatbot integration
- [ ] Progressive Web App (PWA)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Rohan Nagra** - *Project Lead & Full Stack Developer* - [rohannagra](https://github.com/rohannagra)
- **Pragati** - *Collaborator & Developer* - [Pragati2006](https://github.com/Pragati2006)

---

## 🙏 Acknowledgments

- Inspired by government complaint management systems
- Built with modern web technologies
- AI models trained on civic complaint data
- Community feedback and contributions

---

## 📞 Support

For support, email rohannagra001@gmail.com or open an issue on GitHub.

---

## 🌐 Links

- **GitHub**: https://github.com/rohannagra/NagarSetu
- **Documentation**: See `/docs` folder
- **Issue Tracker**: https://github.com/rohannagra/NagarSetu/issues

---

**Made with ❤️ for better civic engagement**
