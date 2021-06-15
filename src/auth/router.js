'use strict';

//////////////////////////
////// Dependencies /////
////////////////////////

const express = require('express');
const authRouter  = express.Router();









//////////////////////////
////// Imports      /////
////////////////////////


const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
//////Ahmad//////////
const oAuth = require('./middleware/fb-oauth.js');
const acl =require('../auth/middleware/acl');



//////////////////////////
////// Routes    ////////
////////////////////////


authRouter.post('/register', signupHandler);
authRouter.post('/signin', basicAuth, signinHandler);
authRouter.get('/user', bearerAuth,acl('getUser'), usersHandler);
///////ahmad////////////
authRouter.get('/facebook', oAuth,oAuthFacebook); 





//////////////////////////
////// Handlers  ////////
////////////////////////


async function signupHandler(req,res,next){

  try {
    const user = new User(req.body);
    const savedUser = await user.save();    
    res.status(201).json({
      user: savedUser,
      token: savedUser.token,
    });
  } catch (error) {
    next(error.message);
  }
}

function signinHandler (req,res){
  res.status(200).json({
    user: req.user,
    token: req.user.token,
  });
  
}


async function usersHandler (req,res,next){
  const users = await User.find({});
  const user = users.map((user) => user.username);
  res.status(200).json(user);
}

/////Ahmad//////////////

async function oAuthFacebook (req,res){
  res.json({token: req.token, user:req.user});
}


module.exports = authRouter;