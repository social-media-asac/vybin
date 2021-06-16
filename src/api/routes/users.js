'use strict';

/////////////////////////
////// DEPENDENCIES ////
///////////////////////

const router = require('express').Router();
const bcrypt = require('bcrypt');
const decodedd=require('jwt-decode');



/////////////////////////
////// Imports  ////////
///////////////////////

const User = require('../../auth/models/users.js');
const bearerAuth = require('../../auth/middleware/bearer.js');
const acl = require('../../auth/middleware/acl.js');



/////////////////////////
////// Routes   ////////
///////////////////////

//update user
router.put('/:id',bearerAuth,acl('update'), updateUserHandler);

//delete user
router.delete('/:id',bearerAuth, acl('delete'), deleteUserHandler);

//get a user
router.get('/:id',bearerAuth,acl('read'), getUserHandler);

//Get User Followers
router.get('/followers/:userId', bearerAuth, getFollowersHandler);

// Follow a user
router.put('/:id/follow', bearerAuth, acl('update'),followHandler);

// Un-Follow a user
router.put('/:id/unfollow',bearerAuth,acl('update'), unfollowHandler);


/////////////////////////
////// Handlers ////////
///////////////////////

//=============//
//update user //
//===========//
async function updateUserHandler (req, res) {

  // let token = req.headers.authorization.split(' ').pop();
  let token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InV1dWZmIiwidXNlcklkIjoiNjBjYTFjODlkNTRkNDExYTJlZjUwYjFkIiwiaWF0IjoxNjIzODU4MzE4LCJleHAiOjE2MjM4NjE5MTh9.hGFcpyW--OhtTc7OCf68zEfHosT_a3ZZh3SdbQzHbSA'
  let decodedToken= await decodedd(token);
  console.log(decodedd(decodedToken),'xxxxxxxxxxxxxxxxxx');


  if (decodedToken.userId === req.params.id ) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }


    try {

      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('Account has been updated');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can update only your account!');
  }
}

//============//
//delete user//
//==========//


async function deleteUserHandler (req, res)  {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can delete only your account!');
  }
}

//=============//
// Get A User //
//===========//

async function getUserHandler (req, res) {


  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);        
  } catch (error) {
    res.status(500).json(error);
    
  }
}

//=====================//
// Get User Followers //
//===================//

async function getFollowersHandler (req, res) {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      }),
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
}

//================//
// Follow a user //
//==============//

async function followHandler (req, res) {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json('user has been followed');
      } else {
        res.status(403).json('you already follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('you cant follow yourself');
  }
}


//==================//
// unFollow a user //
//================//
async function unfollowHandler (req, res) {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json('user has been unfollowed');
      } else {
        res.status(403).json('you dont follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('you cant unfollow yourself');
  }
}

module.exports = router;