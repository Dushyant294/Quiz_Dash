require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'quizdash',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
};

// Fast failure for missing config
const required = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const key of required) {
  if (!env[key]) {
    console.warn(`Warning: Environment variable ${key} is not set. Database connection may fail.`);
  }
}

module.exports = env;
