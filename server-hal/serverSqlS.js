const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const cors = require('cors');

const router = express.Router();

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

/**
 * @swagger
 * /api/v1/tables:
 *   get:
 *     summary: Retrieves a list of all table names.
 *     responses:
 *       200:
 *         description: A JSON array of table names.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: An error occurred on the server.
 */
router.get(`${apiV}/tables`, async (req, res) => {
  // Endpoint to get all table names 
  try {
    const tableNames = await getAllTableNames();
    res.json(tableNames);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


/**
 * @swagger
 * /api/v1/table/{table_name}:
 *   get:
 *     summary: Retrieves column information for a specific table.
 *     parameters:
 *       - in: path
 *         name: table_name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the table
 *     responses:
 *       200:
 *         description: A JSON object containing column information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: An error occurred on the server.
 */
router.get(`${apiV}/table/:table_name`, async (req, res) => {
  // Endpoint to get columns of a specific table
  try {
    const tableName = req.params.table_name;
    const columns = await getTableColumns(tableName); // Adjusted for SQL Server
    res.json(columns);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


/**
 * @swagger
 * /api/v1/query:
 *   get:
 *     summary: Retrieves data based on a SQL query.
 *     parameters:
 *       - in: query
 *         name: sqlQuery
 *         required: true
 *         schema:
 *           type: string
 *         description: The SQL query to execute
 *     responses:
 *       200:
 *         description: Data retrieved based on the SQL query.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: An error occurred on the server.
 */
router.get(`${apiV}/query`, async (req, res) => {
  // Endpoint to get data from a specific query (for simplicity, using a GET request here,
  // but consider POST for actual use to avoid security issues)
  try {
    const sqlQuery = req.query.sqlQuery;
    const data = await getDataByQuery(sqlQuery);
    res.json(data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});




/**
 * @swagger
 * /api/v1/data:
 *   get:
 *     summary: Retrieves data from a specified table, optionally filtered by columns.
 *     parameters:
 *       - in: query
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the table
 *       - in: query
 *         name: columns
 *         schema:
 *           type: string
 *         description: Optional, comma-separated list of column names to include in the result
 *     responses:
 *       200:
 *         description: Data from the specified table.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       400:
 *         description: Table name not provided.
 *       500:
 *         description: An error occurred on the server.
 */
router.get(`${apiV}/data`, async (req, res) => {
  // Getting all the we want by passing TableName & wanted column. 
  // if no column passed. it will automaticly send all the data avilable. 
  // ex. uri: http://localhost:8000/api/v1/data?tableName=persons&columns=name_he,name_en,id,age
  // ITF - create a function to check the names of the column if they are valid. if not - remove them and print an error.
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



/**
 * @swagger
 * /api/v1/data:
 *   post:
 *     summary: Inserts data into a specified table.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableName:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Data successfully inserted.
 *       400:
 *         description: Table name and data are required.
 *       500:
 *         description: An error occurred on the server.
 */
router.post(`${apiV}/data`, async (req, res) => {
  // POST endpoint to insert data into a table
  // http://localhost:8000/api/v1/data?tableName=persons&columns=name_he,name_en,id,age
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



/**
 * @swagger
 * /api/v1/search/{tableName}/{id}:
 *   get:
 *     summary: Retrieves information by searching people with ID in a specified table.
 *     parameters:
 *       - in: path
 *         name: tableName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the table
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID to search for
 *     responses:
 *       200:
 *         description: People information matching the ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: An error occurred on the server.
 */
router.get(`${apiV}/search/:tableName/:id`, async (req, res) => {
  // Endpoint to get all info by searching people with id
  // Using the uri of: http://localhost:8000/api/search/:tableName/:id
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

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

module.exports = router;