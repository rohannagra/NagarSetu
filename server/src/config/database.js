import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Flag to use file storage instead of MongoDB
let useFileStorage = false;

const connectDB = async () => {
  // Check if MongoDB URI is configured properly
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost:27017')) {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║  ⚠️  MongoDB not available - Using FILE STORAGE        ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
    console.log('📁 Data will be stored in: server/data/*.json');
    console.log('✅ App will work with file-based database');
    console.log('💡 For full features, setup MongoDB (see MONGODB_SETUP.md)\n');
    
    useFileStorage = true;
    
    // Disable Mongoose buffering to prevent timeout errors
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferTimeoutMS', 0);
    
    // Create data directory
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('✓ Created data directory\n');
    }
    
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    useFileStorage = false;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
      console.log('⚠️  Switching to file storage...');
      useFileStorage = true;
      mongoose.set('bufferCommands', false);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected - Using file storage');
      useFileStorage = true;
      mongoose.set('bufferCommands', false);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log('\n⚠️  Switching to FILE STORAGE mode');
    console.log('📁 Data saved in: server/data/');
    console.log('✅ App continues to work\n');
    useFileStorage = true;
    mongoose.set('bufferCommands', false);
  }
};

export const isUsingFileStorage = () => useFileStorage;

export default connectDB;
