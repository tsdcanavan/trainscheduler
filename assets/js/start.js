var config;
var database;
var trainList;
var trainListArray = [];

function loadHeader() {
    console.log("header loading...");
    // load the jumbotron - love the jumbotron

    addHtml = $("<div>");
    addHtml.attr("id", "version");
    addHtml.text("v.06");
    $("#jumbo").html(addHtml);

    addHtml = $("<h1>");
    addHtml.text("Train Tracker");
    addHtml.addClass("text-center tc-text-center ");
    $("#jumbo").append(addHtml);

    addHtml = $("<h2>");
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
    if (trainName != "") {
        database.ref().push({
            trainName: trainName,
            trainDest: trainDest,
            trainFirst: moment(trainFirst, "hh:mm").format("X"),
            trainFreq: moment(trainFreq, "mm").format("X"),
            trainAdded: firebase.database.ServerValue.TIMESTAMP
        });
    }
    console.log(firebase.database.ServerValue.TIMESTAMP);
    console.log(moment(firebase.database.ServerValue.TIMESTAMP, "X").format("MM/DD/YYYY"));
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

    //add table
    var tableHtml = $("<table>");
    tableHtml.attr("id", "new-table");
    tableHtml.attr("class", "table");
    $("#my-table").append(tableHtml);

    // add header
    var tableHtml = $("<thead>");
    tableHtml.html("<tr><th>Train Name</th><th>Train Dest</th>" +
        "<th>Train Schedule</th><th>Train Freq</th><th>Next Train</th></tr>");
    tableHtml.attr("id", "new-header");
    $("#new-table").append(tableHtml);

    // add body
    var tableHtml = $("<tbody>");
    tableHtml.attr("class", "body");
    tableHtml.attr("id", "new-body");
    $("#new-table").append(tableHtml);

    database.ref().on("child_added", function (snapshot) {
        var sv = snapshot.val();
        var nextTrain = 0;
        var dspTrainFirst = moment(sv.trainFirst, "X").format("hh:mm A");
        var dspTrainFreq = moment(sv.trainFreq, "X").format("mm");
        var dspTrainMin = moment().subtract(sv.trainFirst, "X").format("hh:mm");
        console.log(moment(dspTrainMin, "X").format("hh:mm"));
        nextTrain = (moment().subtract(sv.trainFirst, "X"));
        console.log(sv.trainFirst);
        //        nextTrain = ((moment().subtract(moment(sv.trainFirst, "X")) % dspTrainFreq).format("mm"));

        //        nextTrain = (now - dspTrainFirst)%dspTrainFreq ... dspTrainFreq - remainder = nex
        //        nextTrain = (moment().subtract(moment(sv.trainFirst, "X"))).format("hh:mm");
        console.log("calc minutes: " + moment().subtract(moment(sv.trainFirst, "hh:mm")).format("X"));
        console.log("calc next time: " + nextTrain);

        // Change the HTML for each train
        var updHtml = $("<tr>");
        updHtml.html("<td>" + sv.trainName + "</td><td>" +
            sv.trainDest + "</td><td>" + dspTrainFirst +
            "</td><td>" + dspTrainFreq + "</td><td>" +
            nextTrain + "</td>");
        $("#new-body").append(updHtml);

        // for (var key in snapshot.val()) {
        //     if (snapshot.val().hasOwnProperty(key)) {
        //         var obj = snapshot.val()[key];
        //         console.log(key);
        //         setRow = setRow + "<tr><td>" + key + "</td>";
        //         for (var prop in obj) {
        //             if (obj.hasOwnProperty(prop)) {
        //                 console.log(prop + " = " + obj[prop]);
        //                 setRow = setRow + "<td>" + obj[prop] + "</td>";
        //             }
        //         }
        //         setRow = setRow + "</tr>";
        //     }
        // }
        // setRow = setRow + "</tbody>"
        // tableHtml.append(setRow);
        // $("#my-table").append(tableHtml);
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
