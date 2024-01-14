import { Router } from "express";
import passport from "passport";

const authRoutes = Router();

authRoutes.get("/twitter", passport.authenticate("twitter"));

authRoutes.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    successRedirect: "http://localhost:5173/",
  })
);

// when login is successful, retrieve user info
authRoutes.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

export { authRoutes };
