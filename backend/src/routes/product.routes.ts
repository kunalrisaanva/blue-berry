import { Router } from "express";
import {
  allProducts,
  addProduct,
  getSingleProductById,
} from "../controllers/product.controller";
import passport from "../middleware/passport.middleware";
import { upload } from "../middleware/multer.middleware";
const router = Router();


// unprotected routes
// This route is used to get all products, it can be accessed without authentication
router.route("/all-prodcuts").get(allProducts);
router.get("/product", getSingleProductById);

// protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.post("/add-product", upload.single("image"), addProduct);


export { router as productRoutes };
