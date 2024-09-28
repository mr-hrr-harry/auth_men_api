const postgres = require('postgres')
require('dotenv').config({path: 'database/potsgres/pgdb.env'})

db_url = process.env.POSTGRES_URL
const pg_conn = postgres(db_url);

(async () => {
    try {
      await pg_conn `SELECT 1`;
      console.log('Database connection is active.');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
})();

module.exports = pg_conn
