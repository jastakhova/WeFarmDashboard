
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
  console.log(mUid);

//####################
// Load Libraries
//####################
google.charts.load('current', {packages:['corechart', 'line' ,'gauge']}); 


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
    waterTempTV.innerText = temp;
    drawTempGuage();
  });

  dbRefWaterPH.on('value', snap => {
    console.log(snap.val());
    ph = snap.val();
    ph = parseFloat(ph);
    waterPhTV.innerText = ph;
    drawPHGuage();
  });

  dbRefWaterEC.on('value', snap => {
    console.log(snap.val());
    ec = snap.val();
    ec = parseFloat(ec);
    waterEcTV.innerText = ec;
  });


// The Gauge Tempurature Elements - // https://developers.google.com/chart/interactive/docs/gallery/gauge

function drawTempGuage() {

  var data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Temperature', temp],
    ]);

  console.log("data");
  console.log(data);

  if (mMeasurements == "f") {
    var options = {
      width: 120, height: 120,
      min:0, max:122, 
      redFrom: 104, redTo: 122,
      yellowFrom:86, yellowTo: 104,
      greenFrom:59, greenTo: 86,
      minorTicks: 10
    };

  } 
  else {  // Messurments are in C
    var options = {
      width: 120, height: 120,
      min:0, max:50, 
      redFrom: 40, redTo: 50,
      yellowFrom:30, yellowTo: 40,
      greenFrom:15, greenTo: 30,
      minorTicks: 10
    };
  }
  
  var chart = new google.visualization.Gauge(document.getElementById('water_temp_guage'));
  chart.draw(data, options);
}

  // The Gauge Humidity Element
  function drawPHGuage() {

    var data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['PH', ph]
      ]);

    var options = {
      width: 120, height: 120,
      min:0, max:10, 
      redFrom: 0, redTo: 3,
      yellowFrom: 3 , yellowTo: 6,
      greenFrom:6, greenTo: 7,
      minorTicks: 5,
    };

    var chart = new google.visualization.Gauge(document.getElementById('water_ph_guage'));

    chart.draw(data, options);
  }

  // Execute the Drawing of the line chart
  // google.charts.setOnLoadCallback(drawTempLineChartFromFB);
  // google.charts.setOnLoadCallback(drawHumidLineChartFromFB);


  getDate();
  drawLineCharts("waterTemp");
  drawLineCharts("waterPh");
  drawLineCharts("waterEc");

    // Date Functions
    // Can also use this https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tolocalestring
    function getDate() {

      var today = new Date();
      var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd;
    } 
    if(mm<10){
      mm='0'+mm;
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
