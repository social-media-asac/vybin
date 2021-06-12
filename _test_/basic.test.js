'use strict';
require('@code-fellows/supergoose');
const middleware = require('.././src/auth/middleware/basic.js');
const Users = require('../src/auth/models/users.js');
let users = {
  
  user: { username: 'user', password: 'password' ,email :'tasnim@'},
};

beforeAll(async () => {
  await new Users(users.user).save();
});

describe('Auth Middleware', () => {
 
  const req = {};
  
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();
  describe('user authentication', () => {
    it('fails a login for a user (user) with the incorrect basic credentials', () => {
      req.headers = {
        authorization: 'Basic YWRtaW46Zm9v',
      };
      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });
    });
    // it('logs in a user with the right credentials', () => {
    //   // Change the request to match this test case
    //   req.headers = {
    //     authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
    //   };
    //   return middleware(req, res, next)
    //     .then(() => {
    //       expect(next).toHaveBeenCalledWith();
    //     });
    // });
  });
});