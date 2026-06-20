const jwtConfig = () => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set a strong JWT_SECRET (min 32 chars) in your .env file."
    );
  }

  if (secret === "mysecretkey") {
    throw new Error(
      "JWT_SECRET is set to the insecure default 'mysecretkey'. Generate a strong random secret for production."
    );
  }

  return { secret, expiresIn };
};

module.exports = jwtConfig;