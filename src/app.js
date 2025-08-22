import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.js";

const app = express();

app.use(helmet());
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/", (req, res) => res.json({ status: "ok" }));
app.use("/auth", authRouter);

export default app;
