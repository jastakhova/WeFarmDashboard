function wirteToFBLightsSwitch(id){
  var status = document.getElementById(id).checked;
  // firebase.database().ref(id).set(status);
  dbLightsRef.child(id).set(status);
  console.log(id + status);
}

// Manual Function
function wirteToFBManual(){
	var status = document.getElementById("lightsManualSwitch").checked;
	// firebase.database().ref('manual').set(status);
  dbLightsRef.child('lightsManualSwitch').set(status);
	console.log("lightsManualSwitch " + status);

  var lightsSwitchElem = document.getElementById("lightsSwitch");

	if (status == true) {
    lightsSwitchElem.disabled = false;
	}
  else {
   lightsSwitchElem.disabled = true;
  }
}