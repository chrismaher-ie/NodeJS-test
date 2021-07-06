module.exports = {
    create : 'CREATE TABLE IF NOT EXISTS foods(id INTEGER PRIMARY KEY, name, category)',
    insert : `INSERT INTO foods(id, name, category) VALUES(?,?,?)`,
    insert_replace : `INSERT OR REPLACE INTO foods(id, name, category) VALUES(?,?,?)`,
    update : `UPDATE foods SET name = ?, category = ? WHERE id = ?`,
    select_all : 'SELECT * FROM foods',
    select_1 : 'SELECT * FROM foods WHERE id = ?',
    delete : 'DELETE FROM foods WHERE id = ?',
};