const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer=require('../mailers/comments_mailer')

// Create a new comment
module.exports.create = async function(req, res) {
    try {
        const postId = req.body.postId;
        const content = req.body.content;

        // Create a new comment
        const comment = await Comment.create({
            content: content,
            user: req.user._id, // Ensure user is logged in
            post: postId
        });

        // Add comment to the post
        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
        commentsMailer.newComment(comment);
        // Redirect to home or where you want after comment creation
        return res.redirect('back'); // Redirects back to the previous page
    } catch (err) {
        console.error(err);
        return res.redirect('back'); // Handle error and redirect back
    }
};

// Delete a comment
module.exports.destroy = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        console.log(comment); // Check if comment is retrieved correctly
        const postId = comment ? comment.post : null;

        if (comment && (comment.user.equals(req.user.id) || (await Post.findById(postId)).user.equals(req.user.id))) {
            await Comment.deleteOne({ _id: comment._id }); // Ensure this is being used

            const post = await Post.findById(postId);
            post.comments.pull(comment._id);
            await post.save();

            req.flash('success', 'Comment deleted successfully');
        } else {
            req.flash('error', 'You cannot delete this comment');
        }
        return res.redirect(req.get("Referrer") || "/");
    } catch (err) {
        console.log(err);
        req.flash('error', 'Error deleting comment');
        return res.redirect(req.get("Referrer") || "/");
    }
};
