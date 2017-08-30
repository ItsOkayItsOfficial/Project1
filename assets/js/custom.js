/*
 * Author: Project #1 Fire
 * Project Name: Project Fire JS
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */


// Function - On document load
$(document).ready(function () {
    // Variable - Array for course topics
    var topics = [];

    function displayCourses() {
        var searchInput = $(this).data("search");
        console.log(searchInput);
        var getAPI = $.get('https://www.udacity.com/public-api/v0/courses');
        console.log(getAPI);

        // Promise - Run on response from Giphy API
        getAPI.done(function (response) {
            // Variable - Results of response from Khan API
            var results = response.courses;
            console.log("Results:", results);
            var courses = results[('title')];
            console.log("Course", courses);

            for (var i = 0; i < results.length; i++) {
                if (searchInput == courses) {
                    console.log("success");
                } else {
                    console.log("failure");
                }
            };

        });
        // END - getAPI.done(function (response) 

    };
    // END - displayCourses()

     // onClick - Button id="addShow" runs function displayButtons and displaySubjectShow
  $("#searchButton").on("click", function (event) {
    event.preventDefault();
    // Variable - Read text of input field id="subjectInput"
    var search = $("#searchInput").val().trim();
    // Push - newShow into topics array
    topics.push(search);
    console.log("Searched courses:", topics);
    // Clear text input of id="subjectInput"
    $("#searchInput").val("");
    // Run Function - Displays search input as button
    displayCourses();
  });
  // END - $("#searchButton").on("click", function (event)

    $(document).on("click", "#searchButton", displayCourses);

});
// END - ready(function ()
