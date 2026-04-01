const supabase = require('../config/supabaseClient');

// Helper for simple input validation
const validateAuthInput = (email, password) => {
  if (!email || !password) {
    return 'Email and password are required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

/**
 * 🔹 User Sign Up
 * Registers a new user with Supabase Auth.
 */
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateAuthInput(email, password);
    if (validationError) {
      return res.status(400).json({ 
        success: false, 
        error: validationError 
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email for verification.',
      user: data.user,
      session: data.session
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during signup' 
    });
  }
};

/**
 * 🔹 User Login
 * Authenticates user and returns a session token.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateAuthInput(email, password);
    if (validationError) {
      return res.status(400).json({ 
        success: false, 
        error: validationError 
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ 
        success: false, 
        error: error.message 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: data.user,
      token: data.session.access_token,
      session: data.session
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during login' 
    });
  }
};

/**
 * 🔹 Get Current User (Me)
 * Returns the profile of the currently authenticated user.
 */
const getMe = async (req, res) => {
  try {
    // req.user is populated by authMiddleware
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error while fetching user profile' 
    });
  }
};

/**
 * 🔹 User Logout
 * Signs out the user from Supabase.
 */
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during logout' 
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout
};
