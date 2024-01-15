import { Router } from "express";
import passport from "passport";

const authRoutes = Router();

authRoutes.get("/twitter", passport.authenticate("twitter"));

authRoutes.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    successRedirect: process.env.CLIENT_URL!,
  })
);

authRoutes.get("/logout", (req, res) => {
  req.logout(() => {});
  res.redirect(process.env.CLIENT_URL!);
});

// when login is successful, retrieve user info
authRoutes.get("/login/success", (req, res) => {
  console.log("login success route");
  if (req.user) {
    console.log("login success route, user exists", req.user);
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

export { authRoutes };
