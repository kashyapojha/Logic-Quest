
const express = require("express");
const router = express.Router();

const { getAttempts } = require("../controllers/attempt.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getAttempts);

module.exports = router;
