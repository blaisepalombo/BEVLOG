function requireAuth(req, res, next) {
  try {
    if (req.isAuthenticated && req.isAuthenticated()) return next();
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  } catch (err) {
    return res.status(500).json({ message: "Auth middleware error." });
  }
}

module.exports = { requireAuth };