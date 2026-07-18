import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory
const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Database files
const DB_FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  complaints: path.join(DATA_DIR, 'complaints.json'),
  departments: path.join(DATA_DIR, 'departments.json'),
  notifications: path.join(DATA_DIR, 'notifications.json'),
};

// Initialize empty files if they don't exist
Object.entries(DB_FILES).forEach(([key, filePath]) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
});

// Helper functions
const readData = (collection) => {
  try {
    const data = fs.readFileSync(DB_FILES[collection], 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${collection}:`, error.message);
    return [];
  }
};

const writeData = (collection, data) => {
  try {
    fs.writeFileSync(DB_FILES[collection], JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${collection}:`, error.message);
    return false;
  }
};

// CRUD Operations
export const FileStorage = {
  // CREATE
  create: (collection, item) => {
    const data = readData(collection);
    const newItem = {
      ...item,
      _id: item._id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.push(newItem);
    writeData(collection, data);
    return newItem;
  },

  // READ ALL
  findAll: (collection, filter = {}) => {
    let data = readData(collection);
    
    // Apply filters
    Object.keys(filter).forEach(key => {
      if (filter[key] !== undefined) {
        data = data.filter(item => item[key] === filter[key]);
      }
    });
    
    return data;
  },

  // READ ONE
  findOne: (collection, filter) => {
    const data = readData(collection);
    return data.find(item => {
      return Object.keys(filter).every(key => item[key] === filter[key]);
    });
  },

  // READ BY ID
  findById: (collection, id) => {
    const data = readData(collection);
    return data.find(item => item._id === id || item.id === id);
  },

  // UPDATE
  update: (collection, id, updates) => {
    const data = readData(collection);
    const index = data.findIndex(item => item._id === id || item.id === id);
    
    if (index !== -1) {
      data[index] = {
        ...data[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      writeData(collection, data);
      return data[index];
    }
    return null;
  },

  // DELETE
  delete: (collection, id) => {
    const data = readData(collection);
    const filtered = data.filter(item => item._id !== id && item.id !== id);
    writeData(collection, filtered);
    return filtered.length < data.length;
  },

  // COUNT
  count: (collection, filter = {}) => {
    return FileStorage.findAll(collection, filter).length;
  },

  // CLEAR COLLECTION
  clear: (collection) => {
    writeData(collection, []);
    return true;
  },
};

export default FileStorage;
