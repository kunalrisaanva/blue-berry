import { config } from "dotenv";
import app from "./app";
// Env variables
config({ path: ".env" });
const port = process.env.PORT || 3000;



// Start the server
app
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
  .on("error", (err) => {
    console.error("\nError starting server:", err);
  });
