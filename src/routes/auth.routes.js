// src/routes/auth.routes.js
const { Router } = require("express");
const passport = require("passport");

const router = Router();

/**
 * GET /auth/google
 * @summary Login with Google
 * @tags Auth
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * GET /auth/google/callback
 * @summary Google OAuth callback
 * @tags Auth
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failed" }),
  (req, res) => {
    res.redirect("/auth/success");
  }
);

/**
 * GET /auth/me
 * @summary Get current logged-in user
 * @tags Auth
 */
router.get("/me", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }
  return res.status(401).json({ message: "Not logged in", user: null });
});

/**
 * POST /auth/logout
 * @summary Logout
 * @tags Auth
 */
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session?.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);

      res.clearCookie("sid"); // matches server.js session cookie name
      return res.status(200).json({ message: "Logged out" });
    });
  });
});

// Optional GET logout for browser testing
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session?.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);

      res.clearCookie("sid");
      return res.status(200).send("Logged out. You can close this tab.");
    });
  });
});

router.get("/success", (req, res) => {
  res.status(200).send("Login successful. You can close this tab and use the API.");
});

router.get("/failed", (req, res) => {
  res.status(401).send("Login failed.");
});

module.exports = router;