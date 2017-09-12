
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBnSsBFbTm0WGtFl1jUuU8e9Lfbforo0B4",
    authDomain: "project1-314b4.firebaseapp.com",
    databaseURL: "https://project1-314b4.firebaseio.com",
    projectId: "project1-314b4",
    storageBucket: "project1-314b4.appspot.com",
    messagingSenderId: "59664894457"
  };

  firebase.initializeApp(config);
  
  var dataRef = firebase.database();

  //Iitializing Variables
  var search = "";
  var zipSearch = "";


  //Capturing Buttonclicks
  $("zipSearch").on("click", function(event) {
  event.preventDefault(event);

  $('#searchButton').on('click', function(event) {
  event.preventDefault(event);

  //Logic for storage of storing and retrievig most recent user input
 search = $("#zipSearch").val().trim();
 name = $("#searchButton").val().trim();

 //Code for push
 data.ref().push({
        search: search;
        zipSearch: zipSearch;

    dateAdded: firebase.database.ServerValue.TIMESTAMP
 });


});  

dataRef.ref().on("child-added", function(childSnapshot) {

    //Log everything that's coming out of snapshot 
    console.log(childSnapshot.val().search);
    console.log(childSnapshot.val().zipSearch);
    
    });
  });


