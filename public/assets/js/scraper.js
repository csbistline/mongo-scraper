// Get references to page elements
var $scrapeResults = $("#scrape-results");
var $scrapeBtn = $("#scrape-btn");
var $clearBtn = $("#clear-btn");

// delay promise workaround for displaying results
const delayPromise = function (duration) {
    return function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, duration);
        });
    };
};

// The API object contains methods for each kind of request we'll make
const API = {
    scrapeDB: function () {
        return $.ajax({
            url: "api/scrape",
            type: "GET"
        });
    },

    clearDB: function () {
        return $.ajax({
            url: "api/clear",
            type: "GET"
        });
    },

    getArticles: function () {
        return $.ajax({
            url: "/api/articles",
            type: "GET"
        });
    }
};

// function that scrapes site, then calls displayScrapped
const scrapeSite = function (event) {
    event.preventDefault();

    // something going on here that it won't refresh the articles ...
    return API.scrapeDB()

        // wait 500ms to let articles store in db
        .then(delayPromise(1000))
        .then(function (result) {
            return API.getArticles()
                .then(function (result) {
                    if (result.length) {
                        displayScraped(result);
                    }
                });
        });
};

// renders articles on page from scraped DB
const displayScraped = function (result) {
    console.log("rendering articles");
    console.log(result);

    // build list of articles
    let $articles = result.map(function (article) {
        let $p = $("<p>")
            .addClass("article")
            .attr("data-id", article._id);
        let $title = $("<h6>")
            .text(article.title + "   ");
        let $link = $("<a>")
            .text("Read story")
            .attr("href", article.link)
            .attr("target", "_blank");
        $title.append($link);
        $p
            .append($title)
            // .append($link)
            .append("<hr>");

        return $p;
    });

    // clear results area and display
    $scrapeResults.empty();
    $scrapeResults.append($articles);
};


const clearScraped = function (event) {
    event.preventDefault();
    API.clearDB()
        .then(function (result) {
            console.log(result);
            $scrapeResults.empty();
        });
};

// Add event listeners to buttons
$scrapeBtn.on("click", scrapeSite);
$clearBtn.on("click", clearScraped);

// on load
$(document).ready(
    API.getArticles()
        .then(function (result) {
            console.log("document ready, loading articles");
            // console.log(result);
            displayScraped(result);
        })
);