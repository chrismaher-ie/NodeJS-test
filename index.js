const express = require('express');
const food_controller = require('./db/food_controller');

const port = 3000;

const app = express();
//parse Json
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Get apis
app.get("/foods", (req, res) => {
    return food_controller.index(req, res);
   
});

app.get("/foods/:id", (req, res) => {
    return food_controller.show(req, res);
});

//Post api
app.post("/foods", (req, res) => {
    return food_controller.store(req, res);
})

app.put("/foods/:id", (req, res) => {
    return food_controller.update(req, res);
    
})

app.delete("/foods/:id", (req, res) => {
    return food_controller.destroy(req, res);
});

app.listen(port, () => console.log(`Server listining on port ${port}`));