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


    if (typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid price value. Please provide a valid number.' });
    }

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


app.put('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    const { title, author, genre, price } = req.body;

    if (price !== undefined && typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid price value. Please provide a valid number.' });
    }

    const stmt = db.prepare('UPDATE books SET title = ?, author = ?, genre = ?, price = ? WHERE id = ?');
    stmt.run(title, author, genre, price, bookId, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error updating book in the database' });
        }

        if (stmt.changes === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        db.get('SELECT * FROM books WHERE id = ?', bookId, (selectErr, row) => {
            if (selectErr) {
                console.error(selectErr.message);
                return res.status(500).json({ error: 'Error retrieving updated book from the database' });
            }

            const updatedBook = Book.fromData(row);

            res.json(updatedBook);
        });
    });
    stmt.finalize();
});

app.get('/api/books/:id', (req, res) => {
    const bookId = req.params.id;

    db.get('SELECT * FROM books WHERE id = ?', bookId, (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error retrieving book from the database' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const book = Book.fromData(row);

        res.json(book);
    });
});

// app.get('/api/books', (req, res) => {
    
//     db.all('SELECT * FROM books', (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Error retrieving books from the database' });
//         }

//         const books = rows.map((row) => Book.fromData(row));

//         res.json(books);
//     });
// });


app.get('/api/books', (req, res) => {
    const { title, author, genre, sort, order } = req.query;

    let query = 'SELECT * FROM books WHERE 1';
    let params = [];

    // Add search conditions based on provided search fields
    if (title) {
        query += ' AND title = ?';
        params.push(title);
    }
    if (author) {
        query += ' AND author = ?';
        params.push(author);
    }
    if (genre) {
        query += ' AND genre = ?';
        params.push(genre);
    }

    // Add sorting conditions based on provided sorting field and order
    let orderBy = 'ORDER BY id ASC'; // Default sorting by ID in ascending order
    if (sort) {
        orderBy = `ORDER BY ${sort} ${order || 'ASC'}, id ASC`;
    }

    // Finalize the query
    query += ` ${orderBy}`;

    // Execute the query
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error retrieving books from the database' });
        }

        // Create Book instances for each row in the result set
        const books = rows.map((row) => Book.fromData(row));

        // Return the result wrapped in a 'books' object
        res.json({ books });
    });
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
  
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
