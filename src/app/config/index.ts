import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
};
