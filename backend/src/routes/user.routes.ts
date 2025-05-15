import { Router } from 'express';
import { registerUser , loginUser } from "../controllers/user.controller";
import  passport from "../middleware/passport.middleware"
const router = Router();


// unprotected routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);


// protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get(
    "/protected",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.json({ message: "You accessed a protected route!", user: req.user });
    }
);
  


export {router as userRoutes};
