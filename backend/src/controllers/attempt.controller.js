
const getAttempts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Use the authenticated user's Supabase client
        const { data, error } = await req.supabase
            .from("game_attempts")
            .select("*")
            .eq("user_id", userId)
            .order("attempted_at", { ascending: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            count: data.length,
            attempts: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getAttempts };
