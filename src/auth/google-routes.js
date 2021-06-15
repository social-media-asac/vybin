'use strict';

const router = require('express').Router();
const passport = require('passport');
router.use(passport.initialize());
const googleAuth = require('../auth/middleware/google-oauth');
const User = require('../auth/models/users.js');

// auth login
router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
  console.log(req.user);
});

// auth logout
// router.get('/logout', (req, res) => {
//   // handle with passport
//   res.send('logging out');
// });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


// auth with google+
// router.get('/google', passport.authenticate('google', {
//   scope: ['profile','email'],
// }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/log');
  },
);

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));


// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google',{ failureRedirect: '/login' }), async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const user = new User({
    username:'googleUser',
    password:'xxxxxx',
    user: req.usertoken,
    token :req.token ,
    tokenSecret:req.tokenSecret});

  const savedUser = await user.save(); 
  res.send(savedUser);

});

module.exports = router; 