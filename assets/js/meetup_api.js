/*
 * Author: Project #1 Fire
 * Project Name: Project Fire MeetUp API Search
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


// MEETUP API GET
// --------------
window.onload = function () {

    var topic = '';
    var results;

    $('#searchButton').on('click', function (event) {
        event.preventDefault(event);
        $('#meetUpHolder').empty();
        $('#noResults').empty();
        if ($('input:text').val().trim() != '') {
            topic = $('input:text').val().trim();
            getMeetUp();
            $('input:text').val('');
        };
    });

    var zip = '85254';
    var ApiKey = '1a143e3f55f5e4a64664065683536';
    var queryUrl = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';

    let getMeetUp = function () { //JSONP to avoid cross browser error
        queryUrl = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
        $.getJSON(queryUrl, null, function (data) {
            results = data.results;

            if (data.code === 'badtopic' || results.length === 0) {
                topic = 'javascript'
                queryUrl = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
                $.getJSON(queryUrl, null, function (data) {
                    results = data.results;
                    $('#noResults').html('We couldnt find any meetups meeting your search criteria. Heres a few others you may be interested in:' + '<br>' + '<br>')
                    displayMeetUp();
                });
            } else {
                displayMeetUp();
            };
        });

    };

    let displayMeetUp = function () {
        for (var i = 0; i < results.length; i++) {
            var meetUpDiv = $('<div>');
            var p = $('<p>');
            var link = $('<a>');
            var img = $('<img>');
            var time = results[i].time;
            var timeMoment = moment(time, 'x');
            var currentTime = timeMoment.format('LLL')


            img.attr('src', results[i].group.photos[0].highres_link);
            img.css('width', '150px')
            img.css('height', '100px')
            link.attr('href', results[i].event_url)
            link.attr('target', '_blank');
            link.text('RSVP');
            meetUpDiv.addClass('meetUpDiv')

            p.html("<br>" + results[i].name + '<br>' + results[i].venue.name + '<br>' + results[i].venue.city + ', ' + results[i].venue.state + '<br>' + "Next Event: " + currentTime);
            meetUpDiv.append(p);
            meetUpDiv.append(img);
            $('#meetUpPanel').append(meetUpDiv);
            $('#meetUpPanel').append(link);


        }
    };
};