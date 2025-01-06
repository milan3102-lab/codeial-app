const express = require('express');
const router = express.Router();
const passport = require('passport');
const commentsController = require('../controllers/comments_controller');

// Ensure the user is authenticated before allowing them to comment
router.post('/create', passport.checkAuthentication, commentsController.create);
router.get('/destroy/:id', passport.checkAuthentication,commentsController.destroy);

module.exports = router;
