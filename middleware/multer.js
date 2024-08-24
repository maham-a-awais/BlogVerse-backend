// const multer = require("multer");
// const fs = require("fs");

// const tempDir = "../public/temp";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".PNG" &&
      ext !== ".JPG" &&
      ext !== ".JPEG"
    ) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
