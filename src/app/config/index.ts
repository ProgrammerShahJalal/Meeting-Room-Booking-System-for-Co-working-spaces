import dotenv from 'dotenv';
dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  frontend_url: process.env.FRONTEND_URL,
};
