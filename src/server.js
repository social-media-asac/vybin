'use strict';

//////////////////////////
////// Dependencies /////
////////////////////////

const express = require('express');
const app = express();
const morgan= require('morgan');
const cors = require('cors');





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