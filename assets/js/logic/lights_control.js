
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
  const lightsManualSwitch = document.getElementById('lightsManualSwitch');
  const lightsSwitch = document.getElementById('lightsSwitch');
  // Lights On Off values
  const lightsOnTimeInput = document.getElementById('lightsOnTimeInput');
  const lightsOffTimeInput = document.getElementById('lightsOffTimeInput');

  // Create reference to FireBase
  const dbRefLightsManualSwitch = dbLightsRef.child('lightsManualSwitch');
  const dbRefLightsSwitch = dbLightsRef.child('lightsSwitch');
  const dbRefLightsOnTime = dbLightsRef.child('lightsOnTime');
  const dbRefLightsOffTime = dbLightsRef.child('lightsOffTime');
  

  //#########################################################
  //  Getting Values From FireBase - and displaying on page
  //########################################################

  // Settings Part - show Lights On and Off time values

  // dbRefTempMax.on('value', snap => {
  //   tempMaxView.innerText = snap.val();
  // });

  // dbRefTempMin.on('value', snap => {
  //   tempMinView.innerText = snap.val();
  // });


  // Fan  Window and general Listeners
  dbRefLightsSwitch.on('value', snap => {
    lightsSwitch.checked = snap.val();
  }) 

  dbRefLightsManualSwitch.on('value', snap => {
    lightsManualSwitch.checked = snap.val();
  }) 

  // dbRefWindow.on('value', snap => {
  //   windowSwitch.checked = snap.val();
  // }) 

  // dbRefGeneral.on('value', snap => {
  //   generalSwitch.checked = snap.val();
  // }) 


  //############################
  // FB AUTH
  //############################
  
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
  
};