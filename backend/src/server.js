const challengeRoutes = require("./routes/challenge.routes");
const express = require("express");
const cors = require("cors");

const supabase = require("./config/supabase");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes =
    require("./routes/dashboard.routes");

const progressRoutes =
    require("./routes/progress.routes");
const attemptRoutes = require("./routes/attempt.routes");

const achievementRoutes = require("./routes/achievement.routes");

const profileRoutes = require("./routes/profile.routes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LogicQuest Backend is running!"
    });
});

// Health check
app.get("/api/health", async (req, res) => {
    try {
        const { error } = await supabase
            .from("profiles")
            .select("id")
            .limit(1);

        if (error) throw error;

        res.json({
            backend: "healthy",
            database: "connected"
        });

    } catch (error) {
        res.status(500).json({
            backend: "running",
            database: "error",
            message: error.message
        });
    }
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/profile", profileRoutes);
// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`LogicQuest server running on port ${PORT}`);
});
