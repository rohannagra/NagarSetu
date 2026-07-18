import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { HTTP_STATUS, FILE_SETTINGS } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ...FILE_SETTINGS.ALLOWED_IMAGE_TYPES,
    ...FILE_SETTINGS.ALLOWED_VIDEO_TYPES,
    ...FILE_SETTINGS.ALLOWED_DOCUMENT_TYPES
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_SETTINGS.MAX_SIZE
  }
});

// Error handler for multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `File too large. Maximum size is ${FILE_SETTINGS.MAX_SIZE / (1024 * 1024)}MB`
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Too many files. Maximum is ${FILE_SETTINGS.MAX_FILES} files`
      });
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: err.message
    });
  }
  
  if (err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// Export upload middleware
export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', FILE_SETTINGS.MAX_FILES);
export const uploadFields = upload.fields([
  { name: 'images', maxCount: FILE_SETTINGS.MAX_FILES },
  { name: 'videos', maxCount: 2 },
  { name: 'documents', maxCount: FILE_SETTINGS.MAX_FILES }
]);

export default upload;
