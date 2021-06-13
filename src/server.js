'use strict';

//////////////////////////
////// Dependencies /////
////////////////////////

const express = require('express');
const app = express();
const morgan= require('morgan');
const cors = require('cors');
const helmet = require('helmet');

//////////////////////////
////// Imports      /////
////////////////////////

// Auth routes <==> Signup <==> Signin
const authRoutes  = require('./auth/router.js');

// Error handlers <==> 404 <==> 500
const notFoundHandler = require('./errors/404.js');
const errorHandler = require('./errors/500.js');

////////// API Routes

// CRUD Posts <==> Like/disLike Posts <==> get one Post <==> get timeLine posts <==> get user profile posts
const postRoute  = require('./api/routes/posts');

// Update & Delete User <==> get a user <==> get followers <==> follow & un-follow a user
const userRoute  = require('./api/routes/users.js');

const googleRoutes = require( './api/routes/google.js' );

const passportSetup = require('../src/auth/middleware/google-oauth.js');

/////////////////////////////
//////// Middleware  ///////
///////////////////////////

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.set('view engine', 'ejs');



/////////////////////////////
//////// Routes      ///////
///////////////////////////

// home
app.get('/', homeHandler);

// routes
app.get('/',homeHandler);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/auth', googleRoutes);


// Error handlers
app.use('*',notFoundHandler);
app.use(errorHandler);


// home handler
function homeHandler(req,res){
  res.status(201).send(
    'Vibe-in Social Media',
  );
}


//////////////////////////
////// Exports      /////
////////////////////////

module.exports = {
  server: app,
  startup: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
