const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const body_parser = require('body-parser');
const app = express();
//const db = new sqlite3.Database('mydatabase.db');
const port = 5000;


const Book = require("./models/Book");

const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create books table if not exists
        db.run('CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, genre TEXT, price REAL)', (createTableErr) => {
            if (createTableErr) {
                console.error(createTableErr.message);
            } else {
                console.log('Table created successfully.');
            }
        });
    }
});


app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello, Oshayer!');
});

app.post('/api/books', (req, res) => {
    const { title, author, genre, price } = req.body;

    // Check if 'price' is a valid number
    if (typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid price value. Please provide a valid number.' });
    }

    // Insert a new book into the books table with the provided ID
    const stmt = db.prepare('INSERT INTO books (title, author, genre, price) VALUES (?, ?, ?, ?)');
    stmt.run(title, author, genre, price, (err) => {
        if (err) {
            
            if (err.message.includes('UNIQUE constraint failed: books.id')) {
                return res.status(409).json({ error: 'Book with the provided ID already exists.' });
            }

            console.error(err.message);
            return res.status(500).json({ error: 'Error saving book to the database' });
        }

        const bookId = stmt.lastID;
        const newBook = new Book(bookId, title, author, genre, price);

        res.status(201).json(newBook);
    });
    stmt.finalize();
});

app.get('/users',(req,res) => {
    db.all('SELEct id, name FROM users',(err,rows) => {
        if(err){
            console.log("Error Occur");
            res.send("Error Occur");
        }

        res.json(rows);
    });

});


// DELETE endpoint to delete a user by ID
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
  
    // Delete the user from 'users' table
    db.run('DELETE FROM users WHERE id = ?', userId, (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
  
      res.json({ message: 'User deleted successfully.' });
    });
  });




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
