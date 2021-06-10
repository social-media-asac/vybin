// console.log('emran')

const authorizeUrl = '//www.facebook.com/v10.0/dialog/oauth';
const options = {
  client_id:'511321263345523',
  redirect_uri:'http://localhost:3000/auth/facebook',
  state:'{st=state123abc,ds=123456789}',
};

const queryString = Object.keys(options).map((key) =>{
  return `${key}=${encodeURIComponent(options[key])}`;
}).join('&');
console.log(queryString ,'------------------------------------------');

const authUrl = `${authorizeUrl}?${queryString}`;
// console.log(authUrl);
const a = document.getElementById('oauth');
a.setAttribute('href', authUrl);



// function checkLoginState() {
//   FB.getLoginStatus(function(response) {
//       console.log(response)
//     statusChangeCallback(response);
//   });
// }

// require('dotenv').config();

//     window.fbAsyncInit = function() {
//       FB.init({
//         appId      : '948670909282442',
//         cookie     : true,
//         xfbml      : true,
//         version    : v1
//       });
        
//       FB.AppEvents.logPageView();   
        
//     };
  
//     (function(d, s, id){
//        var js, fjs = d.getElementsByTagName(s)[0];
//        if (d.getElementById(id)) {return;}
//        js = d.createElement(s); js.id = id;
//        js.src = "https://connect.facebook.net/en_US/sdk.js";
//        fjs.parentNode.insertBefore(js, fjs);
//      }(document, 'script', 'facebook-jssdk'));


//      function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
//     console.log('statusChangeCallback');
//     console.log(response);                   // The current login status of the person.
//     if (response.status === 'connected') {   // Logged into your webpage and Facebook.
//       testAPI();  
//     } else {                                 // Not logged into your webpage or we are unable to tell.
//       document.getElementById('status').innerHTML = 'Please log ' +
//         'into this webpage.';
//     }
//   }


//   function checkLoginState() {               // Called when a person is finished with the Login Button.
//     FB.getLoginStatus(function(response) {   // See the onlogin handler
//       statusChangeCallback(response);
//     });
//   }


//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '{app-id}',
//       cookie     : true,                     // Enable cookies to allow the server to access the session.
//       xfbml      : true,                     // Parse social plugins on this webpage.
//       version    : '{api-version}'           // Use this Graph API version for this call.
//     });


//     FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
//       statusChangeCallback(response);        // Returns the login status.
//     });
//   };
 
//   function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
//     console.log('Welcome!  Fetching your information.... ');
//     FB.api('/me', function(response) {
//       console.log(response)
//       console.log('Successful login for: ' + response.name);
//       document.getElementById('status').innerHTML =
//         'Thanks for logging in, ' + response.name + '!';
//     });
//   }
