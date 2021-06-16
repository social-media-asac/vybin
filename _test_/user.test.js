'use strict';

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
let id3;
let users = { username: 'user', password: 'password' ,email :'tasnim@'};
let user2={username: 'anwar', password: '123' ,email :'tas@'};
let user3={username: 'ahmad', password: '123' ,email :'tas@'};
beforeAll(async () => {
  const userResponse =  await new Users(users).save();
  id = userResponse._id;
  const userResponse2 =  await new Users(user2).save();
  id2 = userResponse2._id;
  const userResponse3 =  await new Users(user3);
  id3 = userResponse3._id;
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
    // console.log('userResponse',userResponse.body);
    expect(userResponse.status).toBe(200);
    expect(userResponse.body).toEqual('Account has been updated');
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
    let userResponse = await request.put(`/api/v1/users/follow/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id2});
    // console.log('userResponse',userResponse.body);
    expect(userResponse.body).toEqual('user has been followed');
    expect(userResponse.status).toBe(200);
  });
  it('Test the user cant follow the others withot setting the authorization', async () => {
    let userResponse = await request.put(`/api/v1/users/follow/${id}`).send({userId:id2});
    expect(userResponse.status).toBe(500);
  });
  it('Test the user cant follow the others without sending the user id', async () => {
    let userResponse = await request.put(`/api/v1/users/follow/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(userResponse.status).toBe(403);
  });
  it('Test the user can unfollow the others using PUT method', async () => {
    let userResponse = await request.put(`/api/v1/users/unfollow/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id2});
    expect(userResponse.status).toBe(200);
  });
  it('Test the user cant unfollow the user that not exist', async () => {
    let userResponse = await request.put(`/api/v1/users/unfollow/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id3});
    expect(userResponse.status).toBe(403);
  });
  it('Test get all the followers using get method', async () => {
    let userResponse = await request.get(`/api/v1/users/followers/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(userResponse.status).toBe(200);
  });
  it('Test get all the followers using get method', async () => {
    let userResponse = await request.get(`/api/v1/users/followers/${id}`).send({userId:id});
    expect(userResponse.status).toBe(500);
  });
  //delete
  it('Test deleting data using DELETE ', async () => {
    const response = await request
      .delete(`/api/v1/users/${id}`)
      .set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(response.status).toEqual(200);
  });
  it('Test deleting data without authorization ', async () => {
    const response = await request
      .delete(`/api/v1/users/${id}`)
    .send({userId:id});
    expect(response.status).toEqual(500);
  });
  it('Test deleting data using DELETE ', async () => {
    const response = await request
      .delete(`/api/v1/users/${id}`)
      .set('Authorization', `Bearer ${token}`).send({userId:id2});
    expect(response.status).toEqual(403);
  });
  it('Test that the user cant follow himself using PUT method', async () => {
    let userResponse = await request.put(`/api/v1/users/follow/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(userResponse.status).toBe(403);
  });
  it('test the user cant unfollow himself using PUT method', async () => {
    let userResponse = await request.put(`/api/v1/users/unfollow/${id}`).set('Authorization', `Bearer ${token}`).send({userId:id});
    expect(userResponse.status).toBe(403);
  });
});