
// mUid to be used in this file
var mUid;
var dbFertigationRef;


(function() {
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      mUid = firebaseUser.uid;
      dbClimateRef = firebase.database().ref().child('users').child(mUid).child('fertigation'); // Create the ref to FB Climate
      runPage();  // If the UserUid is back start the page - else logout
    } else {
      window.open("auth.html","_self");
      console.log('not logged in');
      // window.open("auth.html","_self");
    }
  });
}());



function runPage() {

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

  // Get element
  const waterTempTV = document.getElementById('waterTempTV');
  const waterPhTV = document.getElementById('waterPhTV');
  const waterEcTV = document.getElementById('waterEcTV');

  // Temp values
  const tempMaxView = document.getElementById('temp_max_text_view');
  const tempMinView = document.getElementById('temp_min_text_view');

  // Create reference to FireBase
  const dbRefFertigation = firebase.database().ref(mUid).child('fertigation');
  
  const dbRefWaterTemp = dbClimateRef.child('state').child('temperature');
  const dbRefWaterPH = dbClimateRef.child('state').child('ph');
  const dbRefWaterEC = dbClimateRef.child('state').child('ec');
  

  var temp = 0;
  var ec = 0;
  var ph = 0;

  
  //#########################################################
  //  Getting Values From FireBase - and displaying on page
  //########################################################

  dbRefWaterTemp.on('value', snap => {
    console.log(snap.val());

    if (mMeasurements == "f") {
      temp = +((temp * 1.8) + 32).toFixed(2); //  ( + ) at the start of this command Converts the String to a number
    }

    temp = snap.val();
    temp = parseFloat(temp);  // Getting Temp from firebase as String - parsing it into float (this is needed for the gauge element)
    waterTempTV.innerText = temp  + " °C";
  });

  dbRefWaterPH.on('value', snap => {
    console.log(snap.val());
    ph = snap.val();
    ph = parseFloat(ph);
    waterPhTV.innerText = ph;
  });

  dbRefWaterEC.on('value', snap => {
    console.log(snap.val());
    ec = snap.val();
    ec = parseFloat(ec);
    waterEcTV.innerText = ec;
  });


//  drawLineCharts("waterTemp");
//  drawLineCharts("waterPh");
//  drawLineCharts("waterEc");

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

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser); 
      // logOutButton.disabled = false;
      // window.open("climate_control.html","_self");
    } else {
      console.log('not logged in');
      // logOutButton.disabled = true;
      window.open("auth.html","_self");
    }
  });
  
  addLockerLogic(function(lockerElement) {
  	 // adds a listener to event on update buttons
  	 Array.from(lockerElement.parentElement.parentElement.parentElement.getElementsByClassName("btn btn-theme")).map(function(xx, ii, arr) {
  				arr[ii].addEventListener('click', e => {
  					e.preventDefault();
  				});
  	 });
    });
    
  // adds a listener to history charts update button
	document.getElementById("dateButton").addEventListener('click', e => {
			e.preventDefault();
			fromFBToCharts();
	});
};
