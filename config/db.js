const { Pool } = require('pg');

// Configuración de conexión
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Evelin9907*',
    port: 5432,
});

pool.connect(err => {
    if (err) {
      console.error('Error connecting to the PostgreSQL database:', err.stack);
    } else {
      console.log('Connected to the PostgreSQL database.');
    }
  });
  
module.exports = pool;


