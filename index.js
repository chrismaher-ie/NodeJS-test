const express = require('express');

const app = express();

const port = 3000;

//parse Json
app.use(express.json());
app.use(express.urlencoded({extended: false}));

let foods = [{
    id: "1",
    name: "apple",
    category: "fruit"
},
{
    id: "2",
    name: "banana",
    category: "fruit"
},
{
    id: "3",
    name: "water",
    category: "drink"
}];

//Get apis
app.get("/foods", (req, res) => {
    res.json(foods);
});

app.get("/foods/:id", (req, res) => {
    const id = req.params.id;
    for (const food of foods) {
        if (food.id === id) {
            return res.json(food);
        }
    }
    return res.status(404).json("Food not found");
});

//Post api
app.post("/foods", (req, res) => {
    const food = req.body;
    console.log(`Added Food item:\n${JSON.stringify(food, null, "  ")}`);
    foods.push(food);
    res.send("Food item added to list");
})

app.delete("/foods/:id", (req, res) => {
    const id = req.params.id;
    for( var i = 0; i < foods.length; i++){ 

        if (foods[i].id === id) {
            foods.splice(i, 1); 
            return res.send(`Food item ${id} removed from list`);
        }
    }
    return res.status(404).json("Food not found");
});

app.listen(port, () => console.log(`Server listining on port ${port}`));