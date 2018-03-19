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




//###################### Open Wehter Testing Functions #########################

function getWeather(){
      var val = document.getElementById("chosen_city").value;

      // Reciving weather data 

      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + val + ",us&units=metric&appid=52110cc91d0623d632d20820991119f4", false);
      xhr.send();

      console.log(xhr.status);
      console.log(xhr.statusText);
      console.log(xhr.response);
      var response = JSON.parse(xhr.response);
      console.log(response);
      console.log(response.main);

      // Getting the temp humid and icon from the response
      
      var temp = response.main.temp;
      var humid = response.main.humidity;
      var icon = response.weather[0].icon;
      console.log("temp  :  " + temp);
      console.log("Humid  :  " + humid);
      console.log("icon  :  " + icon);

      // update UI
      showWeatherData(temp, humid, icon);
}

  var mTemp = document.getElementById("city_temp");
  var mHumid = document.getElementById("city_humid");
  var mIcon = document.getElementById("chosen_city"); 

function showWeatherData(temp, humid, icon) {
  
  mTemp.innerText = temp;
  mHumid.innerText = humid;
  mIcon.src = "http://openweathermap.org/img/w/" + icon + ".png";
  console.log(mIcon.src);
  // Need to still refreash the IMG after applying the new src
}







