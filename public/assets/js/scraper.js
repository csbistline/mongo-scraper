// Get references to page elements
var $scrapeResults = $("#scrape-results");
var $scrapeBtn = $("#scrape-btn");
var $clearBtn = $("#clear-btn");

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


const scrapeSite = function (event) {
    event.preventDefault();
    console.log("scraper button pressed");

    API.scrapeDB().then(
        API.getArticles()
            .then(function (result) {
                // console.log(result);
                displayScraped(result);
            }));
};

const displayScraped = function (result) {
    console.log("rendering articles");
    console.log(result);
    
    

    // build list of articles
    let $articles = result.map(function (article) {
        let $p = $("<p>")
            .addClass("article")
            .attr("data-id", article._id);
        let $title = $("<h6>")
            .text(article.title);
        let $link = $("<a>")
            .text("Read story")
            .attr("href", article.link)
            .attr("target", "_blank");

        $p
            .append($title)
            .append($link)
            .append("<hr>");
        
        return $p;
    });

    // clear results area and display
    $scrapeResults.empty();
    $scrapeResults.append($articles);
};


// Add event listeners to buttons
$scrapeBtn.on("click", scrapeSite);
//$clearBtn.on("click", clearScraped);