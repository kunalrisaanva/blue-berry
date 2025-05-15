import { Router } from 'express';
import { allProducts } from "../controllers/product.controller";
import  passport from "../middleware/passport.middleware"
const router = Router();




// protected routes
router.route("/all-prodcuts").get(allProducts);






export {router as productRoutes};