// Restart Sensor

function restartSensor() {
  restartButton.disabled = true;
  dbClimateRef.child('restartInProgres').set(true);
}


// Wirte to FB min max temp val Function
function wirteToFBTempValues(id) {
  if (id == "tempMinButton") {
    var val = document.getElementById("temp_min_text_view").value;
  }
  if (id == "tempMaxButton") {
    var val = document.getElementById("temp_max_text_view").value;
  }
  // firebase.database().ref(id).set(val);
  dbClimateRef.child(id).set(val);
  console.log(id + val);
}

// Manual Function
function wirteToFBManual() {
  var status = document.getElementById("manual").checked;
  dbClimateRef.child('manual').set(status);
  console.log("manual " + status);

  var fanElem = document.getElementById("fan");
  var windowElem = document.getElementById("window");
  var generalElem = document.getElementById("generalSwitch");

  if (status == true) {
    fanElem.disabled = false;
    windowElem.disabled = false;
    generalElem.disabled = false;
  }
  else {
    fanElem.disabled = true;
    windowElem.disabled = true;
    generalElem.disabled = true;
  }
}

// Fun or Window controller
function wirteToFBWindowFan(id) {
  var status = document.getElementById(id).checked;
  // firebase.database().ref(id).set(status);
  // FBUserRef.child('climate').child(id).set(status);
  dbClimateRef.child(id).set(status);
  console.log(id + status);
}

// Line Chart Functions
function fromFBToCharts() {
	var dateElement = document.getElementById("dateTextInput");
	if (dateElement.value == "") {
		//sets current date to the history chart control
  	dateElement.value = $.datepicker.formatDate('mm-dd-yy', new Date());
	}

  var date = dateElement.value;
  // Retrive the Data from Humid + Temps
//  FBRefTemp = firebase.database().ref().child('DailyTemp').child(date);
//  FBRefHumid = firebase.database().ref().child('DailyHumid').child(date);
  // After Adding the UID Functionalityt
  FBRefTemp = dbClimateRef.child('history').child('DailyTemp').child(date);
  FBRefHumid = dbClimateRef.child('history').child('DailyHumid').child(date);

  // Humid Array
  FBRefHumid.once('value').then(function(snapshot) {
    var dataFromFB = snapshot.val();
    var arry = snapshotToArray("humid", snapshot);
    console.log(arry);
    new Chart(document.getElementById("humidityChart").getContext("2d")).Line(arry);
  });
  

  // Temp Array
  FBRefTemp.once('value').then(function(snapshot) {
    var dataFromFB = snapshot.val();
    var arry = snapshotToArray("temp", snapshot);
    console.log(arry);
    new Chart(document.getElementById("temperatureChart").getContext("2d")).Line(arry);
  });
}


function snapshotToArray(type, snapshot) {
  var keyArr = [];
  var valueArr = [];
  var beatSize = Math.ceil(snapshot.numChildren() / 20.0);
  var currentBeat = 0;
  
  var valTransformer = function(item) {
		if (mMeasurements == "f" && type == "temp") {
			return +((item.val() * 1.8) + 32).toFixed(2);
		} else {
			return item.val();
		}
  }

	snapshot.forEach(function(item) {
	  if ((currentBeat++) % beatSize == 0) {
			var itemVal = valTransformer(item);
			var itemKey = item.key;
			valueArr.push(itemVal);
			keyArr.push(itemKey);
		}
	});
	
	var color = "";
	if (type == "temp") {
		color = "151,187,205";
	} else {
		color = "220,220,220";
	};
	
	return {
          labels : keyArr,
          datasets : [
              {
                  fillColor : "rgba(" + color + ",0.5)",
                  strokeColor : "rgba(" + color + ",1)",
                  pointColor : "rgba(" + color + ",1)",
                  pointStrokeColor : "#fff",
                  data : valueArr
              }
          ]

      };
}

//    case "waterTemp" :
//      FBRef = FBUserRef.child('fertigation').child('history').child('temperature').child(date);
//      chartType = "temperature";
//      id = "waterTemp_line_chart";
//      break;
//
//    case "waterPh" :
//      FBRef = FBUserRef.child('fertigation').child('history').child('ph').child(date);
//      chartType = "PH";
//      id = "ph_line_chart";
//      break;
//
//    case "waterEc" :
//      FBRef = FBUserRef.child('fertigation').child('history').child('ec').child(date);
//      chartType = "EC";
//      id = "ec_line_chart";
//      break;
//  }

function wirteToFBLightsSwitch(id){
  var status = document.getElementById(id).checked;
  // firebase.database().ref(id).set(status);
  dbLightsRef.child(id).set(status);
}
