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

  dbRefTempMax.on('value', snap => {
    tempMaxView.value = snap.val();
  });

  dbRefTempMin.on('value', snap => {
    tempMinView.value = snap.val();
  });


  dbRefAirTemp.on('value', snap => {
    temp = snap.val();

    // Change to Ferenhight if Chosen Messurment is "F"
    if (mMeasurements == "f") {
      temp = +((temp * 1.8) + 32).toFixed(2) + "°F"; //  ( + ) at the start of this command Converts the String to a number
    } else {
    	temp += "°C";
    }                            
    preAirTemp.innerText = temp;
  })
  
  dbRefAirHumid.on('value', snap => {
    humid = snap.val();
    preAirHumid.innerText = snap.val() + "%";
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


  fromFBToCharts();

  //#####################################
  // FB AUTH for logout at the menu bar
  //######################################
  
  // Elements
  const logOutButtonIndex = document.getElementById('log_out_button_index');

  // Add LogOut Evenet
  logOutButtonIndex.addEventListener('click', e => {
      firebase.auth().signOut();
    });
  
  addLockerLogic(function(lockerElement) {
  	// adds a listener to the change of state for the switches to write the new value to the database
	 Array.from(lockerElement.parentElement.parentElement.parentElement.getElementsByTagName("input")).map(function(xx, ii, arr) {
			if (arr[ii].parentElement.className.indexOf("switch-animate") >= 0) {
				arr[ii].parentElement.parentElement.addEventListener('click', e => {
					arr[ii].checked = arr[ii].parentElement.className.indexOf("switch-on") >= 0;
					wirteToFBWindowFan(arr[ii].id);
				});
			}
	 });

	 // adds a listener to event on update buttons
	 Array.from(lockerElement.parentElement.parentElement.parentElement.getElementsByClassName("btn btn-theme")).map(function(xx, ii, arr) {
				arr[ii].addEventListener('click', e => {
					e.preventDefault();
					wirteToFBTempValues(arr[ii].id);
				});
	 });
  });
	
	// adds a listener to history charts update button
  document.getElementById("dateButton").addEventListener('click', e => {
			e.preventDefault();
			fromFBToCharts();
	});
};
