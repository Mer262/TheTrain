// ### Instructions
// * Make sure that your app suits this basic spec:
// 	* When adding trains, administrators should be able to submit the following:
// 		* Train Name
//		* Destination 
// 		* First Train Time -- in military time
// 		* Frequency -- in minutes
// 
// 	* Code this app to calculate when the next train will arrive; this should be relative to the current time.

//	* Users from many different machines must be able to view same train times.

//  * Styling and theme are completely up to you. Get Creative!

// Extra Challenges
// * Consider updating your "minutes to arrival" and "next train time" text once every minute. This is significantly more challenging; only attempt this if you've completed the actual activity and committed it somewhere on GitHub for safekeeping (and maybe create a second GitHub repo).

// * Try adding `update` and `remove` buttons for each train. Let the user edit the row's elements-- allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).

// * As a final challenge, make it so that only users who log into the site with their Google or GitHub accounts can use your site. You'll need to read up on Firebase authentication for this bonus exercise.



// Initialize Firebase


var config = {
    apiKey: "AIzaSyDtE46FTz52al8F_bIM5ebXr37uMGpFy9Y",
    authDomain: "trainscheduling-414ff.firebaseapp.com",
    databaseURL: "https://trainscheduling-414ff.firebaseio.com",
    storageBucket: "trainscheduling-414ff.appspot.com",
    messagingSenderId: "512376492757"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button to add a train
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    // var trainFirst = moment($("#first-train-input").val().trim(), "hh:mm").format("X");
    var trainFirst = $("#first-train-input").val().trim();
    var trainFreq = $("#frequency-input").val().trim();

    var newTrain = {
        name: trainName,
        destination: trainDest,
        first: trainFirst,
        frequency: trainFreq
    };
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

    // Prevents moving to new page
    return false;
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().first;
    var trainFreq = childSnapshot.val().frequency;

    // Employee Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainFirst);
    console.log(trainFreq);

    var trainFirstPretty = moment.unix(trainFirst).format("hh:mm");

    //*********MATH STUFF**************

    // First Time (pushed back 1 year to make sure it comes before current time)
    var trainFirstConverted = moment(trainFirst, "hh:mm").subtract(1, "years");
    console.log(trainFirstConverted);

        // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));


    // Difference between the times
    var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);


       // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log("tRemainder: " + tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var nextTrainPretty = moment(nextTrain).format("hh:mm");


    //*********MATH STUFF**************

    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
        trainFreq + "</td><td>" + nextTrainPretty + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});
