'use strict';

//////////////////////////
////// Dependencies /////
////////////////////////

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


////////////////////
////// Schema /////
//////////////////


const SECRET = process.env.SECRET;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true },
);



UserSchema.virtual('token').get(function () {
  let tokenObject = {
    username: this.username,
  };
  return jwt.sign(tokenObject, SECRET, { expiresIn: '1hr' });
});



UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


UserSchema.statics.authenticateBasic = async function (username, password) {

  try {
    const user = await this.findOne({ username });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }else{
      throw new Error('Invalid User');
    }
  } catch (error) {
    throw new Error(error.message);        
  }
    
};

UserSchema.statics.authenticateBearer =async function (token) {
  console.log(SECRET,'SECRET From User Model');
  try {
    const payload = jwt.verify(token, SECRET);
    
    const user = await this.findOne({
      username: payload.username,
    });
    if (user) {
      return user;
    } else {
      throw new Error('invalid username from token');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
  



module.exports = mongoose.model('User', UserSchema);