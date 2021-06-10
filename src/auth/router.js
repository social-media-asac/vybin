'use strict';
const express = require('express');
const authRouter = express.Router();

const oAuth = require('./middleware/fb-oauth.js');

authRouter.get('/auth/facebook', oAuth, (req,res)=>{
  res.json({token: req.token, user:req.user});
});

module.exports =authRouter;