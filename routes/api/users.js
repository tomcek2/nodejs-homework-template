const express = require("express");
const router = express.Router();

const authenticateToken = require("../../middleware/authenticateToken");

const {
  userSignUp,
  userLogin,
  userLogout,
  getCurrentUser,
} = require("../../controllers/users/index");

router.post("/signup", userSignUp);

router.post("/login", userLogin);

router.get("/logout", authenticateToken, userLogout);

router.get("/current", authenticateToken, getCurrentUser);

module.exports = router;
