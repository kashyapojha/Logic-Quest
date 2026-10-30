
const supabase = require("../config/supabase");

// =================================
// SIGNUP
// =================================

const signup = async (req, res) => {
    try {
        const { username, full_name, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const authClient = supabase.createAuthClient();

        const { data, error } = await authClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    full_name: full_name || ""
                }
            }
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(201).json({
            success: true,
            message: data.session
                ? "Account created successfully"
                : "Account created. Please verify your email.",
            user: data.user,
            session: data.session
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =================================
// LOGIN
// =================================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const authClient = supabase.createAuthClient();

        const { data, error } =
            await authClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: data.user,
            session: data.session
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =================================
// GET CURRENT USER
// =================================

const getMe = async (req, res) => {
    try {
        const userClient = req.supabase;

        const { data: profile, error: profileError } =
            await userClient
                .from("profiles")
                .select("*")
                .eq("id", req.user.id)
                .single();

        if (profileError) {
            throw profileError;
        }

        const { data: stats, error: statsError } =
            await userClient
                .from("user_stats")
                .select("*")
                .eq("user_id", req.user.id)
                .single();

        if (statsError) {
            throw statsError;
        }

        return res.status(200).json({
            success: true,
            user: req.user,
            profile,
            stats
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    signup,
    login,
    getMe
};
