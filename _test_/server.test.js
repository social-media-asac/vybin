  
'use strict';




const supergoose = require('@code-fellows/supergoose');
const {server} = require('../src/server.js');
const request = supergoose(server);

describe('Server Test ', () => {
  it('Testing Home page', async () => {
    const response = await request.get('/');
    expect(response.status).toEqual(200);
  });
  it('Testing invalid routes', async () => {
  
    const response = await request.get('/anything');
    expect(response.status).toEqual(404);
    
  });
});