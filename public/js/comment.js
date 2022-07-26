const commentFormHandler = async function(event) {
  event.preventDefault();

  //console.log('>>>>>>>>>> comment submitted')

  //const postId = document.querySelector('input[name="post-id"]').value;
  const postId = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1];
  const commentBody = document.querySelector('#comment-body').value;

  // confirm capture of comment and post_id
  console.log('>>>>>>>>>>>>>', commentBody, postId);

  if (commentBody) {
    await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        postId,
        commentBody
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    document.location.reload();
  }
};

document
  .querySelector('#new-comment-form')
  .addEventListener('submit', commentFormHandler);
