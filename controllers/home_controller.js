const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
    try {
        const posts = await Post.find({})
            .sort('-createdAt')
            .populate('user', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'name' }
            });

        const all_users = await User.find({});
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            user: req.user,
            all_users: all_users,
            style: '/css/home.css', // Full path to the CSS file
            script: '/js/home-posts.js' // Add this line to pass the script variable
        });
    } catch (err) {
        console.log('Error in fetching posts:', err);
        return res.redirect('back');
    }
};
