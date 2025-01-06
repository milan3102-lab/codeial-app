const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

// Authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback:true
},
async function(req,email, password, done) {
    try {
        // Find a user and establish the identity
        const user = await User.findOne({ email: email });
        if (!user || user.password !== password) {
            req.flash('error','Invalid Username/Password');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        req.flash('error',err);
        return done(err);
    }
}));

// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserializing the user from the key in cookies
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(new Error('User not found'));
        }
        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> Passport');
        return done(err);
    }
});

// Check if user is authenticated
passport.checkAuthentication = function(req, res, next) {
    // If the user is signed in, pass on the request to the next function (controller's action)
    if (req.isAuthenticated()) {
        return next();
    }

    // If the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        // Attach the current signed-in user to res.locals
        res.locals.user = req.user; // Use req.user which is set by Passport
    } else {
        res.locals.user = null; // Set user to null if not authenticated
    }
    next();
};


module.exports = passport;
