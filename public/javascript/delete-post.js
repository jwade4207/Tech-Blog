const deletePost = async (e) => {
    try { e.preventDefault();
  
        const id = window.location.toString().split('/')[
          window.location.toString().split('/').length - 1
        ];
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE'
        });
      
        if (response.ok) {
          document.location.replace('/dashboard/');
        } else {
          alert(response.statusText);
        }
    } catch (error) {
        console.log(error)
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deletePost);