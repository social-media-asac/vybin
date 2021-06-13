'use strict';

const router = require('express').Router();
const passport = require('passport');
router.use(passport.initialize());

// auth login
router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
  console.log(req.user);
  

});

// auth logout
router.get('/logout', (req, res) => {
  // handle with passport
  res.send('logging out');

});

// auth with google+
router.get('/google', passport.authenticate('google', {
  scope: ['profile'],
}));


// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google',{ failureRedirect: '/login' }), (req, res) => {
  console.log(req.user);
  res.send({user : req.user , token :req.token ,tokenSecret:req.tokenSecret});
});

module.exports = router;