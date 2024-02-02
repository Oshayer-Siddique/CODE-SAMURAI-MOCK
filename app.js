const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
//const db = new sqlite3.Database('mydatabase.db');
const port = 3000;




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

app.post('/users',(req,res) => {
    const {name} = req.body;

    const insertStmt = db.prepare('INSERT INTO users (name) VALUES (?)');
    insertStmt.run(name);
    insertStmt.finalize();

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
