const sqlite3 = require('sqlite3').verbose();

const sql = require('./food_queries');

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
    db.run(sql.create);
    
    for (const food of foods) {
        db.run(sql.insert_replace, [food.id, food.name, food.category], function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }
});


function index(req, res) {
    db.all(sql.select_all, (err, rows) => {
        if (err) {
          throw err;
        }
        return res.json(rows);
    });
};

function show(req, res) {
    const id = req.params.id;

    db.get(sql.select_1, [id], (err, row) => {
        if (err) {
          throw err;
        }
        if (!row) return res.status(404).json("Food not found");
        
        return res.json(row);
    });
}

function store(req, res) {
    const food = req.body;

    db.run(sql.insert, [food.id, food.name, food.category], (err) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') return  res.status(409).json("Item already exists");

            throw err;
        }        
        return res.status(201).json("Food item added to list");
    });
}

function update(req, res) {
    const id = req.params.id;
    const food = req.body;

    db.run(sql.update, [food.name, food.category, id], function(err) {
        if (err) {
            throw err;
        }
        if(!this.changes) return res.status(404).json("Food item to update not found");
        return res.status(200).json("Food item updated");
    });
}

function destroy(req, res) {
    const id = req.params.id;

    db.run(sql.delete, [id], function(err) {
        if (err) {
            throw err;
        }
        if(!this.changes) return res.status(404).json("Food item to delete not found");
        return res.status(204).json("Food item deleted");
    });
}

module.exports = {
    index : index,
    show : show,
    store : store,
    update : update,
    destroy : destroy,
};