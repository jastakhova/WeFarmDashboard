
// mUid to be used in this file
var mUid;
var dbClimateRef;




(function() {
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      mUid = firebaseUser.uid;
      dbClimateRef = firebase.database().ref().child('users').child(mUid).child('climate'); // Create the ref to FB Climate
      runPage();  // If the UserUid is back start the page - else logout
    } else {
      window.open("auth.html","_self");
      console.log('not logged in');
    }
  });
}());



function runPage() {
  console.log(mUid);

//####################
// Load Libraries
//####################
//google.charts.load('current', {packages:['corechart', 'line' ,'gauge']});


//################################################################
//  User Information - need to find out how to make it a global var
//############################################################

var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

if (user != null) {
  name = user.displayName;
  email = user.email;
  photoUrl = user.photoURL;
  emailVerified = user.emailVerified;
  uid = user.uid;
}

  //#########################
  //  REGULAR PAGE
  //#########################

  // Settings Section
  const messurmentTextView = document.getElementById('climateSettingsMessuTV');
  // Get element
  const preAirTemp = document.getElementById('airTempVal');
  const preAirHumid = document.getElementById('airHumidVal');
  // Switches
  const fanSwitch = document.getElementById('fan');
  const windowSwitch = document.getElementById('window');
  const generalSwitch = document.getElementById('generalSwitch');
  // Temp values
  const tempMaxView = document.getElementById('temp_max_text_view');
  const tempMinView = document.getElementById('temp_min_text_view');
  // Restart Button
  const restartButton = document.getElementById("restartButton");


  // Create reference to FireBase
  const dbRefCliamte = firebase.database().ref(mUid).child('climate');
  
  const dbRefAirTemp = dbClimateRef.child('temperature');
  const dbRefAirHumid = dbClimateRef.child('humidity');

  const dbRefManual = dbClimateRef.child('manual');
  const dbRefFan = dbClimateRef.child('fan');
  const dbRefWindow = dbClimateRef.child('window');
  const dbRefGeneral = dbClimateRef.child('generalSwitch');
  const dbRefTempMax = dbClimateRef.child('tempMaxButton');
  const dbRefTempMin = dbClimateRef.child('tempMinButton');

  const dbRefMessurment = FBUserInfoRef.child('mMeasurements');
  const dbRefRestartSensor = dbClimateRef.child('restartInProgres');
  
  var temp = 0;
  var humid = 0;

  //########################
  // Settings Section
  //########################

  // Write to the user what messurments we are using
//  dbRefMessurment.on('value', snap => {
//    messurmentTextView.innerText = "measurments  :  " +  snap.val();
//  });

  
  //#########################################################
  //  Getting Values From FireBase - and displaying on page
  //########################################################


  // Restart Button listener (if disabled or enabled)
//  dbRefRestartSensor.on('value', snap => {
//    var inProgress = snap.val();
//    if (inProgress == false) {
//      restartButton.disabled = false;
//    }
//
//    if (inProgress == true) {
//      restartButton.disabled = true;
//    }
//
//  });

  // Settings Part - show min max temp values

  dbRefTempMax.on('value', snap => {
    tempMaxView.value = snap.val();
  });

  dbRefTempMin.on('value', snap => {
    tempMinView.value = snap.val();
  });


  // Guage part - show current Temp and Humid

  dbRefAirTemp.on('value', snap => {
    temp = snap.val();

    // Change to Ferenhight if Chosen Messurment is "F"
    if (mMeasurements == "f") {
      temp = +((temp * 1.8) + 32).toFixed(2) + "°F"; //  ( + ) at the start of this command Converts the String to a number
    } else {
    	temp += "°C";
    }                            
    preAirTemp.innerText = temp;
//    drawTempGuage();
  })
  
  dbRefAirHumid.on('value', snap => {
    humid = snap.val();
    preAirHumid.innerText = snap.val() + "%";
//    drawHumidGuage();
  })
  
  function setCheckbox(switchElement, snap) {
		if (snap.val()) {
			className = "switch-animate switch-on";
		} else {
			className = "switch-animate switch-off";
		}
		switchElement.parentElement.className = className;
  }


  // Fan  Window and general Listeners
  dbRefFan.on('value', snap => {
    setCheckbox(fanSwitch, snap);
  })

  dbRefWindow.on('value', snap => {
    setCheckbox(windowSwitch, snap);
  }) 

  dbRefGeneral.on('value', snap => {
    setCheckbox(generalSwitch, snap);
  }) 


// The Gauge Tempurature Elements - // https://developers.google.com/chart/interactive/docs/gallery/gauge

function drawTempGuage() {

	return;

  var data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Temperature', temp],
    ]);

  if (mMeasurements == "f") {
    var options = {
      width: 120, height: 120,
      min:0, max:122, 
      redFrom: 104, redTo: 122,
      yellowFrom:86, yellowTo: 104,
      greenFrom:59, greenTo: 86,
      minorTicks: 10
    };

  } else {  // Messurments are in C
    var options = {
      width: 120, height: 120,
      min:0, max:50, 
      redFrom: 40, redTo: 50,
      yellowFrom:30, yellowTo: 40,
      greenFrom:15, greenTo: 30,
      minorTicks: 10
    };
  }
  
  var chart = new google.visualization.Gauge(document.getElementById('chart_div3'));

  chart.draw(data, options);
}

  // The Gauge Humidity Element
  function drawHumidGuage() {

    var data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Humidity', humid]
      ]);

    var options = {
      width: 120, height: 120,
      redFrom: 90, redTo: 100,
      yellowFrom:75, yellowTo: 90,
      minorTicks: 5,
    };

    var chart = new google.visualization.Gauge(document.getElementById('chart_div2'));

    chart.draw(data, options);
  }

  // Execute the Drawing of the line chart
//  google.charts.setOnLoadCallback(drawTempLineChartFromFB);
//  google.charts.setOnLoadCallback(drawHumidLineChartFromFB);
//  getDate();
  fromFBToCharts();

    // Date Functions
    // Can also use this https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tolocalestring
    function getDate() {

      var today = new Date();
      var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd= '0'+ dd;
    } 
    if(mm<10){
      mm= '0'+ mm;
    } 
    var today = mm+'-'+dd+'-'+yyyy;
    document.getElementById("dateTextInput").value = today;
  }

  //#####################################
  // FB AUTH for logout at the menu bar
  //######################################
  
  // Elements
  const logOutButtonIndex = document.getElementById('log_out_button_index');

  // Add LogOut Evenet
  logOutButtonIndex.addEventListener('click', e => {
      //Get email and pass from input text
      console.log('love'); 
      firebase.auth().signOut();
    });
  
  // adds a click listener to the form locker button
  Array.from(document.getElementsByClassName("locker")).map(function(x, i, ar) {
			ar[i].addEventListener('click', e => {
				e.preventDefault();
				// changes appearance of the locker button between locked and unlocked state
				iClassName = ar[i].getElementsByTagName("i")[0].className;
				if (iClassName.indexOf("fa-lock") >= 0) {
					newClassName = iClassName.replace("fa-lock", "fa-unlock");
					ar[i].className = ar[i].className.replace("btn-primary", "btn-success");
				} else {
					newClassName = iClassName.replace("fa-unlock", "fa-lock");
					ar[i].className = ar[i].className.replace("btn-success", "btn-primary");
				}
				ar[i].getElementsByTagName("i")[0].className = newClassName;
				
				// activates or deactivates switches
				Array.from(ar[i].parentElement.parentElement.parentElement.getElementsByClassName("switch")).map(function(xx, ii, arr) {
					iClassName = arr[ii].className;
					if (iClassName.indexOf("deactivate") >= 0) {
						arr[ii].className = iClassName.replace("deactivate", "");
					} else {
						arr[ii].className = iClassName.replace("switch", "switch deactivate");
					}
				});
				
				// activates or deactivates inputs
				Array.from(ar[i].parentElement.parentElement.parentElement.getElementsByTagName("input")).map(function(xx, ii, arr) {
					arr[ii].disabled = !arr[ii].disabled;
				});
		 });
		 
		 // adds a listener to the change of state for the switches to write the new value to the database
		 Array.from(ar[i].parentElement.parentElement.parentElement.getElementsByTagName("input")).map(function(xx, ii, arr) {
		 		if (arr[ii].parentElement.className.indexOf("switch-animate") >= 0) {
		 		  arr[ii].parentElement.parentElement.addEventListener('click', e => {
						arr[ii].checked = arr[ii].parentElement.className.indexOf("switch-on") >= 0;
						wirteToFBWindowFan(arr[ii].id);
					});
		 		}
		 });
     
     // adds a listener to event on update buttons
		 Array.from(ar[i].parentElement.parentElement.parentElement.getElementsByClassName("btn btn-theme")).map(function(xx, ii, arr) {
					arr[ii].addEventListener('click', e => {
						e.preventDefault();
						wirteToFBTempValues(arr[ii].id);
					});
		 });
	});
};
