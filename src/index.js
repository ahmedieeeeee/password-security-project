import app from "./app.js";
import { connectDB } from "./db.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
start();
