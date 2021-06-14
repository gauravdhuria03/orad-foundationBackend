const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, image, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, image, cb) => {
    console.log(image.originalname);
    cb(null, image.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
