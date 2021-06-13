'use strict';

require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const superagent = require('superagent');
// const route = require('../../api/routes/google.js')
// // const queryString = require('querystring');
// const { response } = require('express');

const User = require('../models/users.js');

// const tokenServerUrl = 'https://accounts.google.com/o/oauth2/token';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const CLIENT_ID_G = process.env.CLIENT_ID_Go;
const CLIENT_SECRET_G = process.env.CLIENT_SECRET_Go;
// const REDIRECT_URI_G = process.env.REDIRECT_URI_G ;





passport.use(
  new GoogleStrategy({
   
    clientID:CLIENT_ID_G ,
    clientSecret:CLIENT_SECRET_G ,
    callbackURL:'/auth/google/redirect',
  },    function(token, tokenSecret, profile, done) {
   
    return done(null, {profile :profile , token :token , tokenSecret:tokenSecret}, 
    );

  },

  ));
passport.serializeUser((user, cb) => {
  cb(null, user);
});passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});