(function() {

  //#########################
  //  FIREBASE AUTH Page
  //#########################

  // FireBase Authentication
  const txtEmail = document.getElementById('email_input');
  const txtPass = document.getElementById('pass_input');
  const signUpButton = document.getElementById('sign_up_button');
  const logInButton = document.getElementById('log_in_button');

  // Add Login Evenet
  logInButton.addEventListener('click', e => {
  	e.preventDefault();
    //Get email and pass from input text
    const email = txtEmail.value;
    const pass = txtPass.value;
    const auth = firebase.auth();
    // Sign In
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.then(firebaseUser => console.log(firebaseUser));
    promise.catch( e => console.log(e.message));
  });


  var dbUsersRef = firebase.database().ref().child('users');

  // Add SignUp Evenet
  signUpButton.addEventListener('click', e => {
  	e.preventDefault();
    //Get email and pass from input text
    // TODO: Check if Real Email
    const email = txtEmail.value;
    const pass = txtPass.value;
    const auth = firebase.auth();

    // Sign Up
    auth.createUserWithEmailAndPassword(email, pass).then(function(response) {
      console.log(response.uid);
      // Adds the user to user in DB and Open User Info
      dbUsersRef.child(response.uid).child('users_info').child('email').set("love");

      // TODO : add a catch functionality

      // promise.catch( e => console.log(e.message));
    });
  });

  // Add a realtime Listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser);
      window.open("index.html","_self");
    } else {
      console.log('not logged in');
      // window.open("auth.html","_self");
    }
  });


}());
