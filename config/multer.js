const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: function (req, file, cb) {
    const userId = req.user._id;
    const avatarName = `avatar_${userId}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, avatarName);
  },
});

const avatarUpload = multer({ storage: storage }).single("avatar");

module.exports = { avatarUpload };
