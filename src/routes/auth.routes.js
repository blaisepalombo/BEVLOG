const { Router } = require("express");
const passport = require("passport");

const router = Router();

router.get("/google", (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Start Google OAuth login'
  // #swagger.description = 'Redirects the user to Google to begin the OAuth login flow.'
  return passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Google OAuth callback'
  // #swagger.description = 'Handles the Google OAuth callback and establishes the user session.'
  return passport.authenticate("google", {
    failureRedirect: "/auth/login-failed",
    session: true,
  })(req, res, () => {
    res.redirect("/dashboard");
  });
});

router.get("/me", (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Get current authenticated user'
  // #swagger.description = 'Returns the currently logged-in user if a valid session exists.'
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ user: null, message: "Not authenticated" });
  }

  return res.status(200).json({
    user: {
      id: req.user.id,
      displayName: req.user.displayName || null,
      email: req.user.email || null,
    },
  });
});

router.post("/logout", (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Log out current user'
  // #swagger.description = 'Ends the current session and clears the session cookie.'
  req.logout((logoutErr) => {
    if (logoutErr) {
      return res.status(500).json({ error: "Logout failed" });
    }

    if (req.session && typeof req.session.destroy === "function") {
      return req.session.destroy((sessionErr) => {
        if (sessionErr) {
          return res.status(500).json({ error: "Session destroy failed" });
        }

        res.clearCookie("sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    }

    res.clearCookie("sid");
    return res.status(200).json({ message: "Logged out successfully" });
  });
});

router.get("/login-failed", (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'OAuth login failed'
  // #swagger.description = 'Returned when Google OAuth authentication fails.'
  return res.status(401).json({ error: "Google authentication failed" });
});

module.exports = router;