'use strict';

require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const superagent = require('superagent');
// const route = require('../../api/routes/google.js')
// // const queryString = require('querystring');
// const { response } = require('express');

const User = require('../models/users.js');
const findOrCreate = require ('mongoose-findorcreate');

// const tokenServerUrl = 'https://accounts.google.com/o/oauth2/token';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const CLIENT_ID_G = process.env.CLIENT_ID_Go;
const CLIENT_SECRET_G = process.env.CLIENT_SECRET_Go;
// const REDIRECT_URI_G = process.env.REDIRECT_URI_G ;





// passport.use(
//   new GoogleStrategy({

//     clientID:CLIENT_ID_G ,
//     clientSecret:CLIENT_SECRET_G ,
//     callbackURL:'/auth/google/redirect',
//   },async function(token, tokenSecret, profile, done) {
//     const newUser = {
//       username:profile.name.givenName,
//       email:profile.emails[0].value,
//       password:profile.password||'xxxxx',
//     };
//     try {

//       let user=await User.findOne({user: newUser.email});

//       if(user){
//         done (null,user);
//       }else{
//         user = await User.create(newUser);
//         done(null,user);
//       }

      
//     } catch (error) {
//       console.log(error,'=========XXXX==========');
      
//     }



  
  

//   },

//   ));

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((obj, cb) => {
//   cb(null, obj);
// }); 

// import all the things we need  
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
// const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        //get the user data from google 
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
        };

        try {
          //find the user in our database 
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            //If user present in our database.
            done(null, user);
          } else {
            // if user is not preset in our database save user data to database.
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      },
    ),
  );

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
}; 


module.exports=passport;