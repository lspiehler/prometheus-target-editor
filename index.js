const express = require('express');
const path = require('path');
const app = express();

// Parse incoming JSON data
app.use(express.json());

// Parse incoming URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "mdocs" directory
app.use('/', express.static(path.join(__dirname, 'static')));
app.use('/js/tabulator', express.static(path.join(__dirname, 'node_modules/tabulator-tables/dist/js')));
app.use('/css/tabulator', express.static(path.join(__dirname, 'node_modules/tabulator-tables/dist/css')));
app.use('/js/select2', express.static(path.join(__dirname, 'node_modules/select2/dist/js')));
app.use('/css/select2', express.static(path.join(__dirname, 'node_modules/select2/dist/css')));
app.use('/js/jquery', express.static('./node_modules/jquery/dist'));

// Optional: Handle a default route
app.get('/', (req, res) => {
  res.send('Welcome to the Express.js server');
});

var routes = require(path.join(__dirname, 'routes/index'));
app.use('/', routes);

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});