import express from "express";
import passport from "passport";

const router = express.Router();

// Route to start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    const user: any = req.user;

    if (!user || !user.token) {
      return res.redirect("http://localhost:3000/login?error=NoUser");
    }

    res.redirect(`http://localhost:3000/?token=${user.token}`);
  }
);

// Logout
router.post("/logout", (req, res) => {
   req.logout(() => {
    res.send("logout successully")
    // res.redirect("/");
  });
});



export default router;
