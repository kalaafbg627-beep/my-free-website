// --- Supabase client setup ---
// Make sure to replace these with your own project keys if not already set up
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- UI Helpers (already in your project, just reminders) ---
// function showProfile() { ... }
// function showSection(sectionId) { ... }

// ------------------ AUTH LOGIC ------------------ //

// Signup
async function signup(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error("Signup error:", error.message);
        alert(error.message);
    } else {
        const session = data.session;
        if (session) {
            localStorage.setItem('user', JSON.stringify(session.user));
            showProfile();
            showSection('profile');
        } else {
            // Some projects require email confirmation before session
            alert("Check your email to confirm your account before logging in.");
        }
    }
}

// Login
async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("Login error:", error.message);
        alert(error.message);
    } else {
        const session = data.session;
        if (session) {
            localStorage.setItem('user', JSON.stringify(session.user));
            showProfile();
            showSection('profile');
        }
    }
}

// Logout
async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
        return;
    }

    localStorage.removeItem('user');
    showSection('login');
}

// Check if user is already logged in when the page loads
async function checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error("Error checking session:", error.message);
        return;
    }

    if (session) {
        localStorage.setItem('user', JSON.stringify(session.user));
        showProfile();
        showSection('profile'); // go to profile if logged in
    } else {
        showSection('login'); // fallback to login
    }
}

// Run it on page load
window.addEventListener('load', checkSession);
