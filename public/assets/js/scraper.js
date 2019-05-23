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
    },

    getOneArticle: function (id) {
        return $.ajax({
            url: "/api/articles/" + id,
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
            .addClass("article");
        let $title = $("<div>")
            .text(article.title + "   ")
            .addClass("font-weight-normal");
        let $span = $("<span>")
            .addClass("align-right");
        let $link = $("<a>")
            .text("Read story")
            .addClass("badge badge-secondary mr-2 float-right")
            .attr("href", article.link)
            .attr("target", "_blank");
        let $btn = $("<a>")
            .text("Save story")
            .addClass("badge badge-primary save-btn float-right")
            .attr("href", "#")
            .attr("data-id", article._id);
        $span.append($btn).append($link);
        $title.append($span);

        $p
            .append($title)
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
$(document).on("click", ".save-btn", saveStory);

// on load
$(document).ready(
    API.getArticles()
        .then(function (result) {
            console.log("document ready, loading articles");
            // console.log(result);
            displayScraped(result);
        })
);