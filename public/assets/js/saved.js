// ==========================
// jQuery setup
// ==========================

// Get references to page elements
const $savedResults = $("#saved-results");
const $clearBtn = $("#clear-btn");
const $saveNoteBtn = $("#save-note");

// ==========================
// API setup
// ==========================

// The API object contains methods for each kind of request we'll make
const API = {
    clearSavedDB: function () {
        return $.ajax({
            url: "/api/saved/clear",
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
    },

    deleteOneSavedArticle: function (id) {
        return $.ajax({
            url: "/api/saved/clear/" + id,
            type: "DELETE"
        });
    },

    createNote: function (id, note) {
        return $.ajax({
            method: "POST",
            url: "/api/notes/" + id,
            data: {
                body: note
            }
        });
    }
};



// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


// ==========================
// FUNCTIONS
// ==========================

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

// SAVED STORIES

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
        // .attr("data-toggle", "modal")
        // .attr("data-target", ".note-modal");
        $span.append($delete).append($read).append($note);

        let $row = $("<div>")
            .addClass("row");
        let $col1 = $("<div>")
            .addClass("col-sm-6");
        let $col2 = $("<div>")
            .addClass("col-sm-6");

        $col2.append($span);
        $col1.append($title);
        $row.append($col1).append($col2);
        $p
            .append($row)
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

// delete one saved story from DB
const deleteSavedStory = function (event) {
    event.preventDefault();
    const id = $(this).attr("data-id");
    API.deleteOneSavedArticle(id)
        .then(function (result) {
            console.log(result);
            API.getSavedArticles()
                .then(function (result) {
                    displaySaved(result);
                });
        });
};

// NOTES

// add this to other modal calls, grab note data to populate noteText
const showModal = function () {
    const $id = $(this).attr("data-id");
    console.log($id);
    $("#noteModal").modal("show");
    $("#noteText").attr("data-id", $id);
    API.getOneSavedArticle($id)
        .then(function (data) {
            console.log(data);
            if (data.note) {
                $("#noteText").val(data.note.body);
            }
        });

};

const saveNote = function () {
    // grab note value
    const $note = $("#noteText").val().trim();
    const $id = $("#noteText").attr("data-id");
    console.log($id, $note);

    API.createNote($id, $note)
        .then(function (response) {
            // Log the response
            console.log(response);
            // Empty the notes section
            $("#noteModal").modal("hide");
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#noteText").val("");
};

// ==========================
// EVENT LISTENERS
// ==========================

// buttons
$clearBtn.on("click", clearSaved);
$saveNoteBtn.on("click", saveNote);
$(document).on("click", ".delete-btn", deleteSavedStory);
$(document).on("click", ".note-btn", showModal);


// on load
$(document).ready(
    API.getSavedArticles()
        .then(function (result) {
            console.log("document ready, loading articles");
            displaySaved(result);
        })
);