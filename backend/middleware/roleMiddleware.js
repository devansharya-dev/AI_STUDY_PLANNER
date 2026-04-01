const requireRole = (requiredRole) => {
  return (req, res, next) => {
    // Assuming req.user is populated by authMiddleware
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: User not authenticated' 
      });
    }

    // Default role is "user" if not explicitly set in user_metadata or app_metadata
    const userRole = req.user.user_metadata?.role || req.user.app_metadata?.role || req.user.role || 'user';

    if (userRole !== requiredRole) {
      return res.status(403).json({ 
        success: false, 
        error: `Forbidden: Requires ${requiredRole} role` 
      });
    }

    next();
  };
};

module.exports = {
  requireRole
};
