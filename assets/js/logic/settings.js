// mUid to be used in this file
var mUid;




(function() {
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      mUid = firebaseUser.uid;
      dbClimateRef = firebase.database().ref().child('users').child(mUid).child('climate'); // Create the ref to FB Climate
      runPage();  // If the UserUid is back start the page - else logout
    } else {
      window.open("auth.html","_self");
      console.log('not logged in');
      // window.open("auth.html","_self");
    }
  });
}());



function runPage() {

	// Synce object changes to the webpage
  // var user_id = "baCL0o4SnFWcogs6atBLuGOHUA42";
  firebase.database().ref('User_Deivce_Dict').child(mUid).on('value', snap => {

    var deviceID = snap.val();
    if (deviceID != null) {
    deviceList.innerText = deviceID;
	}
  });

  //Show Messurment on Page
  FBUserInfoRef.child('mMeasurements').on('value', snap => {
    var messurment = snap.val();
    mChosenMessuTextView.innerText = messurment;
    });

}


const deviceIdInpuet = document.getElementById("computerIDInputText");
const deviceList = document.getElementById("DeivceList");

// Manual Function
function FBLinkUserToDevice(){
     var DeviceId = deviceIdInpuet.value;
     console.log(DeviceId); 
     var Uid = getUserUid();
     firebase.database().ref('User_Deivce_Dict').child(Uid).set(DeviceId);
     firebase.database().ref('User_Deivce_Dict').child(DeviceId).set(Uid);

     deviceList.innerText = DeviceId;

}




//###################### Settings Functions #########################

const mChosenMessuTextView = document.getElementById("ChosenMessuTextView");

// Chosen Messurment From DashBoard To FB
function FBSetMeasurement(messu_button){
     if (messu_button == "c_messu_button") {
        FBUserInfoRef.child('mMeasurements').set("c");
     } else {
        FBUserInfoRef.child('mMeasurements').set("f");
     }
}
