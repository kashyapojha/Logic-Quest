
const getAchievements = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all available achievements
        const { data: achievements, error: achievementError } =
            await req.supabase
                .from("achievements")
                .select("*")
                .order("created_at", { ascending: true });

        if (achievementError) {
            return res.status(400).json({
                success: false,
                message: achievementError.message
            });
        }

        // Fetch achievements unlocked by this user
        const { data: unlocked, error: unlockedError } =
            await req.supabase
                .from("user_achievements")
                .select("achievement_id, unlocked_at")
                .eq("user_id", userId);

        if (unlockedError) {
            return res.status(400).json({
                success: false,
                message: unlockedError.message
            });
        }

        const unlockedMap = new Map(
            unlocked.map(item => [
                item.achievement_id,
                item.unlocked_at
            ])
        );

        const result = achievements.map(achievement => ({
            ...achievement,
            is_unlocked: unlockedMap.has(achievement.id),
            unlocked_at: unlockedMap.get(achievement.id) || null
        }));

        return res.status(200).json({
            success: true,
            count: result.length,
            unlocked_count: unlocked.length,
            achievements: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getAchievements };
