
const express = require("express");
const router = express.Router();

const authenticateUser =
    require("../middleware/auth.middleware");

const {
    getProgress
} = require("../controllers/progress.controller");

router.get("/", authenticateUser, getProgress);

module.exports = router;
