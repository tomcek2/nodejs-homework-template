const express = require("express");
const router = express.Router();

const authenticateToken = require("../../middleware/authenticateToken");

const {
  userSignUp,
  userLogin,
  userLogout,
  getCurrentUser,
  avatarChange,
} = require("../../controllers/users/index");

router.post("/signup", userSignUp);

router.post("/login", userLogin);

router.get("/logout", authenticateToken, userLogout);

router.get("/current", authenticateToken, getCurrentUser);

router.patch("/avatars", authenticateToken, avatarChange);

module.exports = router;
