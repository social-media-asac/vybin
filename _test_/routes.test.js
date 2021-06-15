'use strict';
// require('dotenv').config();
process.env.SECRET = 'tasnim';
const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const route = require('../src/auth/router.js');
const bearer = require('../src/auth/middleware/bearer.js');
const mockRequest = supergoose(server);
const jwt = require('jsonwebtoken');
const acl = require('../src/auth/middleware/acl.js');
const user = { username: 'user' };
const token = jwt.sign(user, process.env.SECRET);
const basic = { username: 'basic' };
const basicToken = jwt.sign(basic, process.env.SECRET);
let users = {
  
  user: { username: 'user', password: 'password' ,email :'tasnim@', role : 'admin'},
  
};

let user2 = { username: 'user', password: 'password' ,email :'tasnim@', role : 'user'};
describe('Auth Router', () => {

  Object.keys(users).forEach(userType => {
  
    describe(`${userType} users`, () => {   
  
      it('can create one', async () => {
  
        const response = await mockRequest.post('/api/v1/auth/register').send(users[userType]);
        const userObject = response.body;
        // console.log(response.body);
        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username);
  
      });   
    });
  
    it('can signin with basic', async () => {
      const response = await mockRequest.post('/api/v1/auth/signin')
        .auth(users[userType].username, users[userType].password);
      const userObject = response.body;
      expect(response.status).toBe(200);
      expect(userObject.token).toBeDefined();
      expect(userObject.user._id).toBeDefined();
      expect(userObject.user.username).toEqual(users[userType].username);

    });
    it('can signin with bearer', async () => {
      const response = await mockRequest.post('/api/v1/auth/signin')
        .auth(users[userType].username, users[userType].password);
      const token = response.body.token;
      const bearerResponse = await mockRequest
        .get('/api/v1/auth/user')
        .set('Authorization', `Bearer ${token}`);
      expect(bearerResponse.status).toBe(200);

    });
    describe('bad logins', () => {
      it('basic fails with known user and wrong password ', async () => {
  
        const response = await mockRequest.post('/api/v1/auth/signin')
          .auth('user', 'xyz');
        const userObject = response.body;
  
        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
  
      });
  
      it('basic fails with unknown user', async () => {
  
        const response = await mockRequest.post('/api/v1/auth/signin')
          .auth('nobody', 'xyz');
        const userObject = response.body;
  
        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
  
      });
      it('bearer fails with an invalid token', async () => {

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/api/v1/auth/user')
          .set('Authorization', `Bearer foobar`);

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(403);

      });
      it('can get all the users', async () => {
        
        const response = await mockRequest.get('/api/v1/auth/user')
          .set('Authorization', `Bearer ${token}`).send(users[userType]);
        const userObject = response.body;
        console.log(response.body);
        expect(response.status).toBe(200);  
      }); 
      // it('cant ', async () => {
        
      //   const response = await mockRequest.get('/api/v1/auth/user')
      //   .set('Authorization', `Bearer ${token}`).send(user2);
      //   const userObject = response;
      // console.log('userObject',userObject);
      // expect(response.status).toBe(200);  
    });  
  });
  
  // it('cant ', async () => {
        
  //   const response = await mockRequest.get('/api/v1/auth/user')
  //   .set('Authorization', `Bearer ${token}`).send(user2);
  //   const userObject = response.body;
  //   console.log('userObject',userObject);
  //   // expect(response.status).toBe(200);  
  // }); 
});