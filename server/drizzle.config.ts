import dotenv from "dotenv";
dotenv.config();

export default {
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
  dialect: "postgresql",
  schema: "./src/db/schema/*",
};

dotenv.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);
dotenv.config({ path: './path/to/.env' });

