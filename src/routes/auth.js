import { Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import User from "../models/User.js";
import { hashPassword, verifyPassword, checkStrength } from "../utils/password.js";
import { signAuthToken } from "../utils/token.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const strength = checkStrength(password);
    if (!strength.ok) {
      return res.status(400).json({ error: "Weak password", details: strength });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash });
    return res.status(201).json({ id: user._id, email: user.email });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input", details: e.errors });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signAuthToken(user);
    return res.json({ token });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input", details: e.errors });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/request-password-reset", async (req, res) => {
  const schema = z.object({ email: z.string().email() });
  try {
    const { email } = schema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user) return res.json({ ok: true });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await User.updateOne(
      { _id: user._id },
      { resetTokenHash: tokenHash, resetTokenExp: expires }
    );

    return res.json({ ok: true, resetTokenDemoOnly: token });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input", details: e.errors });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const schema = z.object({
    token: z.string().length(64),
    newPassword: z.string().min(12),
  });
  try {
    const { token, newPassword } = schema.parse(req.body);

    const strength = checkStrength(newPassword);
    if (!strength.ok) {
      return res.status(400).json({ error: "Weak password", details: strength });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetTokenHash: tokenHash,
      resetTokenExp: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.passwordHash = await hashPassword(newPassword);
    user.passwordUpdatedAt = new Date();
    user.resetTokenHash = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    return res.json({ ok: true });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input", details: e.errors });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ id: req.userId });
});

export default router;
