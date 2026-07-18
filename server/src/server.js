import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import config
import connectDB from './config/database.js';
import { isUsingFileStorage } from './config/database.js';
import { seedTestUsers } from './utils/seedTestUsers.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import geocodingRoutes from './routes/geocodingRoutes.js';

// Load environment variables
dotenv.config();

// Get directory name (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to database and seed test users
connectDB().then(() => {
  // Seed test users if using file storage
  if (isUsingFileStorage()) {
    seedTestUsers();
  }
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Make io accessible to routes
app.set('io', io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/geocoding', geocodingRoutes);

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Nagar Setu API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'POST /api/auth/reset-password',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password'
      },
      complaints: {
        submit: 'POST /api/complaints',
        getAll: 'GET /api/complaints',
        getOne: 'GET /api/complaints/:id',
        myComplaints: 'GET /api/complaints/user/my-complaints',
        updateStatus: 'PATCH /api/complaints/:id/status',
        assign: 'PATCH /api/complaints/:id/assign',
        addNote: 'POST /api/complaints/:id/notes',
        heatmap: 'GET /api/complaints/heatmap'
      }
    }
  });
});

// Rate limiting for API routes
app.use('/api', apiLimiter);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  // Join complaint room
  socket.on('join_complaint', (complaintId) => {
    socket.join(`complaint_${complaintId}`);
    console.log(`Socket ${socket.id} joined complaint_${complaintId}`);
  });

  // Leave complaint room
  socket.on('leave_complaint', (complaintId) => {
    socket.leave(`complaint_${complaintId}`);
    console.log(`Socket ${socket.id} left complaint_${complaintId}`);
  });

  // Join user room for notifications
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  // Typing indicator
  socket.on('typing', ({ complaintId, userName }) => {
    socket.to(`complaint_${complaintId}`).emit('user_typing', { userName });
  });

  // Stop typing
  socket.on('stop_typing', ({ complaintId }) => {
    socket.to(`complaint_${complaintId}`).emit('user_stopped_typing');
  });

  // New message
  socket.on('send_message', (data) => {
    socket.to(`complaint_${data.complaintId}`).emit('new_message', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in controllers
export { io };

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏛️  Nagar Setu - Smart Complaint Redressal System     ║
║                                                           ║
║   Server running in ${process.env.NODE_ENV || 'development'} mode               ║
║   Port: ${PORT}                                          ║
║   API: http://localhost:${PORT}/api                      ║
║   Health: http://localhost:${PORT}/health               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

export default app;
