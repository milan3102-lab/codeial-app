$(document).ready(function () {
    // Handle new post submission
    $('#new-post-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: $(this).serialize(), // Serialize form data
            success: function (data) {
                // Append the new post to the posts list
                $('#posts-list-container ul').prepend(data); // Use prepend to show the latest post first
                $('#new-post-form textarea').val(''); // Clear the textarea after submission
            },
            error: function (error) {
                console.log(error); // Log error for debugging
            }
        });
    });

    // Handle new comment submission
    $('.comment-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        const $form = $(this); // Reference to the comment form
        const actionUrl = $form.attr('action');

        $.ajax({
            type: 'POST',
            url: actionUrl,
            data: $form.serialize(), // Serialize form data
            success: function (data) {
                // Append the new comment to the respective post
                const commentsList = $form.closest('li').find('.comments-list');
                commentsList.append(data); // Append new comment
                $form.find('textarea').val(''); // Clear the textarea after submission
            },
            error: function (error) {
                console.log(error); // Log error for debugging
            }
        });
    });
});
