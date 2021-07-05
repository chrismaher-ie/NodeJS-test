const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const port = 3000;

const app = express();
//parse Json
app.use(express.json());
app.use(express.urlencoded({extended: false}));

let sql_create = 'CREATE TABLE IF NOT EXISTS foods(id INTEGER PRIMARY KEY, name, category)';
let sql_insert = `INSERT INTO foods(id, name, category) VALUES(?,?,?)`;
let sql_insert_replace = `INSERT OR REPLACE INTO foods(id, name, category) VALUES(?,?,?)`;
let sql_update = `UPDATE foods SET name = ?, category = ? WHERE id = ?`;
let sql_select_all = 'SELECT * FROM foods';
let sql_select_1 = 'SELECT * FROM foods WHERE id = ?';
let sql_delete = 'DELETE FROM foods WHERE id = ?';


let foods = [
    {   id: 1, name: "apple",   category: "fruit"},
    {   id: 2, name: "banana",  category: "fruit"},
    {   id: 3, name: "water",   category: "drink"}
];

let db = new sqlite3.Database('./db/test.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
    db.run(sql_create);
    
    for (const food of foods) {
        db.run(sql_insert_replace, [food.id, food.name, food.category], function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }
});

async function getAll() {
    let sql_select_all = 'SELECT * FROM foods';
    db.all(sql_select_all, (err, rows) => {
        if (err) {
          throw err;
        }
        return rows;
    });
}

//Get apis
app.get("/foods", (req, res) => {

   
    db.all(sql_select_all, (err, rows) => {
        if (err) {
          throw err;
        }
        res.json(rows);
    });
});

app.get("/foods/:id", (req, res) => {
    const id = req.params.id;

    db.get(sql_select_1, [id], (err, row) => {
        if (err) {
          throw err;
        }
        if (!row) return res.status(404).json("Food not found");
        
        return res.json(row);
    });
});

//Post api
app.post("/foods", (req, res) => {
    const food = req.body;

    db.run(sql_insert, [food.id, food.name, food.category], (err) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') return  res.status(409).json("Item already exists");

            throw err;
        }        
        return res.status(201).json("Food item added to list");
    });
    
})

app.put("/foods/:id", (req, res) => {
    const id = req.params.id;
    const food = req.body;

    db.run(sql_update, [food.name, food.category, id], function(err) {
        if (err) {
            throw err;
        }
        if(!this.changes) return res.status(404).json("Food item to update not found");
        return res.status(200).json("Food item updated");
    });
    
})

app.delete("/foods/:id", (req, res) => {
    const id = req.params.id;

    db.run(sql_delete, [id], function(err) {
        if (err) {
            throw err;
        }
        if(!this.changes) return res.status(404).json("Food item to delete not found");
        return res.status(204).json("Food item deleted");
    });
});

app.listen(port, () => console.log(`Server listining on port ${port}`));