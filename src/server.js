'use strict';

//////////////////////////
////// Dependencies /////
////////////////////////

const express = require('express');
const app = express();
const morgan= require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');


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


/////////////////////////////
//////// Middleware  ///////
///////////////////////////
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

/////////Ahmad///////

// const path =require('path');

// app.use(express.static(path.join(__dirname,'../public')));


app.use(express.static('./public'));



// Images

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post('/api/v1/upload', upload.single('file'), (req, res) => {
  try {
    return res.status(200).json('File uploaded successfully');
  } catch (error) {
    console.error(error);
  }
});



/////////////////////////////
//////// Routes      ///////
///////////////////////////

// home
app.get('/', homeHandler);

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);



// Error handlers
app.use('*',notFoundHandler);
app.use(errorHandler);


// home handler
function homeHandler(req,res){
  
  res.status(200).redirect('./index.html');
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
