# Nagar Setu - Installation & Setup Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v7.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Git** - [Download](https://git-scm.com/)
- **Docker & Docker Compose** (optional, for containerized deployment)

## 🚀 Quick Start (Development)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/nagar-setu.git
cd nagar-setu
```

### Step 2: Setup Backend

```bash
cd server
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Update MongoDB URI, JWT secrets, email credentials, etc.
```

**Important Environment Variables to Configure:**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Strong secret key for JWT (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `JWT_REFRESH_SECRET`: Another strong secret for refresh tokens
- `SMTP_USER` & `SMTP_PASS`: Email credentials for sending emails
- `CLIENT_URL`: Frontend URL (default: http://localhost:5173)

Start the backend server:
```bash
npm run dev
```

Backend will run on: http://localhost:5000

### Step 3: Setup AI Service

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start AI service
uvicorn app.main:app --reload --port 8000
```

AI Service will run on: http://localhost:8000

**Note:** First run will download ML models (~500MB). This may take time.

### Step 4: Setup Frontend

```bash
cd client
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

### Step 5: Seed Database (Optional)

Create initial data including admin user and sample departments:

```bash
cd server
npm run seed
```

**Default Admin Credentials:**
- Email: admin@nagarsetu.gov.in
- Password: Admin@123456

⚠️ **IMPORTANT:** Change these credentials immediately after first login in production!

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- AI Service: http://localhost:8000
- MongoDB: localhost:27017

### Individual Docker Builds

**Backend:**
```bash
cd server
docker build -t nagar-setu-backend .
docker run -p 5000:5000 --env-file .env nagar-setu-backend
```

**AI Service:**
```bash
cd ai-service
docker build -t nagar-setu-ai .
docker run -p 8000:8000 nagar-setu-ai
```

**Frontend:**
```bash
cd client
docker build -t nagar-setu-frontend .
docker run -p 5173:80 nagar-setu-frontend
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows (as service)
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

3. MongoDB will be available at: mongodb://localhost:27017

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Get connection string
5. Update `MONGODB_URI` in `.env`

Example Atlas URI:
```
mongodb+srv://username:password@cluster.mongodb.net/nagar-setu?retryWrites=true&w=majority
```

## 📧 Email Configuration

The system sends emails for:
- Welcome messages
- Complaint confirmations
- Status updates
- Password resets
- Officer notifications

### Gmail Configuration

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate password for "Mail" on "Other device"
3. Update `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### Other Email Providers

**SendGrid:**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**AWS SES:**
```
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

## 🔐 Security Setup

### 1. Generate Secure JWT Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add these to your `.env` file.

### 2. Configure CORS

Update `CLIENT_URL` in backend `.env` to match your frontend URL.

For production, update CORS settings in `server/src/server.js`:
```javascript
app.use(cors({
  origin: ['https://your-production-domain.com'],
  credentials: true
}));
```

### 3. Enable HTTPS

For production, always use HTTPS:
- Use a reverse proxy (Nginx, Apache)
- Get SSL certificate (Let's Encrypt)
- Update environment variables

## 🧪 Testing

### Backend Tests
```bash
cd server
npm run test
```

### Frontend Tests
```bash
cd client
npm run test
```

## 📊 Monitoring & Logging

### Development Logs

Backend logs are displayed in console using Morgan.

### Production Logging

Consider using:
- **Winston** for structured logging
- **PM2** for process management
- **New Relic** or **Datadog** for APM

## 🔄 Database Migrations

### Creating Initial Collections

Collections are created automatically on first use. To manually ensure indexes:

```javascript
// Run in MongoDB shell or via script
use nagar_setu

// Create indexes
db.complaints.createIndex({ "location.coordinates": "2dsphere" })
db.complaints.createIndex({ "complaintId": 1 }, { unique: true })
db.complaints.createIndex({ "citizen": 1 })
db.users.createIndex({ "email": 1 }, { unique: true })
```

## 🚢 Production Deployment

### Environment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure production MongoDB
- [ ] Set up email service
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Update CORS origins
- [ ] Change default admin credentials

### Deployment Platforms

**Backend Options:**
- AWS EC2 / ECS
- DigitalOcean Droplets
- Heroku
- Railway
- Google Cloud Run

**Frontend Options:**
- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

**AI Service Options:**
- AWS Lambda (with container support)
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

### Sample Production Setup (Vercel + Railway)

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

cd client
vercel

# Set environment variables in Vercel dashboard
```

**Backend (Railway):**
1. Connect GitHub repository to Railway
2. Add environment variables
3. Deploy from `server` directory

**AI Service (Railway/Cloud Run):**
1. Deploy using Docker
2. Configure environment variables
3. Note the service URL

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: Authentication failed`
- Check username/password in connection string
- Verify database user has correct permissions
- For Atlas, check IP whitelist

### Port Already in Use

```bash
# Find process using port
# Windows:
netstat -ano | findstr :5000

# macOS/Linux:
lsof -i :5000

# Kill process
# Windows:
taskkill /PID <PID> /F

# macOS/Linux:
kill -9 <PID>
```

### AI Service Model Download Issues

If model download fails:
1. Check internet connection
2. Manually download models:
   ```python
   from transformers import AutoTokenizer, AutoModel
   AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
   AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
   ```

### Frontend Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📱 Mobile Access

The application is responsive and works on mobile devices. For native mobile apps, consider:
- React Native (code reuse with React)
- Flutter (cross-platform)
- PWA (Progressive Web App) - Already supported!

To enable PWA:
1. Add service worker
2. Create manifest.json
3. Configure caching strategies

## 🔧 Advanced Configuration

### Custom Domain Setup

1. **Frontend (Vercel):**
   - Go to Project Settings → Domains
   - Add custom domain
   - Update DNS records

2. **Backend:**
   - Set up reverse proxy (Nginx)
   - Configure SSL
   - Update CORS origins

### Load Balancing

For high traffic:
- Use PM2 cluster mode
- Set up Nginx load balancer
- Consider Kubernetes

### Database Scaling

- Enable MongoDB replica sets
- Set up read replicas
- Implement caching (Redis)

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Socket.IO Documentation](https://socket.io/docs/)

## 🤝 Support

For issues:
1. Check existing issues on GitHub
2. Read troubleshooting section
3. Check logs for error messages
4. Create new issue with:
   - Environment details
   - Error messages
   - Steps to reproduce

## 📄 License

This project is developed for educational purposes.

---

**Happy Coding! 🎉**
