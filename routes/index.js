const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const passport = require('passport'); // Add passport for authentication checks

console.log('router loaded');

// Home route
router.get('/', homeController.home);

// User, Post, and Comment routes
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

// For comment creation, we can add it directly here if you prefer
router.post('/comments/create', passport.checkAuthentication, require('../controllers/comments_controller').create);

// For any further routes, access from here
// router.use('./routerName', require('./routerfile'));

module.exports = router;
