'use strict';

process.env.SECRET = 'tasnim';


const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const Users = require('../src/auth/models/users.js');
const request = supergoose(server);
const jwt = require('jsonwebtoken');
const Post = require('../src/api/models/posts.js');


let users = { username: 'user', password: 'password' ,email :'tasnim@'};

let id ;
let postId;
let userPosts = {userId : 'userId'};

beforeAll(async () => {
   
  const userResponse =  await new Users(users).save();
  id = userResponse._id;

});

const user = { username: 'user' };
const token = jwt.sign(user, process.env.SECRET);

const basic = { username: 'basic' };
const basicToken = jwt.sign(basic, process.env.SECRET);

describe('Posts Tests ', ()=>{

  it('can create a post', async () => {
    const response = await request.post('/api/v1/posts').set('Authorization', `Bearer ${token}`)
      .send(userPosts);
    expect(response.status).toBe(200);
    expect().toEqual();
  });


  it('cant create a post without setting the authorization', async () => {
    const response = await request.post('/api/v1/posts')
      .send(userPosts);
    expect(response.status).toBe(500);
  });


  it('can update a post', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.put(`/api/v1/posts/${postId}`).set('Authorization', `Bearer ${token}`)
      .send(userPosts);
    expect(response.status).toBe(200);
  });

  it('cant update the others posts', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.put(`/api/v1/posts/${postId}`).set('Authorization', `Bearer ${token}`)
      .send({userId : id});
    expect(response.status).toBe(403);
  });

  it('cant update a post without setting the authorization', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.put(`/api/v1/posts/${postId}`)
      .send(userPosts);
    expect(response.status).toBe(500);
  });


  it('can delete a post', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.delete(`/api/v1/posts/${postId}`).set('Authorization', `Bearer ${token}`)
      .send(userPosts);
    expect(response.status).toBe(200);
  });

  it('cant delete a post without authorization', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.delete(`/api/v1/posts/${postId}`)
      .send(userPosts);
    expect(response.status).toBe(500);
  });

  it('cant delete the others posts', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.delete(`/api/v1/posts/${postId}`).set('Authorization', `Bearer ${token}`)
      .send({userId : id});
    expect(response.status).toBe(403);
  });


  it('can get a post by postId', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.get(`/api/v1/posts/${postId}`).set('Authorization', `Bearer ${token}`)
      .send(userPosts);
    expect(response.status).toBe(200);
  });

  it('cant get a post by postId without authorization', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.get(`/api/v1/posts/${postId}`)
      .send(userPosts);
    expect(response.status).toBe(500);
  });


  it('can like a specific post', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.put(`/api/v1/posts/${postId}/like`).set('Authorization', `Bearer ${token}`)
      .send(userPosts);
    expect(response.status).toBe(200);
  });

  it('cant like a specific post without authorization', async () => {
    const postsResponse=  await new Post(userPosts).save();
    postId = postsResponse._id;
    const response = await request.put(`/api/v1/posts/${postId}/like`)
      .send(userPosts);
    expect(response.status).toBe(500);
  });


  it('can get timeline post', async () => {
    const response = await request.get(`/api/v1/posts/timeline/${id}`).set('Authorization', `Bearer ${token}`)
      .send(userPosts);
    expect(response.status).toBe(200);
  });

  it('cant get timeline post without authorization ', async () => {
    const response = await request.get(`/api/v1/posts/timeline/${id}`)
      .send(userPosts);
    expect(response.status).toBe(500);
  });

  
  it('can get a spesific peofile by username', async () => {
    const response = await request.get(`/api/v1/posts/profile/${users.username}`).set('Authorization', `Bearer ${token}`)
      .send(users.username);
    expect(response.status).toBe(200);
  });
    
  it('cant get a spesific peofile without authorization', async () => {
    const response = await request.get(`/api/v1/posts/profile/${users.username}`)
      .send(users.username);
    expect(response.status).toBe(500);
  });

});