const { Pool } = require('pg');
const fs = require('fs');
const { dbConfig } = require('./config');
// const caCert = fs.readFileSync('./us-east-1-bundle.pem').toString();

// PostgreSQL connection settings
const pool = new Pool({
    user: dbConfig.username,
    host: dbConfig.hostname,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
    ssl: {
        rejectUnauthorized: true, // This should always be true to avoid man-in-the-middle attacks
        ca: fs.readFileSync('./us-east-1-bundle.pem').toString(), // Load the RDS root cert
    }
});

async function getTableColumns({ tableName }) {
    try {
        const query = `SELECT column_name FROM information_schema.columns WHERE table_name = $1;`;
        const res = await pool.query(query, [tableName]);
        const columns = res.rows.map(row => row.column_name);
        console.log(`${tableName} columns:`, JSON.stringify(columns, null, 2));
        return columns;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getAllTableNames() {
    try {
        const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';";
        const res = await pool.query(query);
        const tableNames = res.rows.map(table => table.table_name);
        console.log(`table names: \n${tableNames}`);
        return tableNames;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getDataByQuery(sqlQuery) {
    try {
        console.log(`sql query: ${sqlQuery}`);
        const res = await pool.query(sqlQuery);
        const data = res.rows.map(row => {
            const { id, id_color, boss, ...otherColumns } = row;
            return { id, id_color, boss, ...otherColumns };
        });
        console.log(`resolve data:`);
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function insertIntoTable(tableName, data) {
    try {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
        const values = Object.values(data);
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING id;`;
        const res = await pool.query(query, values);
        console.log(`Inserted ID: ${res.rows[0].id}`);
        return { id: res.rows[0].id };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Note: The usage of PRAGMA and sqlite_master is specific to SQLite.
// PostgreSQL uses information_schema or pg_catalog for metadata.
// The following function is adjusted to use information_schema for compatibility.
async function getAllTableAndTheirColumns() {
    try {
        const tables = await getAllTableNames();
        const result = {};
        for (const tableName of tables) {
            const columns = await getTableColumns({ tableName });
            result[tableName] = columns;
        }
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Search people by ID in the database
async function searchPeopleById(tableName, pattern) {
    // Construct the SQL query using PostgreSQL's parameter placeholder style
    const sqlQuery = `SELECT * FROM ${tableName} WHERE id LIKE $1;`;

    try {
        const { rows } = await pool.query(sqlQuery, [`${pattern}%`]); // Assume '%' is needed for LIKE pattern
        const data = rows.map(({ id, id_color, boss, ...otherColumns }) => ({ id, id_color, boss, ...otherColumns }));
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function create_sql_query({ tableName, columnList }) {
    let columns = "*"; // Default to all columns if none are specified

    if (Array.isArray(columnList) && columnList.length > 0) {
        columns = columnList.join(', ');
    }

    const query = `SELECT ${columns} FROM ${tableName};`;

    try {
        const { rows } = await pool.query(query);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}



// Adjust searchPeopleById similarly to other functions to use async/await with pg's pool

module.exports = {
    getTableColumns,
    getAllTableAndTheirColumns,
    getAllTableNames,
    getDataByQuery,
    insertIntoTable,
    searchPeopleById,
    create_sql_query
};
