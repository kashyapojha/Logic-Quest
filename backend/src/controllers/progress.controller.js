
const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await req.supabase
            .from("user_progress")
            .select("module_name, completed_challenges, total_challenges, updated_at")
            .eq("user_id", userId)
            .order("module_name");

        if (error) throw error;

        const progress = data.map(item => ({
            ...item,
            completion_percentage:
                item.total_challenges === 0
                    ? 0
                    : Number(
                        (
                            item.completed_challenges /
                            item.total_challenges *
                            100
                        ).toFixed(2)
                    )
        }));

        res.status(200).json({
            success: true,
            count: progress.length,
            progress
        });

    } catch (error) {
        console.error("Progress error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch progress"
        });
    }
};

module.exports = { getProgress };
