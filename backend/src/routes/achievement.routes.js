
const express = require("express");
const router = express.Router();

const {
    getAchievements
} = require("../controllers/achievement.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getAchievements);

module.exports = router;
