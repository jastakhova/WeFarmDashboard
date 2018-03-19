(function() {


 //#####################################
  // FB AUTH - Nav bar email + logout
  //####################################
  
  // Elements
  const logOutButtonIndex = document.getElementById('log_out_button_index');
  const emailNavBarTV = document.getElementById('userEmail');

  // Add LogOut Evenet
  logOutButtonIndex.addEventListener('click', e => {
      //Get email and pass from input text
      firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser); 
      email = firebaseUser.email;
      Uid = firebaseUser.uid;
      FBUserRef = firebase.database().ref('users').child(Uid);
      emailNavBarTV.innerText = (email);
      console.log(Uid); 


      // Get users Settings
      FBUserInfoRef = firebase.database().ref('users').child(Uid).child('users_info');
      FBUserInfoRef.child('mMeasurements').on('value', snap => {
        mMeasurements = snap.val();
        console.log("Messurment  = " + mMeasurements);
      })
    

    } else {
      console.log('not logged in');
      // logOutButton.disabled = true;
      window.open("auth.html","_self");
    }
  });
}());


 //#####################################
  // Getters and Setters
  //####################################

var Uid;
var email;
var FBUserRef;

function setUserUid(uid) {
  Uid = uid;
}

function getUserUid() {
    return Uid;
  }

function getUserEmail() {
    return email;
  }





  //########################################################################
  // Users Settings
  // Needs to be present on all pages so that they know what messurment to display
  //#########################################################################


  var FBUserInfoRef;
  var mMeasurements;

  function getSettingsMessu() {
    return mMeasurements;
  }

