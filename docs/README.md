# 🏛️ Nagar Setu - Smart Complaint Redressal System

A modern, AI-powered civic complaint management system for smart cities.

[![Status](https://img.shields.io/badge/status-production--ready-success)](https://github.com)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Nagar Setu is a comprehensive complaint management system that enables citizens to report civic issues, track their resolution, and communicate with government officials. The platform uses AI to automatically detect the appropriate department for each complaint and prioritize issues based on urgency.

### Key Highlights

✅ **AI-Powered Department Detection** - Automatically routes complaints to the right department  
✅ **Real-Time Tracking** - Citizens can track complaint status in real-time  
✅ **Interactive Heatmap** - Visualize complaint distribution across the city  
✅ **Role-Based Access** - Separate portals for Citizens, Officers, and Admins  
✅ **Mobile Responsive** - Works seamlessly on all devices  
✅ **Dark Mode** - Easy on the eyes with automatic theme switching  

---

## ✨ Features

### For Citizens
- 📝 Submit complaints with photos/videos
- 🔍 Track complaint status with unique ID
- 📍 Auto-detect location using GPS
- 🤖 AI suggests appropriate department
- 💬 Chat with assigned officers
- 📧 Email notifications for status updates
- 🗺️ View city-wide complaint heatmap

### For Officers
- 📋 View assigned complaints
- ✅ Accept/reject complaints
- 🔄 Update complaint status
- 💬 Communicate with citizens
- 📊 Track performance metrics
- 🔔 Real-time notifications

### For Admins
- 👥 Manage users and roles
- 🏢 Manage departments
- 📈 View analytics and reports
- 🔍 Monitor system performance
- 📊 Generate detailed reports
- ⚙️ Configure system settings

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Framer Motion** - Smooth animations
- **Leaflet** - Interactive maps
- **Vite** - Lightning-fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **Nodemailer** - Email service

### AI Service
- **Python 3.11+** - Programming language
- **FastAPI** - Modern API framework
- **Transformers** - NLP models
- **scikit-learn** - ML algorithms
- **NLTK** - Text processing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server and reverse proxy

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nagar-setu.git
   cd nagar-setu
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   npm run dev
   ```

3. **Setup AI Service**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload --port 8000
   ```

4. **Setup Frontend**
   ```bash
   cd client
   npm install
   cp .env.example .env
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:8000

### Using Docker (Recommended)

```bash
docker-compose up --build
```

That's it! All services will start automatically.

---

## 📁 Project Structure

```
nagar-setu/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Helper functions
│   └── package.json
│
├── ai-service/            # Python AI service
│   ├── app/
│   │   ├── services/     # AI services
│   │   └── utils/        # Utility functions
│   └── requirements.txt
│
├── docs/                  # Documentation
│   ├── setup-guides/     # Installation guides
│   ├── features/         # Feature documentation
│   ├── fixes/            # Bug fixes
│   └── status/           # Project status
│
└── docker-compose.yml    # Docker orchestration
```

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

### Setup Guides
- [Installation Guide](docs/setup-guides/INSTALLATION.md)
- [Quick Start Guide](docs/setup-guides/QUICK_START_GUIDE.md)
- [MongoDB Setup](docs/setup-guides/MONGODB_SETUP.md)
- [Google Maps Setup](docs/setup-guides/GOOGLE_MAPS_SETUP.md)

### Features
- [Complete Feature List](docs/features/FEATURES_IMPLEMENTED.md)
- [AI Department Detection](docs/features/AI_CATEGORY_SUGGESTION.md)
- [Demo Script](docs/features/DEMO_SCRIPT.md)

### Troubleshooting
- [Common Issues and Fixes](docs/fixes/)

### Project Status
- [Current Status](docs/status/CURRENT_STATUS_SUMMARY.md)
- [Completion Report](docs/status/PROJECT_100_PERCENT_COMPLETE.md)

---

## 📸 Screenshots

### Landing Page
Beautiful, modern landing page with smooth animations.

### Citizen Dashboard
Clean interface showing complaint statistics and recent activity.

### Submit Complaint
Multi-step form with AI-powered department detection and interactive map.

### Admin Dashboard
Comprehensive analytics with charts and real-time metrics.

### Heatmap
Interactive map showing complaint distribution across the city.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Developed with ❤️ by the Nagar Setu Team

---

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- All open-source libraries used in this project
- The amazing developer community

---

## 📞 Support

For support, email support@nagarsetu.gov.in or open an issue on GitHub.

---

## 🌟 Star This Repo!

If you find this project useful, please give it a ⭐ on GitHub!

---

**Made in India 🇮🇳 for Better Governance**
