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
    failureRedirect: `${process.env.CLIENT_URL}login`,
  }),
  (req, res) => {
    const user: any = req.user;

    if (!user || !user.token) {
      return res.redirect(`${process.env.CLIENT_URL}login?error=NoUser`);
    }

    res.redirect(`${process.env.CLIENT_URL}?token=${user.token}`);
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
