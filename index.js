const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files (like your HTML)

// MySQL Connection Pool
const pool = mysql.createPool({
    host: 'localhost',     // Your database host
    user: 'root',          // Your database user
    password: 'password',  // Your database password
    database: 'my_database', // Your database name
    waitForConnections: true,
    connectionLimit: 10,   // Adjust connection limit as needed
    queueLimit: 0
});

// Apply the schema using the connection pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database!');

    // Read and execute schema.sql
    const schema = fs.readFileSync('schema.sql', 'utf8');
    connection.query(schema, (err) => {
        connection.release(); // Always release the connection back to the pool
        if (err) {
            console.error('Error applying schema:', err.message);
        } else {
            console.log('Database schema applied successfully!');
        }
    });
});

// Endpoint to Add Data
app.post('/add', (req, res) => {
    const { name, age } = req.body;
    const query = 'INSERT INTO my_table (name, age) VALUES (?, ?)';
    pool.query(query, [name, age], (err, results) => {
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
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
    });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});