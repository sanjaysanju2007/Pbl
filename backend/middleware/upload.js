const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseUploadDir = path.resolve(__dirname, '../../storage/uploads');
    const uploadDir = file.fieldname === 'documents'
      ? path.join(baseUploadDir, 'documents')
      : path.join(baseUploadDir, 'gallery');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|avi|mov|webm/;
  const allowedDocTypes = /pdf|jpeg|jpg|png/;

  const ext = path.extname(file.originalname).toLowerCase().slice(1);

  if (file.fieldname === 'documents') {
    if (allowedDocTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Documents must be PDF, JPEG, JPG, or PNG'), false);
    }
  } else {
    if (allowedImageTypes.test(ext) || allowedVideoTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image (JPEG, PNG, GIF, WebP) and video (MP4, AVI, MOV, WebM) files are allowed'), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

module.exports = upload;
