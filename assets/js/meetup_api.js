/*
 * Author: Project #1 Fire
 * Project Name: Project Fire MeetUp API Search
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */


//-----------------------------------------------------MeetUp Variables-------------------------------------------------------------------//

var topic = '';
var zip = '';
var results;
var meetUpKey = '1a143e3f55f5e4a64664065683536';
var queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
var tryZip = '';
var sidebarId = '';
var defaultTopic = '';


//-----------------------------------------------------Zip Code/Search logic-----------------------------------------------------------------------//

//returns boolean; checks if user input is valid US zip code
function isValidUSZip(isZip) {
    return /^\d{5}(-\d{4})?$/.test(isZip);
}

//on click of the zip code 'Go!' button.
$('#zipSearch').on('click', function (event) {
    event.preventDefault(event);
    tryZip = $('#userZip:text').val();
    $('#noZip').html('')

    //if Valid zip code set as user zip code and stores zip code locally.
    if (isValidUSZip(tryZip) === true) {
        zip = tryZip;
        localStorage.clear();
        localStorage.setItem('zip', zip);
        $('#zipHolder').html('Current Zip Code: ' + zip + ' <span class="caret"></span>');
        $('#searchError').html('');
        $('#zipHolder, #zipSearch, #zipForm').toggle();
    }

    //if invalid zip, turns the search box red
    else {
        $('#zipForm').addClass('has-error');
    }
});

//Function to change zip code
$('#changeZip').on('click', function (event) {
    $('#zipHolder, #zipSearch, #zipForm').toggle();
    $('#userZip:text').val('');
    $('#zipForm').removeClass('has-error');
});

//checks if there is a zip in local storage, if there is, sets that as current zip
let checkZip = function () {
    if (localStorage.getItem("zip") !== null) {
        zip = localStorage.getItem('zip');
        $('#zipHolder').html('Current Zip Code: ' + zip + ' <span class="caret"></span>');
        $('#searchError').html('');
        $('#zipHolder, #zipSearch, #zipForm').toggle();
    };
};


//-----------------------------------------------------------MeetUp API Call-----------------------------------------------------------------------------//

let getMeetUp = function () {
    queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';

    //initial API call
    $.getJSON(queryUrl, null, function (data) {
        results = data.results;

        //if no meetup found based on user search, defaults to javascript meetups
        if (data.code === 'badtopic' || results.length === 0 || results == undefined) {
            defaultTopic = 'javascript'
            queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + defaultTopic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
            $.getJSON(queryUrl, null, function (data) {
                results = data.results;
                displayMeetUp();
            })
        } else {
            $('#meetUpSidebar').html('');
            displayMeetUp();
        };
    });
};

//Dynamically displays meetup sidebar, reformats unix time for next event
let displayMeetUp = function () {
    for (var i = 0; i < 3; i++) {
        var meetUpDiv = $('<div>');
        var p = $('<p>');
        var link = $('<a>');
        var img = $('<img>');
        var time = results[i].time;
        var timeMoment = moment(time, 'x');
        var currentTime = timeMoment.format('LLL')
        var sidebarId = $('#' + topic + 'sidebar');

        img.attr('src', results[i].group.photos[0].highres_link);
        img.css('width', '150px')
        img.css('height', '100px')

        link.attr('href', results[i].event_url)
        link.attr('target', '_blank');
        link.addClass('RSVP');
        link.text('RSVP');


        //if no venue is listed, remove venue from display
        if (results[i].venue === undefined) {
            p.html("<br>" + results[i].name + '<br>' + "Next Event: " + currentTime);
        } else {
            p.html("<br>" + results[i].name + '<br>' + results[i].venue.name + '<br>' + results[i].venue.city + ', ' + results[i].venue.state + '<br>' + "Next Event: " + currentTime);
        }
        meetUpDiv.addClass('meetUpDiv')
        meetUpDiv.append(p);
        meetUpDiv.append(img);
        meetUpDiv.append(link);
        $(meetUpDiv).appendTo(sidebarId);
    }
};