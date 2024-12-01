const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

// Middleware
app.use(bodyParser.json()); // Add this to parse JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // For URL-encoded data
app.use(express.static('public')); // Serve static files (like your HTML)

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_database',
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database!');
});

// Endpoint to Add Data
app.post('/add', (req, res) => {
    const { name, age } = req.body;
    const query = 'INSERT INTO my_table (name, age) VALUES (?, ?)';
    connection.query(query, [name, age], (err, results) => {
        if (err) {
            console.error('Error adding data:', err.message);
            res.status(500).json({ ok: false, error: 'Error adding data' });
            return;
        }
        res.json({ ok: true, message: 'Data added successfully!' });
    });
});
// Endpoint to Fetch Data
app.get('/fetch', (req, res) => {
    const query = 'SELECT * FROM my_table';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
    });
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});