import multer from 'multer';
import { ValidationError } from './error.utils';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Max 5 files (1 resume + 4 documents)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new ValidationError('Invalid file type. Only PDF, JPEG, JPG, and PNG are allowed.'));
    }
    cb(null, true);
  },
});