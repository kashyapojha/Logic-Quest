const express = require("express");
const router = express.Router();

const {
    getChallenges,
    getChallengeById,
    submitChallengeAnswer
} = require("../controllers/challenge.controller");

const authenticateUser = require("../middleware/auth.middleware");

// Get all published challenges
router.get("/", authenticateUser, getChallenges);

// Submit an answer
router.post("/:id/submit", authenticateUser, submitChallengeAnswer);

// Get one challenge
router.get("/:id", authenticateUser, getChallengeById);

module.exports = router;