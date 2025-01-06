const Post = require('../models/post');
const Comment = require('../models/comment');

// Create a new post
module.exports.create = async function (req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id // Associate post with the current user
        });

        // Return the new post as HTML
        return res.status(200).send(`<li>
            <%- include('_post', { post: post, user: req.user }) %>
            <ul class="comments-list">
                <!-- Comments will be appended here -->
            </ul>
        </li>`);
    } catch (err) {
        console.log(err);
        req.flash('error', 'Error creating post');
        return res.redirect('back'); // Redirect back on error
    }
};

// Get all posts with populated user and comments
module.exports.index = async function (req, res) {
    try {
        const posts = await Post.find({})
            .populate('user', 'name') // Populate user information
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name' // Populate comment user information
                }
            });

        return res.render('home', {
            title: 'Home',
            posts: posts // Render posts in the home view
        });
    } catch (err) {
        console.log(err);
        req.flash('error', 'Error fetching posts');
        return res.redirect('back'); // Redirect back on error
    }
};

// Delete a post
module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post); // Check if post is retrieved correctly

        if (post && post.user.equals(req.user.id)) {
            await Post.deleteOne({ _id: post._id }); // Ensure this is being used
            req.flash('success', 'Post deleted successfully');
        } else {
            req.flash('error', 'You cannot delete this post');
        }
        return res.redirect(req.get("Referrer") || "/");
    } catch (err) {
        console.log(err);
        req.flash('error', 'Error deleting post');
        return res.redirect(req.get("Referrer") || "/");
    }
};

