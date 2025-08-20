# Password Security Project

A minimal API that demonstrates secure password handling:
- Hashing with bcrypt, unique salt per user, optional global pepper
- Strong password checks
- Login with short-lived JWT
- Safe password reset flow with one-time token

## Why this matters
Never store plaintext passwords. Hash them with a slow algorithm, add a salt, and keep your JWT short-lived. That is the baseline for any serious system.

## Tech
Node.js, Express, MongoDB, Mongoose, bcrypt, zod, JWT, Helmet, rate limiting.

## Quick start

1) Requirements:
- Node 18+
- MongoDB running locally or in the cloud

2) Clone and install:
```bash
git clone https://github.com/<your-username>/password-security-project.git
cd password-security-project
npm install
