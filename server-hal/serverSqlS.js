const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const cors = require('cors');

// Adjust the require path to your new SQL Server query file
const {
  getTableColumns,
  getAllTableNames,
  getDataByQuery,
  createSqlQuery,
  insertIntoTable,
  searchPeopleById
} = require('./models/sqlQuerySqlServer'); // Adjusted for SQL Server

const apiV = '/api/v1'

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get all table names 
app.get(`${apiV}/tables`, async (req, res) => {
  try {
    const tableNames = await getAllTableNames();
    res.json(tableNames);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to get columns of a specific table
app.get(`${apiV}/table/:table_name`, async (req, res) => {
  try {
    const tableName = req.params.table_name;
    const columns = await getTableColumns(tableName); // Adjusted for SQL Server
    res.json(columns);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to get data from a specific query (for simplicity, using a GET request here,
// but consider POST for actual use to avoid security issues)
app.get(`${apiV}/query`, async (req, res) => {
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
// ex. uri: http://localhost:8000/api/v1/data?tableName=persons&columns=name_he,name_en,id,age
// ITF - create a function to check the names of the column if they are valid. if not - remove them and print an error.
app.get(`${apiV}/data`, async (req, res) => {
  const tableName = req.query.tableName;
  const columnList = req.query.columns ? req.query.columns.split(',') : undefined;

  // Ensure tableName is provided
  if (!tableName) {
    return res.status(400).send('Table name is required.');
  }

  try {
    const data = await createSqlQuery({ tableName, columnList });
    res.json(data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


// POST endpoint to insert data into a table
// http://localhost:8000/api/v1/data?tableName=persons&columns=name_he,name_en,id,age
app.post(`${apiV}/data`, async (req, res) => {
  const { tableName, data } = req.body;
  console.log('Received data:', tableName, data); // Log incoming data

  if (!tableName || !data) {
    return res.status(400).send('Table name and data are required.');
  }

  try {
    const result = await insertIntoTable(tableName, data);
    console.log('Insert result:', result); // Log success result
    res.status(201).send(result);
  } catch (error) {
    console.error('Insertion error:', error); // Log any error that occurs
    res.status(500).send(error.message);
  }
});


// Endpoint to get all info by searching people with id
// Using the uri of: http://localhost:8000/api/search/:tableName/:id
app.get(`${apiV}/search/:tableName/:id`, async (req, res) => {
  try {
    const { tableName, id } = req.params;
    console.log(id);
    const data = await searchPeopleById(tableName, id);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

