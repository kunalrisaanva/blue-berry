import express, { Request, Response, Errback, NextFunction } from "express";
import passport from "./middleware/passport.middleware";
import cors from "cors"
import morgan from "morgan";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport middleware
app.use(passport.initialize());


// cors middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(morgan("dev"));


// health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Import routes
import { userRoutes } from "./routes/user.routes";
import { productRoutes } from "./routes/product.routes";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

// General error handling middleware , should be last
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [],
      data: null,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
});
  

export default app;
