const express = require('express');
const router = express.Router();


const postsController=require('../controllers/posts_controller');
const passport = require('passport');

router.post('/create',passport.checkAuthentication,postsController.create);
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);

module.exports =router;