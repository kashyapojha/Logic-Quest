
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch profile
        const { data: profile, error: profileError } =
            await req.supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

        if (profileError) throw profileError;

        // Fetch user statistics
        const { data: stats, error: statsError } =
            await req.supabase
                .from("user_stats")
                .select("*")
                .eq("user_id", userId)
                .single();

        if (statsError) throw statsError;

        // Fetch attempt statistics
        const { data: attempts, error: attemptsError } =
            await req.supabase
                .from("game_attempts")
                .select("is_correct")
                .eq("user_id", userId);

        if (attemptsError) throw attemptsError;

        const totalAttempts = attempts.length;

        const correctAttempts = attempts.filter(
            attempt => attempt.is_correct
        ).length;

        const incorrectAttempts =
            totalAttempts - correctAttempts;

        const accuracy = totalAttempts === 0
            ? 0
            : Number(
                ((correctAttempts / totalAttempts) * 100).toFixed(2)
              );

        res.status(200).json({
            success: true,
            dashboard: {
                profile: {
                    username: profile.username,
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url
                },
                stats: {
                    total_xp: stats.total_xp,
                    current_level: stats.current_level,
                    current_streak: stats.current_streak,
                    longest_streak: stats.longest_streak
                },
                performance: {
                    total_attempts: totalAttempts,
                    correct_attempts: correctAttempts,
                    incorrect_attempts: incorrectAttempts,
                    accuracy_percentage: accuracy
                }
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch dashboard"
        });
    }
};

module.exports = { getDashboard };
