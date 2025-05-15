import express, { Request, Response, Errback, NextFunction } from "express";
import passport from "./middleware/passport.middleware";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport middleware
app.use(passport.initialize());


// health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Import routes
import { userRoutes } from "./routes/user.routes";

app.use("/api/v1/users", userRoutes);

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
