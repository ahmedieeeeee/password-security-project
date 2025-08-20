export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
export const PEPPER = process.env.PEPPER || "";
