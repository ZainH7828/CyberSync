const multer = require('multer');
const path = require('path');
const fs = require('fs');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|txt|zip/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

function configureMulter(directory, fieldName) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '../../assets/uploads', directory);

      // Ensure the directory exists
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          return cb(err);
        }
        cb(null, dir);
      });
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  return multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // limit file size to 5MB
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    }
  });
}

module.exports = configureMulter;
