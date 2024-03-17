const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

// Assuming your functions are in a file named 'dbHelpers.js'
const {
  getTableColumns,
  getAllTableAndThierColumns,
  getAllTableNames,
  getDataByQuery,
  create_sql_query,
} = require('./models/sqlQuery');

app.use(bodyParser.json());

// Endpoint to get all table names
app.get('/tables', async (req, res) => {
  try {
    const tableNames = await getAllTableNames();
    res.json(tableNames);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to get columns of a specific table
// Using the uri of: http://localhost:8000/tables/all_data
app.get('/tables/:table_name', async (req, res) => {
  try {
    const tableName = req.params.table_name;
    const columns = await getTableColumns({ tableName });
    console.log(`TableName: ${tableName} ,columns: ${columns}`);

    res.json(columns);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to get data from a specific query (for simplicity, using a GET request here,
// but consider POST for actual use to avoid security issues)
app.get('/api/query', async (req, res) => {
  try {
    const sqlQuery = req.query.sqlQuery;
    const data = await getDataByQuery(sqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


// Getting all the we want by passing TableName & wanted column. 
// if no column passed. it will automaticly send all the data avilable. 
// ex. uri: http://localhost:8000/data?tableName=all_data&columns=name_he,name_en,id,home_town,age,phone_number
// ITF - create a function to check the names of the column if they are valid. if not - remove them and print an error.
app.get('/data', async (req, res) => {
    const tableName = req.query.tableName;
    const columnList = req.query.columns ? req.query.columns.split(',') : undefined;
  
    // Ensure tableName is provided
    if (!tableName) {
      return res.status(400).send('Table name is required.');
    }
  
    try {
      const data = await create_sql_query({ tableName, columnList });
      res.json(data);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  });
  







app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
