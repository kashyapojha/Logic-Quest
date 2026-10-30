const supabase = require("../config/supabase");

// GET all published challenges
const getChallenges = async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from("challenges")
            .select("id, title, description, category, difficulty, xp_reward")
            .eq("is_published", true)
            .order("created_at", { ascending: false });

        if (error) {
            throw error;
        }

        res.status(200).json({
            success: true,
            count: data.length,
            challenges: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET one challenge by ID
const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await req.supabase
            .from("challenges")
            .select("id, title, description, category, difficulty, xp_reward")
            .eq("id", id)
            .eq("is_published", true)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        res.status(200).json({
            success: true,
            challenge: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// SUBMIT an answer for a challenge
const submitChallengeAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer } = req.body;

        // Validate answer
        if (typeof answer !== "string" || !answer.trim()) {
            return res.status(400).json({
                success: false,
                message: "Answer is required"
            });
        }

        // Call secure PostgreSQL function
        const { data, error } = await req.supabase.rpc(
            "submit_challenge_answer",
            {
                p_challenge_id: id,
                p_answer: answer.trim()
            }
        );

        if (error) {
            console.error("Submission error:", error.message);

            return res.status(400).json({
                success: false,
                message: "Unable to submit answer. Check the challenge ID and try again."
            });
        }

        const result = data[0];

        res.status(200).json({
            success: true,
            message: result.is_correct
                ? "Correct answer!"
                : "Incorrect answer. Try again!",
            result: {
                is_correct: result.is_correct,
                xp_earned: result.xp_earned,
                already_rewarded: result.already_rewarded,
                total_xp: result.total_xp,
                current_level: result.current_level
            }
        });

    } catch (error) {
        console.error("Controller error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
module.exports = {
    getChallenges,
    getChallengeById,
    submitChallengeAnswer
};