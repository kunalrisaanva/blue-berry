import express, { Request, Response, Errback, NextFunction } from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Import routes
import { userRoutes } from "./routes/user.routes";

app.use("/api/v1/users", userRoutes);

// General error handling middleware , should be last
app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send({
    status: "error",
    message: "Something went wrong!",
  });
});

export default app;
