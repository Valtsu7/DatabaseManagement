import pg from 'pg';

const { Pool } = pg;

// tietokantayhteyden tiedot
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost', 
    database: 'movies', 
    password: 'ismo_seppo_77', 
    port: 5432, 
});

export default pool;
