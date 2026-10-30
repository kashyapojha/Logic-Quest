
const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
}

const options = {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    },
    realtime: {
        transport: WebSocket
    }
};

// General Supabase client
const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    options
);

// Create an independent authentication client
const createAuthClient = () => {
    return createClient(supabaseUrl, supabaseKey, options);
};

// Create a client authenticated as a specific user
const createUserClient = (accessToken) => {
    return createClient(supabaseUrl, supabaseKey, {
        ...options,
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    });
};

supabase.createAuthClient = createAuthClient;
supabase.createUserClient = createUserClient;

module.exports = supabase;
