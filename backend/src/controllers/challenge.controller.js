const isUuid = (value) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const logDatabaseError = (operation, error) => {
    console.error(`${operation} failed:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
    });
};

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
        logDatabaseError("Challenge list fetch", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch challenges"
        });
    }
};

// GET one challenge by ID
const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isUuid(id)) {
            return res.status(400).json({
                success: false,
                message: "Challenge ID must be a valid UUID"
            });
        }

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
        logDatabaseError("Challenge fetch", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch challenge"
        });
    }
};



// SUBMIT an answer for a challenge
const submitChallengeAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer } = req.body || {};

        if (!isUuid(id)) {
            return res.status(400).json({
                success: false,
                message: "Challenge ID must be a valid UUID"
            });
        }

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
            logDatabaseError("Challenge submission RPC", error);

            if (error.code === "22P02") {
                return res.status(400).json({
                    success: false,
                    message: "Challenge ID or answer is invalid"
                });
            }

            if (error.code === "42501") {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to submit this answer"
                });
            }

            return res.status(500).json({
                success: false,
                message: "Unable to submit answer right now"
            });
        }

        const result = Array.isArray(data) ? data[0] : data;
        if (
            !result ||
            typeof result.is_correct !== "boolean" ||
            typeof result.xp_earned !== "number" ||
            typeof result.already_rewarded !== "boolean" ||
            typeof result.total_xp !== "number" ||
            typeof result.current_level !== "number"
        ) {
            console.error("Challenge submission RPC returned an unexpected result shape");
            return res.status(500).json({
                success: false,
                message: "Unable to process the submission result"
            });
        }

        return res.status(200).json({
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
        logDatabaseError("Challenge submission", error);

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