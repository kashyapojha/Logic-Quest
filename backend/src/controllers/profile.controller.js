const logDatabaseError = (operation, error) => {
  console.error(`${operation} failed:`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint
  });
};

const getProfile = async (req, res) => {
  try {
    const { data: profile, error: profileError } = await req.supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .maybeSingle();

    if (profileError) {
      logDatabaseError("Profile fetch", profileError);
      return res.status(500).json({
        success: false,
        message: "Unable to fetch profile"
      });
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    const { data: stats, error: statsError } = await req.supabase
      .from("user_stats")
      .select("total_xp, current_level")
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (statsError) {
      logDatabaseError("Profile stats fetch", statsError);
      return res.status(500).json({
        success: false,
        message: "Unable to fetch profile statistics"
      });
    }

    if (!stats) {
      console.error("Profile stats are missing for authenticated user");
      return res.status(500).json({
        success: false,
        message: "Profile statistics are unavailable"
      });
    }

    const publicProfile = {
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      ...(typeof profile.created_at === "string"
        ? { created_at: profile.created_at }
        : {}),
      ...(typeof req.user.created_at === "string"
        ? { account_created_at: req.user.created_at }
        : {})
    };

    return res.status(200).json({
      success: true,
      profile: publicProfile,
      stats
    });
  } catch (error) {
    logDatabaseError("Profile fetch", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile"
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object"
      });
    }

    const editableFields = new Set(["username", "full_name", "avatar_url"]);
    const submittedFields = Object.keys(body);
    const disallowedFields = submittedFields.filter(
      (field) => !editableFields.has(field)
    );

    if (disallowedFields.length) {
      return res.status(400).json({
        success: false,
        message: "One or more fields cannot be changed"
      });
    }

    if (!submittedFields.length) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one profile field to update"
      });
    }

    const updates = {};
    for (const field of submittedFields) {
      const value = body[field];
      if (field === "avatar_url" && value === null) {
        updates[field] = null;
        continue;
      }

      if (typeof value !== "string") {
        return res.status(400).json({
          success: false,
          message: `${field} must be a string${field === "avatar_url" ? " or null" : ""}`
        });
      }

      const trimmed = value.trim();
      if (field === "username" && (!trimmed || trimmed.length > 50)) {
        return res.status(400).json({
          success: false,
          message: "Username must be between 1 and 50 characters"
        });
      }
      if (field === "full_name" && trimmed.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Full name must be 100 characters or fewer"
        });
      }
      if (field === "avatar_url" && trimmed.length > 2048) {
        return res.status(400).json({
          success: false,
          message: "Avatar URL must be 2048 characters or fewer"
        });
      }
      if (field === "avatar_url" && trimmed) {
        let url;
        try {
          url = new URL(trimmed);
        } catch {
          return res.status(400).json({
            success: false,
            message: "Avatar URL must be a valid HTTP or HTTPS URL"
          });
        }
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          return res.status(400).json({
            success: false,
            message: "Avatar URL must use HTTP or HTTPS"
          });
        }
      }

      updates[field] = trimmed;
    }

    const { data: profile, error } = await req.supabase
      .from("profiles")
      .update(updates)
      .eq("id", req.user.id)
      .select("*")
      .maybeSingle();

    if (error) {
      logDatabaseError("Profile update", error);
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "That username is already in use"
        });
      }
      if (error.code === "42501") {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to update this profile"
        });
      }
      return res.status(500).json({
        success: false,
        message: "Unable to update profile"
      });
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        ...(typeof profile.created_at === "string"
          ? { created_at: profile.created_at }
          : {})
      }
    });
  } catch (error) {
    logDatabaseError("Profile update", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile"
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
