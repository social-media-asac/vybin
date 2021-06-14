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
let id2;

let users = { username: 'user', password: 'password' ,email :'tasnim@'};

let user2={username: 'anwar', password: '123' ,email :'tas@'};




beforeAll(async () => {
   
  const userResponse =  await new Users(users).save();
  id = userResponse._id;
  const userResponse2 =  await new Users(user2).save();
  id2 = userResponse2._id;
});



const user = { username: 'user' };
const token = jwt.sign(user, process.env.SECRET);

const basic = { username: 'basic' };
const basicToken = jwt.sign(basic, process.env.SECRET);


  
describe('User test', () => {

  
  //get
  it('Test Getting  user data using GET method', async () => {

    const response = await request
      .get(`/api/v1/users/${id}`)
      .set('Authorization', `Bearer ${token}`);
    console.log(id);
    expect(response.status).toEqual(200);
  });

  //update
  it('Test update the user information using PUT method', async () => {
    let userResponse = await request.put(`/api/v1/users/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(userResponse.status).toBe(200);
  });

  it('Test the updating acount without setting the authorization using PUT method', async () => {
    let userResponse = await request.put(`/api/v1/users/${id}`);
    expect(userResponse.status).toBe(500);
  });

  it('Test if the user can not  update his account using PUT method', async () => {
    const response = await request
      .put(`/api/v1/users/1`)
      .set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(response.status).toEqual(403);
  });


  //follow

  it('Test the user can follow the others using PUT method', async () => {
   
    let userResponse = await request.put(`/api/v1/users/${id}/follow`).set('Authorization', `Bearer ${token}`).send({userId:id2});
    console.log('111', id  );
    console.log('22', id2  );
    expect(userResponse.status).toBe(200);
  });

  it('Test the user can unfollow the others using PUT method', async () => {
   
    let userResponse = await request.put(`/api/v1/users/${id}/unfollow`).set('Authorization', `Bearer ${token}`).send({userId:id2});
    console.log('111', id  );
    console.log('22', id2  );
    expect(userResponse.status).toBe(200);
  });

  it('Test get all the followers using get method', async () => {
   
    let userResponse = await request.get(`/api/v1/users/followers/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id});
    
    expect(userResponse.status).toBe(200);
  });


  //delete
  it('Test deleting data using DELETE ', async () => {
    const response = await request
      .delete(`/api/v1/users/${id}`)
      .set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(response.status).toEqual(200);
  });

  

  it('Test that the user cant follow himself using PUT method', async () => {
    let userResponse = await request.put(`/api/v1/users/${id}/follow`).set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(userResponse.status).toBe(403);
  });

  it('test the user cant follow himself using PUT method', async () => {
    let userResponse = await request.put(`/api/v1/users/${id}/unfollow`).set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(userResponse.status).toBe(403);
  });

});

