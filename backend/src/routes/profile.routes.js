const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/auth.middleware");
const {
  getProfile,
  updateProfile
} = require("../controllers/profile.controller");

router.get("/", authenticateUser, getProfile);
router.put("/", authenticateUser, updateProfile);

module.exports = router;