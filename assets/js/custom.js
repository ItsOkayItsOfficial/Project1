/*
 * Author: Project #1 Fire
 * Project Name: Project Fire JS
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */
window.onload = function() {


var topic = '';
var results;

$('#searchButton').on('click', function(event) {
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



let getMeetUp = function(){ //JSONP to avoid cross browser error
    queryUrl = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
      $.getJSON(queryUrl, null, function(data){
        results = data.results;

          if (data.code === 'badtopic' || results.length === 0) {
            topic = 'javascript'
            queryUrl = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
              $.getJSON(queryUrl, null, function(data){
                results = data.results;
                $('#noResults').html('We couldnt find any meetups meeting your search criteria. Heres a few others you may be interested in:' + '<br>' + '<br>')
                displayMeetUp();
              });
          }
          else {
            displayMeetUp();
          };
      });

};

let displayMeetUp = function() {
    for (var i =0; i < results.length; i ++){
      var meetUpDiv=$('<div>');
      var p =  $('<p>');
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
