'use strict';

/////////////////////////
////// DEPENDENCIES ////
///////////////////////

const router = require('express').Router();
const decodeToken=require('jwt-decode');
const multer = require('multer');


/////////////////////
////// Imports  ////
///////////////////

const Post = require('../models/posts.js');
const User = require('../../auth/models/users.js');
const bearerAuth = require('../../auth/middleware/bearer.js');


/////////////////////
////// Routes   ////
///////////////////

//create a post
router.post('/',bearerAuth, createPostHandler );

//update a post
router.put('/:id', bearerAuth, updatePostHandler);

//delete a post
router.delete('/:id', bearerAuth, deletePostHandler);

//like <==> dislike a post
router.put('/like/:id', bearerAuth, likePostHandler);

//get a post
router.get('/:id', bearerAuth, getPostHandler);

//get timeline posts
router.get('/timeline/:userId',bearerAuth,timeLineHandler);

//get user's all posts
router.get('/profile/:username',bearerAuth, userPostsHandler);

// upload images

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

router.post('/upload', upload);

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    return res.status(200).json('File uploaded successfully');
  } catch (error) {
    console.error(error);
  }
});


///////////////////////
////// Handlers   ////
/////////////////////


//===============//
//Create a Post //
//=============//

async function createPostHandler (req, res){
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
}


//===============//
//Update a Post //
//=============//


async function updatePostHandler (req, res) {
  let token = req.headers.authorization.split(' ').pop();
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === decodeToken(token).userId) {
      console.log(post.userId,'***********');
      console.log(decodeToken(token).userId,'---------------------');
      await post.updateOne({ $set: req.body });
      res.status(200).json('the post has been updated');
    } else {
      res.status(403).json('you can update only your post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
}


//===============//
//Delete a Post //
//=============//


async function deletePostHandler (req, res) {
  let token = req.headers.authorization.split(' ').pop();
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === decodeToken(token).userId) {
      await post.deleteOne();
      res.status(200).json('the post has been deleted');
    } else {
      res.status(403).json('you can delete only your post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
}


//===============//
//Like a Post   //
//=============//


async function likePostHandler (req, res) {
  let token = req.headers.authorization.split(' ').pop();
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(decodeToken(token).userId)) {
      await post.updateOne({ $push: { likes: decodeToken(token).userId } });
      res.status(200).json('The post has been liked');
    } else {
      await post.updateOne({ $pull: { likes: decodeToken(token).userId } });
      res.status(200).json('The post has been disliked');
    }
  } catch (err) {
    res.status(500).json(err);
  }
}


//============//
//Get a Post //
//==========//

async function getPostHandler (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
}

//====================//
//Get TimeLine Posts //
//==================//

async function timeLineHandler (req, res) {
  
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      }),
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
}


//====================//
//Specific User Posts//
//==================//

async function userPostsHandler (req, res) {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
}


module.exports = router;
