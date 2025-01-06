const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// Tell passport to use a new strategy for Google login
passport.use(new GoogleStrategy({
    clientID: "459633600797-hd1rh95gmbi8si0s2lci0pg8q4up2a1p.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8001/users/auth/google/callback",
}, async function(accessToken, refreshToken, profile, done) {
    try {
        // Find a user
        let user = await User.findOne({ email: profile.emails[0].value });
        
        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user) {
            // If found, set this user as req.user
            return done(null, user);
        } else {
            // If not found, create the user and set it as req.user
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });

            return done(null, user);
        }
    } catch (err) {
        console.log('Error in Google strategy-passport:', err);
        return done(err, null);
    }
}));

module.exports = passport;
