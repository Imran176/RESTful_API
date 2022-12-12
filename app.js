//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// Connection to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true }, () => {
    console.log("===>> Connected to MongoDB <<===")
});

// Creating Schema
const articleSchema = {
    title: String,
    content: String,
};

// Creating Model
const Article = mongoose.model("Article", articleSchema);

// TODO -> HTTP verbs (GET, POST, PUT, PATCH, DELETE)

// Chained Route Handlers using Express => Reduces redundancy & typos
// app.route("/articles")
//     .get(function (req, res) { })
//     .post(function (req, res) { })
//     .delete(function (req, res) { })

// ========================= Request Targeting All Articles =========================

// HTTP verb -> (GET request) => Fetches all articles
app.get("/articles", function (req, res) {
    Article.find(function (err, foundArticles) {
        if (!err) {
            // console.log("Articles found: ", foundArticles);
            res.send(foundArticles)
        } else {
            res.send(err)
        }
    });
});

// HTTP verb -> (POST request) => Creates/Adds a new article
app.post("/articles", function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function (err) {
        if (!err) {
            res.send("New Article Added Successfully")
        } else {
            res.send("Error Adding New Article: ", err)
        }
    });
});

// HTTP verb -> (DELETE request) => Deletes all articles
app.delete("/articles", function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("All Articles Deleted!")
        } else {
            res.send("Error Deleting all Articles: ", err)
        }
    })
});

// ========================= Request Targeting Specific Article =========================

// HTTP verb -> (GET request) => Fetches a specific article only
app.get("/articles/:articleTitle", function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
        if (!err) {
            res.send(foundArticle)
        } else {
            res.send("No article matching that title was found: ", err)
        }
    })
});

// HTTP verb -> (PUT request) => Updates one entire article
app.put("/articles/:articleTitle", function (req, res) {
    Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true },
        function (err) {
            if (!err) {
                res.send("Article updated successfully")
            } else {
                res.send("Article could not be updated: ", err)
            }
        }
    );
});

// HTTP verb -> (PATCH request) => Updates a portion of an existing record.
app.patch("/articles/:articleTitle", function (req, res) {
    Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { $set: req.body },
        function (err) {
            if (!err) {
                res.send("Specific portion of the article was updated successfully")
            } else {
                res.send("Specific portion of the article could not be updated: ", err)
            }
        }
    );
});

// HTTP verb -> (DELETE request) => Deletes a specific article
app.delete("/articles/:articleTitle", function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
        if (!err) {
            res.send("The Article was deleted successfully")
        } else {
            res.send("Error Deleting the Article: ", err)
        }
    })
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});