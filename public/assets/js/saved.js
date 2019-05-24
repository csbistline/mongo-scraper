// Get references to page elements
var $savedResults = $("#saved-results");
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
    clearSavedDB: function () {
        return $.ajax({
            url: "api/saved/clear",
            type: "GET"
        });
    },

    getSavedArticles: function () {
        return $.ajax({
            url: "/api/saved/",
            type: "GET"
        });
    },

    getOneSavedArticle: function (id) {
        return $.ajax({
            url: "/api/saved/" + id,
            type: "GET"
        });
    }
};


// renders articles on page from savedarticles DB
const displaySaved = function (result) {
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
        let $read = $("<a>")
            .text("Read story")
            .addClass("badge badge-primary mr-2 float-right")
            .attr("href", article.link)
            .attr("target", "_blank");
        let $delete = $("<a>")
            .text("Delete story")
            .addClass("badge badge-danger delete-btn float-right")
            .attr("href", "#")
            .attr("data-id", article._id);
        let $note = $("<a>")
            .text("Add note")
            .addClass("badge badge-secondary note-btn mr-2 float-right")
            .attr("href", "#")
            .attr("data-id", article._id);
        $span.append($delete).append($read).append($note);
        $title.append($span);

        $p
            .append($title)
            .append("<hr>");

        return $p;
    });

    // clear results area and display
    $savedResults.empty();
    $savedResults.append($articles);
};

// delete all scraped articles from DB
const clearSaved = function (event) {
    event.preventDefault();
    API.clearSavedDB()
        .then(function (result) {
            console.log(result);
            $savedResults.empty();
        });
};

// Add event listeners to buttons
$clearBtn.on("click", clearSaved);
// $(document).on("click", ".save-btn", saveStory);

// on load
$(document).ready(
    API.getSavedArticles()
        .then(function (result) {
            console.log("document ready, loading articles");
            // console.log(result);
            displaySaved(result);
        })
);