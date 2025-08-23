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

## Password Security Project

A small Node.js and Express API that shows safe user authentication.
Passwords are hashed with bcrypt.
JWT is used for login sessions. MongoDB stores user records.

## What this covers

Register, login, and a protected route.

Password strength checks.

Password reset flow with one-time tokens.

Secure headers and basic rate limiting.

## Architecture
Client --> /auth/register|login --> Express routes
         --> input validation --> password utils (hash/verify)
         --> MongoDB via Mongoose
         --> JWT issued on login
         --> /auth/me protected by middleware (checks Bearer token)

## Project structure
password-security-project/
  src/
    index.js        # Starts server after DB connects
    app.js          # Express app, security middleware, routes
    db.js           # Mongoose connection
    config.js       # Reads env values (JWT secret, bcrypt rounds, pepper)
    routes/
      auth.js       # Register, login, request reset, reset password, /me
    middleware/
      auth.js       # Checks Authorization: Bearer <JWT>
    models/
      User.js       # User schema, reset token fields
    utils/
      password.js   # hashPassword, verifyPassword, checkStrength
      token.js      # signAuthToken, verifyAuthToken
  .env.example      # Template for your env settings
  package.json      # Dependencies and scripts
  .gitignore        # Keeps .env and node_modules out of Git
  README.md         # This file

## Why each file exists
-src/index.js

Starts the app only after MongoDB connects.
Keeps startup logic separate from route logic.
Makes failures obvious early.

-src/app.js

Creates the Express app.
Adds helmet and a rate limiter.
Mounts /auth routes and a simple / health check.

-src/db.js

Connects to MongoDB using the URL in .env.
Fails fast and logs a clear message.
One place to change DB connection settings.

-src/config.js

Reads environment variables once.
Exports typed values for reuse.
Reduces direct process.env usage across files.

-src/routes/auth.js

All authentication endpoints live here.
Uses zod to validate inputs.
Never stores raw passwords.

-src/middleware/auth.js

Reads Authorization: Bearer <token>.
Verifies the JWT and sets req.userId.
Blocks requests with missing or invalid tokens.

-src/models/User.js

Mongoose schema for users.
Indexes email and enforces uniqueness.
Holds reset token hash and expiry for the reset flow.

-src/utils/password.js

hashPassword and verifyPassword with bcrypt.
checkStrength enforces length and character rules.
Optional pepper support via an env value.

-src/utils/token.js

signAuthToken issues short-lived tokens.
verifyAuthToken checks token validity.
JWT contains only user id and email.

-.env.example

Documents required settings.
Copy to .env and fill values locally.
Never commit real secrets.

## Set up and run
1) Clone and enter the project
git clone https://github.com/ahmedieeeeee/password-security-project.git
cd "password-security-project"

2) Install dependencies
npm install

3) Create your .env
Copy-Item .env.example .env


Edit .env and set:

-MONGO_URL=mongodb+srv://<username>:<password>@cluster0.hsbriwf.mongodb.net/password_security_project?retryWrites=true&w=majority
JWT_SECRET=change-this-to-a-long-random-string
BCRYPT_ROUNDS=12
PEPPER=
PORT=3000


-If your password has special symbols, URL-encode them
@ → %40, # → %23, & → %26, space → %20.

-4) Start the server
npm run dev


-Expected logs:

## MongoDB connected
Server running on http://localhost:3000

## Quick tests from PowerShell
Health check
Invoke-RestMethod http://localhost:3000/

## Register
$body = @{ email="user1@example.com"; password="Str0ngP@ssword!!" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/register" -Body $body -ContentType "application/json"

## Login and save the token
$body = @{ email="user1@example.com"; password="Str0ngP@ssword!!" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/login" -Body $body -ContentType "application/json"
$token = $login.token
$token

## Protected route
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/auth/me" -Headers @{ Authorization = "Bearer $token" }

## Request password reset
$req = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/request-password-reset" -Body (@{ email="user1@example.com" } | ConvertTo-Json) -ContentType "application/json"
$resetToken = $req.resetTokenDemoOnly
$resetToken

## Reset password
$body = @{ token=$resetToken; newPassword="EvenStr0nger_P@ss!" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/auth/reset-password" -Body $body -ContentType "application/json"

## Security choices

Bcrypt with a unique salt per hash.

Optional pepper stored outside the database.

JWT with short expiry.

Helmet for safer defaults.

Rate limiting to reduce abuse.

Reset tokens stored as SHA-256 hashes with expiry.

Troubleshooting

Cannot connect to MongoDB
Check MONGO_URL and Atlas IP allowlist. Wait a minute after adding IP.

Invalid or expired token
Re-login to get a fresh token. Do not wrap the token in extra quotes.

Weak password error
Use at least 12 characters with upper, lower, digit, and a symbol.
