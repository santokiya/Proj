// Initialize Firebase
var config = {
	apiKey: "AIzaSyDF-1iKu2cAXzXqNSxNgFyIFKiIYckMKA8",
	authDomain: "project-database-8b094.firebaseapp.com",
	databaseURL: "https://project-database-8b094.firebaseio.com",
	projectId: "project-database-8b094",
	storageBucket: "project-database-8b094.appspot.com",
	messagingSenderId: "597428663043"
};
firebase.initializeApp(config);
// Create a variable to reference database
var database = firebase.database()

//Capture Button Click
$("#add-answer-btn").on("click", function(event) {
	event.preventDefault();
	//Code for push
	database.ref().push({
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	});
});

// Create a variable to reference database
var database = firebase.database();
//-----------------------------------
  //Initial Values
  var userCodeOne = "";
  var versusSymbolArea = "";
  var userCode2 = "";
  var leaderboard = "";
// Read Data Once
var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
	var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';


  // ...
});
  //Capture Button Click
  $("#add-answer-btn").on("click", function (event) {
  	event.preventDefault();
    // grab values from text boxes
    userCodeOne = $("#userCodeOne-input").val().trim();
    userCode2 = $("#userCode2-input").val().trim();
    

    console.log(userCodeOne, userCode2, leaderboard);
    //Code for push
    database.ref().push({
    	userCodeOne: userCodeOne,
    	userCode2: userCode2,
    	leaderboard: leaderboard,
    	dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});
  // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
  database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    // Console.logging the last user's data
    console.log(sv.winner);

    Questions: {
    	_01: {
    		question: "Question",
    		asked: "false",
    		function: {
    			name: "myFunc,"
    			args: ["num1", "num2"],
    		},
    		tests: [{
    			params: ["1", "2"],
    			passVal: 3
    		},
    		{
    			params: ["3", "4"],
    			passVal: 5
    		}]
    	},
    	_02: {
    		question: "Actual question",
    		asked: "false",
    		function: {
    			name: "myFunc,"
    			args: ["num1", "num2"],
    		},
    		tests: [{
    			param: [1, 2],
    			return: 3
    		},
    		{
    			param: [3, 4],
    			return: 5
    		}]
    	}
    },
    current: {
    	player1: {
    		state: "none",
    		username: "blah1", 
    		code: ""
    	},
    	player2: {
    		state: "none",
    		username: "blah2", 
    		code: ""
    	}
    }
}	
//----------------------------------------------------------------------
$(document).ready(function(){

	$(".secondPageLayout").fadeOut();
	$(".thirdPageLayout").fadeOut();
	$(".fourthPageLayout").fadeOut();
	

	
	$("#readyUp").click(function(){                     // this will fade out the initial start page
		$(".firstPageLayout").fadeOut();                // fades out first page 
		$(".secondPageLayout").fadeIn();            // fades in second page 
	});


	$("").click(function()
	{
		$("").fadeOut();
		// fades in the question page on button click
		$(".").fadeOut();
		$("").fadeIn();

	});
});





/*
INPUT EVALUATION FUNCTION 
 	This function takes the user input string from the text area, 
	the current question object,  
	the function to run if they pass, 
	and the function to run if they failed 
	*/
	function checkUserCode(str, question, passFunc, failFunc) {

	if (typeof (Worker) === undefined) {		// check if browser supports web workers 
		alert('No webworker supported');
		return false;
	}
	/* Initialize Variables */
	var myWorker = null, currTest = 0, failed = false, 
	URL = window.URL || (window.webkitURL);

	window.URL = URL;

	question.tests.forEach(function(test) {
		var functionString = buildFunctionString(test);

		console.log(functionString);

		/* (Stack Overflow comment) we are creating a new javascript file using blob. We just use the string passed to the function, and assign it to the Blob(content,type). */
		var workerData = new Blob([functionString], { type: "text/javascript" });

		initWorker(workerData, test);
	});


	function initWorker(data, test) {
		/* (Stack Overflow comment) create the new web worker as we dont have an external file, we have to create a url for our blob using createObjectURL. link will look like blob:d3958f5c-0777-0845-9dcf-2cb28783acaf */
		myWorker = new Worker(window.URL.createObjectURL(data));

		/* listen for messages sent back by the worker */
		myWorker.onmessage = function (e) {
			clearTimeout(timeoutError);		// clear the error timeout so it doesn't fire
			handleWorkerReturn(e, test, myWorker, timeoutError);		// pass return to handler function
		};

		/* if the worker is running for longer than 5 seconds, throw timeout */
		var timeoutError = setTimeout(function() {
			clearTimeout(timeoutError);
			stopWorker(myWorker);

			/* check if already failed */
			if(!failed) {
				console.log("Timeout error thrown");
				failed = true;
				failFunc();
			}
		}, 5 * 1000);
	}

	function stopWorker(w){
		/* stop and delete the worker when it's done */
		w.onmessage = null;
		w.terminate();
		delete w;
	}

	function handleWorkerReturn(e, test, worker, time) {
		/* if the return matches the expected pass value, 
			increment the current test counter
			if the counter equals the number of tests, then run pass function */
				if(e.data === test.passVal) {
					currTest += 1;
					if(currTest === question.tests.length) {
						stopWorker(worker);
						passFunc();
					}
				} else {
					stopWorker(worker);
					failed = true;
					failFunc();
				}
			}

			function buildFunctionString(test) {
				var f = question.function;
				var args = buildArgList(f.args);
				var params = buildArgList(test.params);

				var fullStr = `function ${f.name}(${args}) { `;
					fullStr += `${str} } `;

					fullStr += `postMessage( ${f.name}(${params}) );`;

					return fullStr;
				}

				function buildArgList(a) {
					var list = "";

					a.forEach(function(arg){
						if(list.length === 0) {
							list += arg;
						} else {
							list += `, ${arg}`;
						}
					});

					return list;
				}
			}



