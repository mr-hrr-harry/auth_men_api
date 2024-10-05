const postgres = require('postgres')
require('dotenv').config({path: 'database/potsgres/pgdb.env'})

pg_db_url = process.env.POSTGRES_URL
const pg_conn = postgres(pg_db_url);

(async () => {
    try {
      await pg_conn `SELECT 1`;
    logger.info('Postgres Database connection successful and is active.')
      
    } catch (error) {
    logger.error(`Postgres Database connection failed ${error}`)
    }
})();

module.exports = pg_conn
