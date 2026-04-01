const supabase = require('../config/supabaseClient');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn('[AuthMiddleware] Missing Authorization header');
    return res.status(401).json({ success: false, error: 'Missing Authorization header' });
  }

  // Handle both 'Bearer <token>' and cases where the user accidentally includes 'Bearer ' twice
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
    if (token.startsWith('Bearer ')) {
      token = token.substring(7).trim();
    }
  } else {
    console.warn('[AuthMiddleware] Invalid Authorization header format');
    return res.status(401).json({ success: false, error: 'Authorization header must start with Bearer' });
  }

  if (!token) {
    console.warn('[AuthMiddleware] Token is missing after Bearer prefix');
    return res.status(401).json({ success: false, error: 'Token is missing' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn(`[AuthMiddleware] Error validating token: ${error?.message || 'User not found'}`);
      
      const errorMessage = error?.message?.toLowerCase() || '';
      if (errorMessage.includes('expired') || errorMessage.includes('jwt expired')) {
        return res.status(401).json({ success: false, error: 'Token expired', details: error?.message });
      }

      return res.status(401).json({ success: false, error: 'Unauthorized', details: error?.message });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('[AuthMiddleware] Internal server error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error during authentication' });
  }
};

module.exports = authMiddleware;
