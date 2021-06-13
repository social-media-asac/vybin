'use strict';

process.env.SECRET = 'tasnim';

const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const middleware = require('../src/auth/middleware/bearer.js');
const jwt = require('jsonwebtoken');
const mockRequest = supergoose(server);

let users = {
  
  user: { username: 'user', password: 'password' ,email :'tasnim@'},
};

describe('Auth Middleware', () => {

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();
  
  describe('user authentication', () => {
  
    it('fails a login for a user (user) with an incorrect token', () => {
  
      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };
  
      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });
  
    });
    // it('logs in a user with a proper token', () => {

    //   const user = { username: 'user'};
    //   const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1hr' });
  
    //   req.headers = {
    //     authorization: `Bearer ${token}`,
    //   };
  
    //   return middleware(req, res, next)
    //     .then(() => {
    //       expect(next).toHaveBeenCalledWith();
    //     });
    // });
  });
});