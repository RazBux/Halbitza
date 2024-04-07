const sql = require('mssql');
const { connectionString } = require('./config');

async function getTableColumns(tableName) {
    try {
        await sql.connect(connectionString);
        const result = await sql.query`SELECT column_name FROM information_schema.columns WHERE table_name = ${tableName};`;
        console.log(`${tableName} columns:`, JSON.stringify(result.recordset, null, 2));
        return result.recordset;
    } catch (err) {
        console.error(err);
        throw err;
    } 
}

async function getAllTableNames() {
    try {
        await sql.connect(connectionString);
        // const result = await sql.query`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
        const result = await sql.query`SELECT table_name FROM information_schema.tables WHERE table_schema = 'dbo' AND table_type = 'BASE TABLE';`;
        console.log(`Table names:`, result.recordset.map(row => row.table_name));
        return result.recordset;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getDataByQuery(sqlQuery) {
    try {
        await sql.connect(connectionString);
        const result = await sql.query(sqlQuery);
        console.log(`Query data:`, result.recordset);
        return result.recordset;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function createSqlQuery({ tableName, columnList }) {
  let columns = "*"; // Default to all columns if none are specified

  // If columnList is provided and is not empty, join the list into a string
  if (Array.isArray(columnList) && columnList.length > 0) {
    columns = columnList.join(', ');
  }

  // Construct the SQL query string
  const query = `SELECT ${columns} FROM ${tableName};`;

  // Execute the query and return the results
  return getDataByQuery(query);
}

async function insertIntoTable(tableName, data) {
    try {
        // Filter out keys with null or empty string values, but always include 'id'
        const filteredData = Object.keys(data).reduce((acc, key) => {
            if (key === 'id' || (data[key] !== '' && data[key] != null)) {
                acc[key] = data[key];
            }
            return acc;
        }, {});

        console.log(`table name: ${tableName}`);
        console.log('Filtered data:', filteredData);

        await sql.connect(connectionString);
        const columns = Object.keys(filteredData).join(', ');
        console.log("columns", columns);

        const placeholders = Object.keys(filteredData).map((_, index) => `@param${index}`).join(', ');
        const request = new sql.Request();
        
        Object.keys(filteredData).forEach((key, index) => {
            const type = key === 'family_he' || key === 'name_he' ? sql.NVarChar : sql.VarChar;
            request.input(`param${index}`, type, filteredData[key]);
        });

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;
        console.log('insert query:', query);
        
        const result = await request.query(query);
        console.log(`Record inserted into ${result}.`);

        // If you need the last inserted ID, consider using a separate query with SCOPE_IDENTITY(), as direct output might be problematic with triggers.
        // Example: const idResult = await request.query("SELECT SCOPE_IDENTITY() AS LastID;");
        // console.log(`Inserted ID:`, idResult.recordset[0].LastID);

        // Since OUTPUT is removed, adjust your logic for obtaining the last inserted ID if needed
        // Returning a placeholder value or fetching the ID with a separate query if necessary
        return { id: "Placeholder or fetch actual ID" };
    } catch (err) {
        console.error('Error during insertion:', err);
        throw err;
    }
}


// Search people by ID in the database
// http://localhost:8000/api/search/persons/85
async function searchPeopleById(tableName, pattern) {
    try {
        // Ensure there's a safe way to include the table name to prevent SQL injection
        // Directly interpolating tableName can be dangerous without proper sanitation
        // This example does NOT include tableName sanitation; be cautious and implement as necessary
        let pool = await sql.connect(connectionString);
        let result = await pool.request()
            .input('pattern', sql.VarChar, `${pattern}%`)
            .query(`SELECT * FROM ${tableName} WHERE id LIKE @pattern;`);
        console.log(result)
        // Assuming the structure of rows is compatible with what you expect
        const data = result.recordset.map(({ id, id_color, boss, ...otherColumns }) => ({ id, id_color, boss, ...otherColumns }));
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await sql.close();
    }
}


// Add other functions you need, adapting them in a similar way

module.exports = {
    getTableColumns,
    getAllTableNames,
    getDataByQuery,
    insertIntoTable,
    createSqlQuery,
    searchPeopleById
};
