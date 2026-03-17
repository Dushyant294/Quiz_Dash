const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL. Check your credentials and make sure PostgreSQL is running.');
    console.error(err.stack);
  } else {
    console.log('Connected to PostgreSQL database successfully.');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
