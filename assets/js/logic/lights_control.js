
// mUid to be used in this file
var mUid;

(function() {
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      mUid = firebaseUser.uid;
      dbLightsRef = firebase.database().ref().child('users').child(mUid).child('lights');

      runPage();  // If the UserUid is back start the page - else logout
    } else {
      window.open("auth.html","_self");
      console.log('not logged in');
      // window.open("auth.html","_self");
    }
  });
}());


function runPage() {
  console.log(mUid);

  //#########################
  //  Get Elements from page
  //#########################

  // Switches
  const lightsSwitch = document.getElementById('lightsSwitch');
  // Lights On Off values
  const lightsOnTimeInput = document.getElementById('lightsOnTimeInput');
  const lightsOffTimeInput = document.getElementById('lightsOffTimeInput');

  // Create reference to FireBase
  const dbRefLightsSwitch = dbLightsRef.child('lightsSwitch');
  const dbRefLightsOnTime = dbLightsRef.child('lightsOnTime');
  const dbRefLightsOffTime = dbLightsRef.child('lightsOffTime');
  
  // Fan  Window and general Listeners
  dbRefLightsSwitch.on('value', snap => {
    lightsSwitch.checked = snap.val();
  });

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
    	// adds a listener to the change of state for the switches to write the new value to the database
  	 Array.from(lockerElement.parentElement.parentElement.parentElement.getElementsByTagName("input")).map(function(xx, ii, arr) {
  			if (arr[ii].parentElement.className.indexOf("switch-animate") >= 0) {
  				arr[ii].parentElement.parentElement.addEventListener('click', e => {
  					arr[ii].checked = arr[ii].parentElement.className.indexOf("switch-on") >= 0;
  					wirteToFBLightsSwitch(arr[ii].id);
  				});
  			}
  	 });

  	 // adds a listener to event on update buttons
  	 Array.from(lockerElement.parentElement.parentElement.parentElement.getElementsByClassName("btn btn-theme")).map(function(xx, ii, arr) {
  				arr[ii].addEventListener('click', e => {
  					e.preventDefault();
  				});
  	 });
    });
};