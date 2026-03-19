const supabase = require('../config/supabaseClient');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Handle both 'Bearer <token>' and cases where the user accidentally includes 'Bearer ' twice
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
    if (token.startsWith('Bearer ')) {
      token = token.substring(7).trim();
    }
  } else {
    return res.status(401).json({ error: 'Authorization header must start with Bearer' });
  }

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized', details: error?.message });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

module.exports = authMiddleware;
