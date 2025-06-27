import express from 'express';
import passport from 'passport';

const router = express.Router();

// Route to start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    const user: any = req.user;

    console.log("google backend user:", user);

    if (!user || !user.token) {
      return res.redirect('http://localhost:3000/login?error=NoUser');
    }

    // ✅ Redirect to frontend with token in query
    res.redirect(`http://localhost:3000/?token=${user.token}`);
  }
);


// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
