'use strict';

require('dotenv').config();


process.env.SECRET = 'test';


const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const Users = require('../src/auth/models/users.js');
const request = supergoose(server);
const jwt = require('jsonwebtoken');
const middleware = require('../src/api/routes/users.js');
const bearer = require('../src/auth/middleware/bearer.js');




let id ;

let users = { username: 'user', password: 'password' ,email :'tasnim@'};

beforeAll(async () => {
   
  const userResponse =  await new Users(users).save();
  id = userResponse._id;
});



const user = { username: 'user' };
const token = jwt.sign(user, process.env.SECRET);

const basic = { username: 'basic' };
const basicToken = jwt.sign(basic, process.env.SECRET);


  
describe('User test', () => {

  

  it('Test Getting specific data on GET /id', async () => {

    // const userResponse = await request.post('/api/v1/auth/register').send(users);
    // console.log(userResponse.body);
    
    const response = await request
      .get(`/api/v1/users/${id}`)
      .set('Authorization', `Bearer ${token}`);
    console.log(id);
    expect(response.status).toEqual(200);
  });


  it('Test  PUT /', async () => {
    let userResponse = await request.put(`/api/v1/users/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(userResponse.status).toBe(200);
  });

  it('Test throwing an error if the ID does not exist on PUT /', async () => {
    const response = await request
      .put(`/api/v1/users/1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(403);
  });

  it('Test deleting data using DELETE ', async () => {
    const response = await request
      .delete(`/api/v1/users/${id}`)
      .set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(response.status).toEqual(200);
  });


});

