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

// Tab Clear
$('.nav-tabs').on("click", "button", function () {
    var anchor = $(this).siblings('a');
    $(anchor.attr('href')).remove();
    $(this).parent().remove();
    $(".nav-tabs li").children('a').first().click();
});

// Sidebar Transitions
$('.sidebar').on('click', function(event) {
	event.preventDefault();
	$(this).toggleClass("open");
});