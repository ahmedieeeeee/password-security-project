// src/utils/password.js
import bcrypt from "bcrypt";
import { BCRYPT_ROUNDS, PEPPER } from "../config.js";

export async function hashPassword(plain) {
  return bcrypt.hash(plain + PEPPER, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain + PEPPER, hash);
}

export function checkStrength(pw) {
  const lengthOK = pw.length >= 12;
  const upper = /[A-Z]/.test(pw);
  const lower = /[a-z]/.test(pw);
  const digit = /\d/.test(pw);
  const special = /[^A-Za-z0-9]/.test(pw);
  const common = /(password|1234|qwerty|admin)/i.test(pw);

  const ok = lengthOK && upper && lower && digit && special && !common;
  return { ok, lengthOK, upper, lower, digit, special, common };
}
