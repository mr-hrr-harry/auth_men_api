const postgres = require('postgres')
require('dotenv').config({path: 'database/potsgres/pgdb.env'})

db_url = process.env.POSTGRES_URL
const pg_conn = postgres(db_url);

(async () => {
    try {
      await pg_conn `SELECT 1`;
      console.log('Postgres Database connection is active.');
    //   logger.info('Postgres Database connection successful and is active.')
      
    } catch (error) {
      console.error(`Postgres Database connection failed ${error}`)
    //   logger.error(`Postgres Database connection failed ${error}`)
    }
})();

module.exports = pg_conn
