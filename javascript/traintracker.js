

  // Initialize Firebase
var config = {
    apiKey: "AIzaSyApNvgD-U3KT1V4zFU47I68qDQPGKiqBGg",
    authDomain: "trainscheduler-2f10f.firebaseapp.com",
    databaseURL: "https://trainscheduler-2f10f.firebaseio.com",
    projectId: "trainscheduler-2f10f",
    storageBucket: "trainscheduler-2f10f.appspot.com",
    messagingSenderId: "761728434417"
};

firebase.initializeApp(config);

var database = firebase.database();

var trainsRef = database.ref("/trains");


 // Set up Click Event for the Submit button
 $("#submit").on("click", function (event) {
    console.log("SUBMITTING FORM");
    event.preventDefault();
    var name = $("#trainName").val().trim();
    var dest = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var freq = $("#freq").val().trim();
    console.log(name, dest, firstTrain, freq);

    // push information into firebase

    //var trainsRef = database.ref("/trains");

    trainsRef.push({
        name: name,
        dest: dest,
        freq: freq,
        firstTrain: firstTrain
    });

    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#freq").val("");

});

function minToTrain (frequency,firstTime) {
    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    return tMinutesTillTrain;
}

function nextTrainTime (minTillTrain) {
     // Next Train
     var nextTrain = moment().add(minTillTrain, "minutes");
     return moment(nextTrain).format("h:mm A"); 
}

// Set up the child_added event for new train
database.ref("/trains").on("child_added", function (snapshot) {
    console.log(snapshot.val());

    var newRow = $("<tr>")
    var nameCell = $("<th>").attr("scope","row").text(snapshot.val().name);;
    var destCell = $("<td>").text(snapshot.val().dest);
    var freqCell = $("<td>").text(snapshot.val().freq);

    var minTillTrain = minToTrain(snapshot.val().freq,snapshot.val().firstTrain);

    var nextArrival = $("<td>").text(nextTrainTime(minTillTrain));
    var minAway = $("<td>").text(minTillTrain);
    
    newRow.append(nameCell, destCell, freqCell, nextArrival, minAway);

    $("#tableBody").append(newRow);

  // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});