/*
 * Author: Project #1 Fire
 * Project Name: Project Fire custom page JS
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */

// Nav Transition
$('body').on('click', function () {
    if ($('.nav-tabs').children().length == 0) {
        $(".nav-tabs").css("visibility","hidden");
        $(".site-nav").addClass("active");
        $(".navbar-brand").addClass("fade-out").removeClass("fade-in");
        $(".logo").removeClass("fade-out").addClass("fade-in");
    } else {
        $(".nav-tabs").css("visibility","visible");
        $(".site-nav").removeClass("active");
        $(".navbar-brand").addClass("fade-in").removeClass("fade-out");
        $(".logo").removeClass("fade-in").addClass("fade-out");
    }
});

$(document).on('click', '.RSVP', function(e) {
    e.stopPropagation();
});

$(document).on('click', 'li', function() {  
    $('li').find('nav').removeClass('active'); 
    if ($('li').find('nav').hasClass('open')) { //If sidebar of current tab is open, sidebar of newly clicked tab will also open.
        $('li').find('nav').removeClass('open');
        $(this).find('nav').addClass('open');
    }
    if ($(this).hasClass('active')) {
        $(this).find('nav').addClass('active');
    }
})

// Tab Clear
$('.nav-tabs').on("click", "button", function () {
    var anchor = $(this).siblings('a');
    $(anchor.attr('href')).remove();
    $(this).parent().remove();
    $(".nav-tabs li").children('a').first().click();
});

// Sidebar Transitions
$(document).on('click', '.sidebar', function(event) {
    event.preventDefault();
    $(this).toggleClass("open");
});

window.onload = function() {
$("#box").hide(100);
$('#zipHolder').hide();//Hides on window.load
$('#vids').hide();
$('.sidebar-left').hide();



//-----------------------------------------------------MeetUp Variables-------------------------------------------------------------------//
var topic = '';
var zip = '';
var results;
var meetUpKey = '1a143e3f55f5e4a64664065683536';
var queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
var tryZip = '';
var sidebarId = '';
var defaultTopic = '';
//---------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------YouTube variables---------------------------------------------------------------//
var tubeURL = "https://www.googleapis.com/youtube/v3/";
var youTubeKey = "AIzaSyC4tz1TDHpgGTkAyNR9ycjU0cixA6bDNnk";
var videoSearch = '';
//---------------------------------------------------YouTube API------------------------------------------------------------------// 
let getYouTube = function(){
    videoSearch = tubeURL + "search?&q=" + topic + "&part=snippet&chart=mostPopular&videoCategoryId=27&type=video&relevanceLanguage=en&maxResults=1&key=" + youTubeKey;
    var youtubeId = $('#' + topic + 'video');

        $.ajax({
        url: videoSearch,
        method: "GET",             
        dataType: 'jsonp'
    })
    .done(function(response) {
            var videoId = response.items[0].id.videoId;
            console.log(response)
    youtubeId.append("<iframe width='100%' height='100%' src='https://www.youtube.com/embed/" + videoId + "' frameborder='0'id='hi'></iframe>")  
    });

};   

//-----------------------------------------------------Zip Code/Search logic---------------------------------------------------------//
function isValidUSZip(isZip) { // returns boolean; if user input is valid US zip code
   return /^\d{5}(-\d{4})?$/.test(isZip);
}

$('#zipSearch').on('click', function(event) { //on click of the zip code 'Go!' button 
  event.preventDefault(event);
  tryZip = $('#userZip:text').val();
  $('#noZip').html('')

  if (isValidUSZip(tryZip) === true) { //if Valid zip code set as user zip code.
    zip = tryZip;
    localStorage.clear();
    localStorage.setItem('zip', zip);
    $('#zipHolder').html('Current Zip Code: ' + zip + ' <span class="caret"></span>');
    $('#searchError').html('');
    $('#zipHolder, #zipSearch, #zipForm').toggle();  //toggles either hide/display to these classes
  }
  else {
    $('#zipForm').addClass('has-error'); //if invalid zip, turns the search box red
  }
});

$('#changeZip').on('click', function(event) {
    $('#zipHolder, #zipSearch, #zipForm').toggle();
    $('#userZip:text').val('');
    $('#zipForm').removeClass('has-error');
});

let checkZip = function() {
    if (localStorage.getItem("zip") !== null) {
        zip = localStorage.getItem('zip');
        $('#zipHolder').html('Current Zip Code: ' + zip + ' <span class="caret"></span>');
        $('#searchError').html('');
        $('#zipHolder, #zipSearch, #zipForm').toggle(); 
    }
}  

//---------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------MeetUp API Call-------------------------------------------------------//

let getMeetUp = function(){ 
    queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
    
    $.getJSON(queryUrl, null, function(data) { //initial API call      
      results = data.results;
      console.log(results);
          if (data.code === 'badtopic' || results.length === 0 || results == undefined) { //if no meetup found based on user search, defaults to javascript meetups
            defaultTopic = 'javascript'
            queryUrl = 'https://api.meetup.com/2/open_events?key=' + meetUpKey + '&sign=true&photo-host=public&topic=' + defaultTopic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
      
          $.getJSON(queryUrl, null, function(data){ // Second API call 
            results = data.results;
            displayMeetUp();
          })
          }
          else {
            $('#meetUpSidebar').html('');
            displayMeetUp();
          };
      });

};


let displayMeetUp = function() {   //Displays up meetup on HTML, reformats unix time
    for (var i =0; i < 3; i ++){
      var meetUpDiv=$('<div>');
      var p =  $('<p>');
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
      meetUpDiv.addClass('meetUpDiv')
    if (results[i].venue === undefined) { //if no venue is listed
      p.html("<br>" + results[i].name + '<br>' + "Next Event: " + currentTime);
    }
    else {
      p.html("<br>" + results[i].name + '<br>' + results[i].venue.name + '<br>' + results[i].venue.city + ', ' + results[i].venue.state + '<br>' + "Next Event: " + currentTime);
    }
      meetUpDiv.append(p);
      meetUpDiv.append(img);
      meetUpDiv.append(link);
      $(meetUpDiv).appendTo(sidebarId);
  
    }
};
//---------------------------------------------------------------------------------------------------------------------------------//
    var topics = [];
    // Function - Generates tabs of search input submitted
    function searchTab() {
        var codepen = $("<iframe height='300' scrolling='no' title='RZvYVZ' src='//codepen.io/marcorulesk345/embed/RZvYVZ/?height=300&theme-id=31149&default-tab=html,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/marcorulesk345/pen/RZvYVZ/'>RZvYVZ</a> by marco (<a href='https://codepen.io/marcorulesk345'>@marcorulesk345</a>) on <a href='https://codepen.io'>CodePen</a>.</iframe>");
        // For Loop - To cull search results
        for (var i = 0; i < topics.length; i++) {
            // Remove current tab class="active"
            $("#myTab").find("li").removeClass('active');
            // Remove current content class="active in"
            $("#myTabContent").find("div").removeClass('active in');
            // Variable - Define <div> to place search results in
            var contentDiv = $("<div>");
            // Variable - Define .content to place class="" in
            contentDiv.attr("class", "tab-pane fade active in");
            // Variable - Define .content to place class="" in
            contentDiv.attr("id", topics[i]);
            contentDiv.css({'height': '350px', 'width': '100%', 'text-align': 'center'});
            // Variable - Define <li> to generate search tab
            var searchTab = $('<li>');
            // Attribute to searchTab - class="active"
            searchTab.attr("class", "active");
            // Attribute to showTab - data-search="topics[i]"
            searchTab.attr("data-search", topics[i]);

            // Variable - Define <a> to generate input result
            var tabAncr = $("<a data-toggle='tab'>");
            // Attribute to showTab - href="#topics[i]"
            tabAncr.attr("href", "#" + topics[i]);
            // Text to showTab - displays search input on showTab
            topic = topic.split('_').join(' ');
            tabAncr.text(topic);
            topic = topic.split(' ').join('_');
            // Variable - Button to delete search tab
            var tabButton = $("<button type='button' class='close'>&times;</button>");
            // Append with tabAncr - id="myTab"
            searchTab.append(tabAncr);
            // Append with tabButton - id="myTab"
            searchTab.append(tabButton);

            //create sidebar for each result
            
            console.log(topic);
            var sideBar = $('<nav>');
            sideBar.addClass('sidebar sidebar-right');
            sideBar.attr('id', topic + 'sidebar');   
            var meetUpHeader = $('<h3>');
            meetUpHeader.css({'height': '60px', 'font-size': '14px', 'text-align': 'center'});
            meetUpHeader.text('MeetUps Near You');
            sideBar.append(meetUpHeader);
            searchTab.append(sideBar);

            codepen.css({'height': '300px', 'width': '80%', 'text-align': 'center', 'margin': '0px 10% 0px 10%'})
            var vids = $('<div>');
            vids.attr('id', topic + 'video');
            vids.css({'height': '350px', 'width': '80%', 'text-align': 'center', 'margin': '0px 10% 0px 10%'})
            contentDiv.append(vids);
            contentDiv.append(codepen);
            
        }        
        // Append with searchTab - id="myTab"
        $("#myTab").append(searchTab);

        // Append with contentDiv - id="myTabContent"
        $("#myTabContent").append(contentDiv);
    };

function sidebarStatus() {
    var topicQuery = $('#' + topic + 'sidebar');
    $('li').find('nav').removeClass('active'); 
    if ($('li').find('nav').hasClass('open')) {
        ($('li').find('nav').removeClass('open'));
        topicQuery.addClass('open', 'active');       
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
//---------------------------------------------------Search on click functions-------------------------------------------------------------------------//

$('#searchButton').on('click', function(event) {
  event.preventDefault(event);


  if ($('#searchInput:text').val().trim() !== '' && $("#zipHolder").is(":visible")) { //Prevents searching if there is no input,
    $("#box").show(100);
    $("#vids").empty().show();
    topic = $('#searchInput:text').val().trim();
    topic = topic.capitalize();
    topic = topic.split(' ').join('_');
    topic = topic.split('/').join('_');                                          
    topics.push(topic);                  
    searchTab();
    sidebarStatus();
    $('.sidebar-left').show();                                     
    $('#searchInput:text').val(''); //clears search box
    getYouTube();
    getMeetUp();
  }

  else if ($('#zipHolder').is(':hidden')) {
    $('#noZip').html('Please select a zip code.')
    $('#zipForm').addClass('has-error');
    $('#searchInput:text').val('');
  };

});
checkZip();
}; //window On load

