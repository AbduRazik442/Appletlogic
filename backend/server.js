import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/dbConnection.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exit(1);
}