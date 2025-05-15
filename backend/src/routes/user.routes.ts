import { Router } from 'express';
import { registerUser , loginUser } from "../controllers/user.controller";

const router = Router();


// unprotected routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);



export {router as userRoutes};
