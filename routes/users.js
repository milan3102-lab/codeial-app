const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controller');

// Profile route, requires authentication
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

// Sign-up and sign-in routes
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

// Create a new user
router.post('/create', usersController.create);

// Use passport to authenticate sign-in
router.post('/create-session', passport.authenticate('local', {
    failureRedirect: '/users/sign-in', // Redirect on failure
}), usersController.createSession); // Handle success in the controller

// Sign-out route
router.get('/sign-out', usersController.signOut);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);

module.exports = router;
