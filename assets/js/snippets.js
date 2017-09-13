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
        $(".nav-tabs").css("visibility", "hidden");
        $(".site-nav").addClass("active");
        $("#logo").attr("<img class='logo' src='assets/img/owl_logo_1.svg'>")
        $(".navbar-brand").addClass("fade-out").removeClass("fade-in");
        $(".logo").removeClass("fade-out").addClass("fade-in");
    } else {
        $(".nav-tabs").css("visibility", "visible");
        $(".site-nav").removeClass("active");
        $("#logo").children().remove();
        $(".navbar-brand").addClass("fade-in").removeClass("fade-out");
        $(".logo").removeClass("fade-in").addClass("fade-out");
    }
});


// Tab Clear
$('.nav-tabs').on("click", "button", function () {
    var anchor = $(this).siblings('a');
    $(anchor.attr('href')).remove();
    $(this).parent().remove();
    $(".nav-tabs li").children('a').first().click();
});


// Sidebar Transitions
$('.sidebar').on('click', function (event) {
    event.preventDefault();
    $(this).toggleClass("open");
});


//Prevents sidebar from closing when meetUp RSVP is clicked
$(document).on('click', '.RSVP', function (e) {
    e.stopPropagation();
});


//If sidebar of current tab is open, sidebar of newly clicked tab will also open.
$(document).on('click', 'li', function () {
    $('li').find('nav').removeClass('active');
    if ($('li').find('nav').hasClass('open')) {
        $('li').find('nav').removeClass('open');
        $(this).find('nav').addClass('open');
    }
    if ($(this).hasClass('active')) {
        $(this).find('nav').addClass('active');
    }
})


// // Change Theme
// var bootSwatch = 'https://bootswatch.com/';
// var bootMin = '/bootstrap.min.css';

// $('#flatly').on('click', function () {
//     $('#bootstrap').remove('href').attr('href', bootSwatch + 'flatly' + bootMin);
// });

// $('#paper').on('click', function () {
//     $('#bootstrap').remove('href').attr('href', bootSwatch + 'paper' + bootMin);
// });

// $('#original').on('click', function () {
//     $('#bootstrap').remove('href').attr('href', bootSwatch + 'simplex' + bootMin);
// });