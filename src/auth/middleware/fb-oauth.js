'use strict';

require('dotenv').config();
const { response } = require('express');
const superagent = require('superagent');
const User = require('../models/users');

const tokenServerUrl = 'https://graph.facebook.com/v10.0/oauth/access_token?';
const remoteAPI = 'https://graph.facebook.com/me';

const CLIENT_ID = process.env.CLIENT_FB_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET_FB;
const REDIRECT_URI = process.env.REDIRECT_URI;

async function exchangeCodeForToken(code){
  try {
    const tokenRes = await superagent.get(tokenServerUrl).query({
      client_id:CLIENT_ID,
      redirect_uri:REDIRECT_URI,
      client_secret:CLIENT_SECRET,
      code:code,
    }); 
    console.log(tokenRes.body);
    const accessToken = tokenRes.body.access_token;
    return accessToken;

  } catch (error) {
    console.error(error);
  }
}

async function getRemoteUserInfo(token){
  try {

    const userRes = await superagent.get(remoteAPI)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    const user = userRes.body;
    console.log('user info', user);
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUser(remoteUser){
  const user = {
    username: remoteUser.name,
    password: 'nothing',
  };
    
  const userObj = new User(user);
  const userDoc = await userObj.save();
  const token = userDoc.token;
  return [userDoc, token];
    
    
}
module.exports = async (req,res,next) =>{
  console.log('we are here');
  try {
    const code = req.query.code;
    console.log(code);
    const remoteToken = await exchangeCodeForToken(code);
    console.log('after token');
    const remoteUser = await getRemoteUserInfo(remoteToken);
    const [user,token] = await getUser(remoteUser);
    console.log('after save', user ,token);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error.message);
  }
};