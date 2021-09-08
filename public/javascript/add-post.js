const addNewPost = async (e) => {
    try { e.preventDefault();
    
        const title = document.querySelector('input[name="post-title"]').value;
        const content = document.querySelector('input[name="content"]').value;
    
        const response = await fetch('/api/posts', {
            method: 'post',
            body: JSON.stringify({
                title,
                content
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if(response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    } catch (error) {
        console.log(error)
    }
}

document.querySelector('.new-post-form').addEventListener('submit', addNewPost);