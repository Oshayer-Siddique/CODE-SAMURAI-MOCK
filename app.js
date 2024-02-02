const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const body_parser = require('body-parser');
const app = express();
//const db = new sqlite3.Database('mydatabase.db');
const port = 5000;


const Book = require("./models/Book");

const db = new sqlite3.Database('mydatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');


app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello, Oshayer!');
});

app.post('/api/books',(req,res) => {
    const { id, title, author, genre, price } = req.body;

    // Insert a new book into the books table with the provided ID
    const stmt = db.prepare('INSERT INTO books (id, title, author, genre, price) VALUES (?, ?, ?, ?, ?)');
    stmt.run(id, title, author, genre, price, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error saving book to the database' });
        } else {
            // Create a Book instance using the provided book ID
            const newBook = new Book(id, title, author, genre, price);

            res.status(201).json(newBook);
        }
    });
    stmt.finalize();

    res.status(201).json({ message: 'User created successfully.' });



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
