'use strict';

//////////////////////////
////// Dependencies /////
////////////////////////

const express = require('express');
const app = express();
const morgan= require('morgan');
const cors = require('cors');


////////////////////////////
///////  ahmad  ///////////
//////////////////////////
const path =require('path');
const authRoutes = require('./auth/router.js');
const oAuth = require('./auth/middleware/fb-oauth');
app.use(cors());
app.use(morgan('dev'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'/public')));

app.use('/',authRoutes );
// app.get('/auth/facebook', oAuth, (req,res)=>{
//   res.json({token: req.token, user:req.user});
// });


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

/////// TODO //////
//// 1. API
//// 2. auth 
// A) Basic Auth
// B) Bearer
// C) O-auth ===> Google ===> Facebook ===> Twitch
//// 3. Chat
// 