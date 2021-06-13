'use strict';

const authorizeUrl = '//www.facebook.com/v10.0/dialog/oauth';
const options = {
  client_id:'572920123691689',
  redirect_uri:'http://localhost:3000/api/v1/auth/facebook',
  state:'{st=state123abc,ds=123456789}',
};

const queryString = Object.keys(options).map((key) =>{
  return `${key}=${encodeURIComponent(options[key])}`;
}).join('&');


const authUrl = `${authorizeUrl}?${queryString}`;

const a = document.getElementById('oauth');
a.setAttribute('href', authUrl);

