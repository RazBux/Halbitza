const sqlite3 = require('sqlite3').verbose(); // Import the sqlite3 package
// const db = new sqlite3.Database('../market-server/docs/market-pro.db');
const db = new sqlite3.Database('./db/workers_database_2023.sqlite');

//retrive all the column from the specific table.
function getTableColumns({ tableName }) {
  return new Promise((resolve, reject) => {
    const query = `PRAGMA table_info(${tableName});`;

    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {

        const columns = rows.map(row => row.name);
        console.log(`${tableName} columns:`, JSON.stringify(columns, null, 2));
        resolve(columns);
      }
    });
  });
}

// get all table and thier columns from a db.
function getAllTableAndThierColumns() {
  return new Promise((resolve, reject) => {
    const query = "SELECT name FROM sqlite_master WHERE type='table';";

    db.all(query, async (err, tables) => {
      if (err) {
        reject(err);
        return;
      }

      const tableColumnsPromises = tables.map(table => getTableColumns(table.name));
      const tableColumns = await Promise.all(tableColumnsPromises);

      const result = {};
      tables.forEach((table, index) => {
        result[table.name] = tableColumns[index];
      });
      resolve(result);
    });
  });
}


//get all the table name (only) from a db. 
function getAllTableNames() {
  return new Promise((resolve, reject) => {
    const query = "SELECT name FROM sqlite_master WHERE type='table';";

    db.all(query, (err, tables) => {
      if (err) {
        reject(err);
        return;
      }
      const tableNames = tables.map(table => table.name);
      console.log(`table names: \n${tableNames}`)
      resolve(tableNames);
    });
  });
}


function getDataByQuery(sqlQuery) {

  console.log(`sql query: ${sqlQuery}`);
  // Execute the query using async/await
  return new Promise((resolve, reject) => {
    db.all(sqlQuery, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      // const data = rows.map(row => ({ ...row })); //old version 
      
      //return the column of id, id_color, boss at first
      const data = rows.map(row => {
        const {id, id_color, boss, ...otherColumns} = row;
        // Reconstruct the row with id, id_color, and boss at the beginning
        return {id, id_color, boss, ...otherColumns};
      });

      // console.log(`Run query: ${sqlQuery}`);
      // console.log(rows);
      console.log(`resolve data:`);
      console.log(data);

      resolve(data);
    });
  });
}

function create_sql_query({ tableName, columnList }) {
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

//insert values to the dataBase, this function if for the post request
function insertIntoTable(tableName, data) {
  return new Promise((resolve, reject) => {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

    db.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}


//search people by id in the dataBase
function searchPeopleById(tableName, pattern) {
  return new Promise((resolve, reject) => {
    // Ensure tableName is safe to prevent SQL injection
    const sqlQuery = `SELECT * FROM ${tableName} WHERE id LIKE ?;`;

    db.all(sqlQuery, [pattern], (err, rows) => { // Use parameterized query for 'pattern'
      if (err) {
        reject(err);
        return;
      }

      //return the id, id_color and boss and the begining....
      const data = rows.map(row => {
        const {id, id_color, boss, ...otherColumns} = row;
        // Reconstruct the row with id, id_color, and boss at the beginning
        return {id, id_color, boss, ...otherColumns};
      });


      resolve(data);
    });
  });
}




module.exports = {
  getTableColumns,
  getAllTableAndThierColumns,
  getAllTableNames,
  getDataByQuery,
  create_sql_query,
  insertIntoTable,
  searchPeopleById
};

