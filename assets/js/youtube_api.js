/*
 * Author: Project #1 Fire
 * Project Name: Project Fire YouTube API Search
 * Version: Initialzed
 * Date: 08.29.17
 * URL: github.com/itsokayitsofficial/project1/
 */


//------------------------------------------------------YouTube variables--------------------------------------------------------------------------//

var tubeURL = "https://www.googleapis.com/youtube/v3/";
var youTubeKey = "AIzaSyC4tz1TDHpgGTkAyNR9ycjU0cixA6bDNnk";
var videoSearch = '';


//----------------------------------------------------------YouTube API-------------------------------------------------------------------------------------//

let getYouTube = function () {
    videoSearch = tubeURL + "search?&q=" + topic + '%20coding%20tutorial' + "&part=snippet&chart=mostPopular&videoCategoryId=27&type=video&relevanceLanguage=en&maxResults=1&key=" + youTubeKey;
    var youtubeId = $('#' + topic + 'video');

    $.ajax({
            url: videoSearch,
            method: "GET",
            dataType: 'jsonp'
        })

        .done(function (response) {
            var videoId = response.items[0].id.videoId;
            youtubeId.append("<iframe width='100%' height='100%' src='https://www.youtube.com/embed/" + videoId + "' frameborder='0'id='hi'></iframe>")
        });
};