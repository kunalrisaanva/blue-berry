import { Router } from 'express';
import { registerUser , loginUser, verifyOtp , changeEmail , changePassword, resetPasswordMail, resetPassword } from "../controllers/user.controller";
// import { requestPasswordReset } from "../controllers/resetPassword.controller";

import passport from "../middleware/passport.middleware"
const router = Router();


// unprotected routes
router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOtp)
router.route("/login").post(loginUser);

// Reset password routes
router.route("/request-password-reset").post(resetPasswordMail);
router.route("/reset-password").post(resetPassword);


// protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get(
    "/protected",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.json({ message: "You accessed a protected route!", user: req.user });
    }
);

router.route("/change-email").post(changeEmail); 
router.route("/change-password").post(changePassword);





export {router as userRoutes};
