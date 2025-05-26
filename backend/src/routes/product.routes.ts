import { Router } from 'express';
import { allProducts,addProduct,getSingleProductById } from "../controllers/product.controller";
import  passport from "../middleware/passport.middleware"
import { upload } from "../middleware/multer.middleware";
const router = Router();




// protected routes
router.route("/all-prodcuts").get(allProducts);

router.post('/add-product', upload.single('image'), addProduct);


router.get('/product',getSingleProductById);



export {router as productRoutes};