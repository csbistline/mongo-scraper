// Router setup
var express = require("express");
var router = express.Router();

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Routes

// "/" route for homepage
router.get("/", (req, res) => {
    res.render("index");
});

// scrape route to collect data from MLB.com
router.get("/scrape", function (req, res) {
    var scrapedData = scrape();
    console.log(scrapedData);
    res.json(scrapedData);
});

// scraper function
function scrape() {
    axios.get("https://www.mlb.com")
        .then(function (response) {

            // Load the HTML into cheerio and save it to a variable
            var $ = cheerio.load(response.data);

            // scrape HTML fro headline links
            $("a.p-headline-stack__link").each(function (i, element) {

                var title = $(element).text();
                var link = $(element).attr("href");

                // Save these results in an object that we'll push into the results array we defined earlier
                db.Article.create({
                    title: title,
                    link: link
                })
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log("Article inserted");
                        return dbArticle;
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
        });
}

// delete articles in collection
router.get("/clear", function (req, res) {
    db.Article.deleteMany({})
        .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            console.log("documents deleted");
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
});




/*


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
*/


module.exports = router;