const multer = require("multer");

const MIME_TYPE = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },

  filename: function (req, file, cb) {
    cb(null, `${Math.random()}-${file.originalname}`);
  }
});

function fileFilter(req, file, cb) {
  const isValid = !!MIME_TYPE[file.mimetype];
  const error = isValid ? null : new Error("Invalid mime type");
  cb(error, isValid);
}

module.exports = multer({ storage, fileFilter }).single("image");
