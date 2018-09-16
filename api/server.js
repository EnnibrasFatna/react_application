var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var mongoDB = "mongodb://localhost:27017/db";
var http = require("http");
mongoose.connect(mongoDB, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
var Schema = mongoose.Schema;

var RecipesModelSchema = new Schema({
    img: String,
    title: String,
    description: String,
    time: String,
    ingredients: String
});

var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
};
// Compile model from schema
var RecipeModel = mongoose.model("recipes", RecipesModelSchema);
0;
// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", () => {
    console.log("Mongoose connection successful.");
});

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(allowCrossDomain);

// Delete todo
app.delete("/recipe/:id", function(req, res) {
    RecipeModel.findByIdAndRemove(req.params.id, function(err) {
        if (err) res.send(err);
        res.json({ message: "Removed!!" });
    });
});

//Save recipes
app.post("/recipe", async (req, res, next) => {
    var recipe = req.body;
    var NewRecipeModel = new RecipeModel(recipe);
    console.log(req.body);
    try {
        const NewRecipe = await NewRecipeModel.save();
        res.send(NewRecipe);
    } catch (e) {
        res.send(err);
    }
});

// Get Single Task
app.get("/recipe/:id", function(req, res, next) {
    RecipeModel.findById(req.params.id, function(err, recipe) {
        if (err) {
            res.send(err);
        }
        res.send(recipe);
    });
});

// Get All recipes
app.get("/recipes", async (req, res) => {
    try {
        const recipes = await RecipeModel.find();
        res.send(recipes);
    } catch (e) {
        res.send(err);
    }
});

// Update todo
app.put("/recipe/:id", function(req, res) {
    RecipeModel.findById(req.params.id, function(err, recipe) {
        if (!recipe) return next(new Error("Could not load Document"));
        else {
            // do your updates here
            recipe.title = req.body.title;
            recipe.description = req.body.description;
            recipe.time = req.body.time;
            recipe.ingredients = req.body.ingredients;
            recipe.save(function(err) {
                if (err) console.log("error");
                else console.log("success");
            });
        }
    });
});

//some other code

app.listen(3000, function() {
    console.log("listening on 3000");
});

module.exports = mongoose.model("RecipeModel", RecipesModelSchema);
