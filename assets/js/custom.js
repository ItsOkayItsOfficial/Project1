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
        $('.sidebar').hide();
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
$('#zipHolder').hide();//Hides on window.load
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
    videoSearch = tubeURL + "search?&q=" + topic + 'tutorial' + "&part=snippet&chart=mostPopular&videoCategoryId=27&type=video&relevanceLanguage=en&maxResults=1&key=" + youTubeKey;
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

//---------------------------------------------------Quiz functions-------------------------------------------------------------------------//

function quizTab() {
    // For Loop - To cull search results
    for (var k = 0; k < topics.length; k++) {
            // Remove current tab class="active"
            $("#myTab").find("li").removeClass('active');
            // Remove current content class="active in"
            $("#myTabContent").find("div").removeClass('active in');
            // Variable - Define <div> to place search results in
            var contentDiv = $("<div>");
            // Variable - Define .content to place class="" in
            contentDiv.attr("class", "tab-pane fade active in");
            // Variable - Define .content to place class="" in
            contentDiv.attr("id", topics[k]);
            contentDiv.css({'height': '350px', 'width': '40%'});
            // Variable - Define <li> to generate search tab
            var searchTab = $('<li>');
            // Attribute to searchTab - class="active"
            searchTab.attr("class", "active");
            // Attribute to showTab - data-search="topics[i]"
            searchTab.attr("data-search", topics[k]);

            // Variable - Define <a> to generate input result
            var tabAncr = $("<a data-toggle='tab'>");
            // Attribute to showTab - href="#topics[i]"
            tabAncr.attr("href", "#" + topics[k]);
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
            var sideBar = $('<nav>');
            sideBar.addClass('sidebar sidebar-right');
            sideBar.attr('id', topic + 'sidebar');   
            var meetUpHeader = $('<h3>');
            meetUpHeader.css({'height': '60px', 'font-size': '14px', 'text-align': 'center'});
            meetUpHeader.text('MeetUps Near You');
            sideBar.append(meetUpHeader);
            searchTab.append(sideBar);
    }        
    // Append with searchTab - id="myTab"
    $("#myTab").append(searchTab);

    // Append with contentDiv - id="myTabContent"
    $("#myTabContent").append(contentDiv);
};



function insertQuestion (question){
for (var j =0; j <  10; j++) {
    nextQuestion = question[j];
    var br = $('<br>')
    var questionDiv = $('<div>');
    questionDiv.text('Question ' + j)
    questionDiv.attr('id', 'Question' + j);
  for(var k in nextQuestion) {
    answer = $("<div>");
    answer.addClass(k);
    answer.html(nextQuestion[k]);
    questionDiv.append(answer);
    $('#' + topic).append(questionDiv);
  }
  questionDiv.append(br);

} 
var quizSubmit = $('<button>');
quizSubmit.attr('id', 'quizSubmit');
quizSubmit.text('Submit');
$('#' + topic).append(quizSubmit);
var resetButton = $('<button>')
resetButton.attr('id', 'resetButton');
resetButton.text('Reset');
$('#' + topic).append(resetButton)
resetButton.hide();
}


$('.quiz').on('click', function(e) {
        topic = this.id;
        e.stopPropagation();
    $('#myTab').find('li').each(function (){
        if ($(this).attr('data-search') == topic) {
            $('myTab').find('li').removeClass('active')
            $("#myTabContent").find("div").removeClass('active in');
            $(this).attr("class", "tab-pane fade active in");
            $(this).addClass('active');
            return;
        }
        
}) 
    topics.push(topic);
    quizTab();
    getMeetUp();
    insertQuestion(quizzes[topic]);
    
});

var correct = 0;

$(document).on('click', '.correctAnswer', function() {
    $(this).siblings().removeClass('selected');
    $(this).siblings().removeClass('correct');
    $(this).siblings().removeClass('incorrect');
    $(this).addClass('correct');
    $(this).addClass('selected');
});

$(document).on('click', '.answer1, .answer2, .answer3', function() {
    if ($(this).siblings().hasClass('correctStatus')){
        return;
    }
    $(this).siblings().removeClass('correct');
    $(this).siblings().removeClass('selected');
    $(this).siblings().removeClass('incorrect');
    $(this).addClass('selected');
    $(this).addClass('incorrect');
});

$(document).on('click', '#quizSubmit', function() {
    correct = 0;
    $('#results').remove();
  $(this).parent().children().find('div').each(function(){
      if ($(this).hasClass('correct')) {
          correct++;
      }
  })
    var resultsDiv = $('<div>');
    resultsDiv.attr('id', 'results');
    resultsDiv.text('You got ' + correct + '/10 correct!')
    $(this).parent().append(resultsDiv);

    $(this).parent().children().find('div').each(function(){
      $(this).removeClass('selected')
      if ($(this).hasClass('correctAnswer')) {
          $(this).addClass('correctStatus');
      }
      else if ($(this).hasClass('incorrect')){
        $(this).addClass('incorrectStatus');
      }
    })

    $('#quizSubmit').hide();
    $('#resetButton').show();
});
  
$(document).on('click', '#resetButton', function() {
    $(this).parent().children().find('div').each(function(){
        $(this).removeClass('correctStatus')
        $(this).removeClass('correct')
        $(this).removeClass('incorrectStatus')
        $(this).removeClass('incorrect')
    })
    $('#quizSubmit').show();
    $('#results').remove();
    $('#resetButton').hide();
})


//-------------------------------------------------------------------Quizzes-------------------------------------------------------------------------------------//
var quizzes = {
HTML_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
  CSS_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
  Javascript_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
  jQuery_Quiz: {
  0: {
    question: "Given the input $(“span”). What does it select?",
    answer1: "The first span element",
    answer2: "The last span element",
    correctAnswer: "All span elements",
    answer3: "Element with the class 'span'",
},
  1:   {
    question: "What scripting language is jQuery written in?",
    answer1: "VBScript",
    answer2: "C++",
    correctAnswer: "JavaScript",
    answer3: "Java",   
},
  2: {
    question: "What is the jQuery method to set one or more style properties for selected elements?",
    answer1: "style()",
    answer2: "html()",
    correctAnswer: "css()",   
},
  3: {
    question: "When referencing an HTML element preceded by a # (pound or hash), what javascript function is this equivalent to?",
    answer1: "getElementByClassName",
    correctAnswer: "getElementById",
    answer2: "getElementByTagName",
},
  4:  {
    question: "Which jQuery method is used to switch between adding/removing one or more classes (for CSS) from selected elements?",
    answer1: "switchClass()",
    answer2: "addRemoveClass()",
    answer3: "altClass()",
    correctAnswer: "toggleClass()",   
},
  5:  {
    question: "Given the input $(“span.intro”). What does it select?",
    correctAnswer: "All span elements with class=”intro”",
    answer1: "All span elements with id=”intro”",
    answer2: "The first span element with id=”intro”",
    answer3: "The first span element with class=”intro”",   
},
  6:  {
    question: "What is the jQuery method to hide selected elements?",
    answer1: "visible(false)",
    answer2: "hidden()",
    answer3: "display(none)",
    correctAnswer: "hide()",   
},
  7:  {
    question: "What is the jQuery method is used to perform an asynchronous HTTP request?",
    answer1: "jQuery.ajaxAsync()",
    answer2: "jQuery.ajaxSetup()",
    correctAnswer: "jQuery.ajax()", 
},
  8:  {
    question: "What is the jQuery code to set the background color of all span elements to blue?",
    answer1: "$(“span”).style(“background-color”,”blue”);",
    correctAnswer: "$(“span”).css(“background-color”,”blue”);", 
    answer2: "$(“span”).layout(“background-color”,”blue”);",
    answer3: "$(“span”).manipulate(“background-color”,”blue”);",
},
  9:  {
    question: "Is jQuery a library for client scripting or server scripting?",
    answer1: "Server scripting",
    correctAnswer: "Client scripting",  

    }
},
  AJAX_Quiz: {
  0: {
    question: "What makes Ajax unique?",
    answer1: "It uses C++ as its programming language.",
    answer2: "It works as a stand-alone Web-development tool.",
    correctAnswer: "It makes data requests asynchronously.",
    answer3: "It works the same with all Web browsers.",
},
  1:   {
    question: "What is AJAX based on?",
    answer1: "JavaScript and XML",
    answer2: "VBScript and XML",
    correctAnswer: "JavaScript and Java",
    answer3: "JavaScript and HTTP requests",   
},
  2: {
    question: "What sever support AJAX?",
    answer1: "SMTP",
    answer2: "SMPP",
    answer3: "WWW",
    correctAnswer: "HTTP",   
},
  3: {
    question: "What does the XMLHttpRequest object accomplish in Ajax?",
    answer1: "It provides a means of exchanging structured data between the Web server and client.",
    correctAnswer: "It provides the ability to asynchronously exchange data between Web browsers and a Web server.",
    answer2: "It's the programming language used to develop Ajax applications.",
    answer3: "It provides the ability to mark up and style the display of Web-page text.",   
},
  4:  {
    question: "JSON stands for what?",
    answer1: "The code name for the next release of Prototype",
    answer2: "The code name for the next JavaScript API Release",
    answer3: "stands for JavaScript Over Network",
    correctAnswer: "stands for JavaScript Object Notation",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "Which one of these technologies is NOT used in AJAX?",
    answer1: "CSS",
    answer2: "DOM",
    answer3: "DHTML",
    correctAnswer: "Flash",   
},
  7:  {
    question: "AJAX was made popular by who?",
    answer1: "Microsoft",
    answer2: "IBM",
    correctAnswer: "Google", 
    answer3: "Sun Microsystem",
  
},
  8:  {
    question: "AJAX is a programming language",
    answer1: "True",
    correctAnswer: "False", 
},
  9:  {
    question: "What are the advantages of AJAX?",
    answer1: "AJAX is a platform-independent technology",
    answer2: "It provides partial-page updates",
    answer3: "Improved performance",  
    correctAnswer: "All of the above",  
    }
},
  Firebase_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
  Node_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
  mySQL_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
  MongoDB_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
    ReactJS_Quiz: {
  0: {
    question: "ReactJS is developed by _____?",
    answer1: "Google Engineers",
    correctAnswer: "Facebook Engineers",

},
  1:   {
    question: "ReactJS is an MVC based framework",
    answer1: "True",
    correctAnswer: "False",
 
},
  2: {
    question: "JSX transformer is a MUST to work with ReactJS",
    answer1: "True",
    correctAnswer: "False",   
},
  3: {
    question: "Which of the following concepts is/are key to ReactJS?",
    answer1: "Component-oriented design",
    answer2: "Event delegation model",
    correctAnswer: "Both of the above",
},
  4:  {
    question: "ReactJS focuses on which of the following part when considering MVC?",
    answer1: "C (controller)",
    answer2: "M (model)",
    correctAnswer: "V (view)",   
},
  5:  {
    question: "Which of the following needs to be updated to achieve dynamic UI updates?",
    correctAnswer: "State",
    answer1: "Props",
},
  6:  {
    question: "Which of the following API is a MUST for every ReactJS component?",
    answer1: "getInitialState",
    answer2: "renderComponent",
    correctAnswer: "render",   
},
  7:  {
    question: "'div' defined within render method is an actual DOM div element",
    answer1: "True",
    correctAnswer: "False", 
},
  8:  {
    question: "Which of the following is used to pass the data from parent to child",
    answer1: "state",
    correctAnswer: "props", 
},
  9:  {
    question: "A component in ReactJS could be composed of one or more inner components",
    correctAnswer: "True",
    answer1: "False",  
    }
},
    Java_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
    CS_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
    Python_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
    CSharp_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
    Express_Quiz: {
  0: {
    question: "What is the fastest fish in the ocean?",
    answer1: "Marlin",
    answer2: "Wahoo",
    correctAnswer: "Sailfish",
    answer3: "Tuna",
},
  1:   {
    question: "What is the world's largest ocean?",
    answer1: "Atlantic",
    answer2: "Indian",
    correctAnswer: "Pacific",
    answer3: "Arctic",   
},
  2: {
    question: "What percent of the oxygen we breathe is produced by the oceans?",
    answer1: "30%",
    answer2: "50%",
    answer3: "90%",
    correctAnswer: "70%",   
},
  3: {
    question: "This is the largest animal on earth:",
    answer1: "Humpback Whale",
    correctAnswer: "Blue Whale",
    answer2: "Whale Shark",
    answer3: "Sperm Whale",   
},
  4:  {
    question: "What percent of the Earth's surface is covered by oceans?",
    answer1: "82%",
    answer2: "65%",
    answer3: "87%",
    correctAnswer: "71%",   
},
  5:  {
    question: "What is the average depth of the Earth's oceans?",
    correctAnswer: "12,200 ft",
    answer1: "5,800 ft",
    answer2: "2,400 ft",
    answer3: "21,000 ft",   
},
  6:  {
    question: "What percent of humans live on the coast?",
    answer1: "70%",
    answer2: "50%",
    answer3: "40%",
    correctAnswer: "80%",   
},
  7:  {
    question: "Green turtles can migrate more than _____ miles to lay their eggs.",
    answer1: "100",
    answer2: "400",
    correctAnswer: "1400", 
    answer3: "1000",
  
},
  8:  {
    question: "Life began in the seas how long ago?",
    answer1: "1 BYA",
    correctAnswer: "3.2 BYA", 
    answer2: "750 MYA",
    answer3: "5 BYA",
},
  9:  {
    question: "How many hearts do octopus have?",
    answer1: "1",
    answer2: "2",
    correctAnswer: "3",  
    answer3: "4",  
    }
},
};
}; //window On load

