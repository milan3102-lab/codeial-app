const User = require("../models/user");
const fs=require('fs');
const path=require('path');


module.exports.profile = async function(req, res) {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.redirect('back');
            }
            return res.render('user_profile', {
                title: "Profile",
                profile_user: user
            });
        } catch (err) {
            console.log('Error in fetching user profile:', err);
            return res.redirect('back');
        }
    } else {
        return res.redirect('/users/sign-in');
    }
}

module.exports.update = async function(req, res) {
    try {
        if (req.user.id === req.params.id) {
            // Use multer to handle file upload
            User.uploadedAvatar(req, res, async function(err) {
                if (err) {
                    console.log('****** Multer Error:', err);
                    return res.redirect('back');
                }

                // Find the user by ID
                const user = await User.findById(req.params.id);
                if (!user) {
                    console.error('User not found');
                    return res.redirect('back');
                }

                // Update the user's information
                user.name = req.body.name || user.name;  // Fallback to current value if undefined
                user.email = req.body.email || user.email;

                if (req.file) {

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    // Save the uploaded file's path to the avatar field
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                await user.save();  // Save the user document
                return res.redirect('back');
            });
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.error('Error updating user:', err);
        return res.redirect('back');
    }
};



// Render the sign-up page
module.exports.signUp = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect(`/users/profile/${req.user._id}`);
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

// Render the sign-in page
module.exports.signIn = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect(`/users/profile/${req.user._id}`);
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

// Get sign-up data
module.exports.create = async function(req, res) {
    if (req.body.password !== req.body.confirm_password) {
        return res.redirect('back');
    }

    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in finding or creating user:', err);
        return res.redirect('back');
    }
}

// Sign in and create a session for user
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged In Successfully'); // Lowercase 'success'
    return res.redirect(`/users/profile/${req.user._id}`);
};

// Sign out and clear the user session
module.exports.signOut = function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Logged Out Successfully'); // Lowercase 'success'
        return res.redirect('/users/sign-in');
    });
};
