var config;
var database;
var trainList;
var trainListArray= [];

function loadHeader() {
    console.log("header loading...");
    // load the jumbotron - love the jumbotron

    addHtml = $("<div>");
    addHtml.attr("id", "version");
    addHtml.text("v.06");
    $("#jumbo").html(addHtml);

    addHtml = $("<h2>");
    addHtml.text("Train Tracker");
    addHtml.addClass("text-center tc-text-center");
    $("#jumbo").append(addHtml);

    addHtml = $("<h3>");
    addHtml.text("When's the train?");
    addHtml.addClass("text-center tc-text-center");
    $("#jumbo").append(addHtml);

    $("#jumbo").append("<hr>");

    $(document).ready(function () {
        $(this).scrollTop(0);
    });
};

function firebaseInit() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDl14P1ziCnPSKUX068A4Wb2nJeb5ZLGVE",
        authDomain: "trainscheduler-bf747.firebaseapp.com",
        databaseURL: "https://trainscheduler-bf747.firebaseio.com",
        projectId: "trainscheduler-bf747",
        storageBucket: "trainscheduler-bf747.appspot.com",
        messagingSenderId: "954989182219"
    };
    firebase.initializeApp(config);

    // Get a reference to the database service
    database = firebase.database();
}

function loadTrain() {
    console.log("add-train clicked");
    trainName = $("#train-name").val().trim();
    trainDest = $("#train-dest").val().trim();
    trainFirst = $("#train-first").val().trim();
    trainFreq = $("#train-freq").val().trim();
    database.ref(trainName).set({
        trainDest: trainDest,
        trainFirst: trainFirst,
        trainFreq: trainFreq,
    });
    console.log("My train " + trainName);
    console.log("My dest " + trainDest);
    console.log("My time " + trainFirst);
    console.log("My freq " + trainFreq);

    trainName = $("#train-name").val("");
    trainDest = $("#train-dest").val("");
    trainFirst = $("#train-first").val("");
    trainFreq = $("#train-freq").val("");

}

function listTrain() {
    // put the trains in a table
    console.log("in listTrain");
    $("#my-table").empty();
    var tableHtml = $("<table>");
    tableHtml.html("<thead><tr><th>Train Name</th><th>Train Dest</th>" +
                    "<th>Train Schedule</th><th>Train Freq</th><th>Next Train</th></tr></thead>");
    tableHtml.attr("class","table");
    $("#my-table").append(tableHtml);
    
    database.ref().on("value", function(snapshot) {
        var setRow = "<tbody>";
        for (var key in snapshot.val()) {
            if (snapshot.val().hasOwnProperty(key)) {
                var obj = snapshot.val()[key];
                console.log(key);
                setRow = setRow + "<tr><td>" + key + "</td>";
                for (var prop in obj) { 
                    if (obj.hasOwnProperty(prop)) {
                        console.log(prop + " = " + obj[prop]);
                        setRow= setRow + "<td>" + obj[prop] + "</td>";
                        // if (prop === "trainFirst") {
                        //     var startTime = obj[prop];
                        //     console.log(moment().format());
                        // }
                        // if (prop === "trainFreq") {
                        //     var nextTime = obj[prop];
                        //     console.log(nextTime);
                        // }
                        // var nextTrain = moment().add(nextTime, "minutes").calendar(trainFirst);
                        // console.log(nextTrain)
                        // setRow= setRow + "<td>" + nextTrain + "</td>";
                    }
                }
                setRow = setRow + "</tr>";
            }
        }
        setRow = setRow + "</tbody>"
        tableHtml.append(setRow);
        $("#my-table").append(tableHtml);
    });
}

firebaseInit();
loadHeader();

$(document).on("click", "#add-train", function (e) {
    e.preventDefault();

    //add or update the train
    loadTrain();
    listTrain();
});

listTrain();
// At the initial load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the firebase database changes.
// fb.ref().on("value", function(snapshot) {
//     console.log(snapshot.val().highestBid);
//     console.log(snapshot.val().highestName);
  
//     // If Firebase has a highPrice and highBidder stored (first case)
//     if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {
  
//       // Set the local variables for highBidder equal to the stored values in firebase.
//       highestPrice = snapshot.val().highPrice;
//       highestBidder = snapshot.val().highBidder;
  
//       // change the HTML to reflect the newly updated local values (most recent information from firebase)
//       $("#highest-bidder").html(highestBidder);
//       $("#highest-price").html(highestPrice);
  
//       // Print the local data to the console.
//       console.log(highestPrice);
//       console.log(highestBidder);
      
//     }

// });