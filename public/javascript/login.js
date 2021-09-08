const createAccount = async (e) => {
    try { e.preventDefault();
    
        const username = document.querySelector('#username-signup').value.trim();
        const email = document.querySelector('#email-signup').value.trim();
        const password = document.querySelector('#password-signup').value.trim();
    
        if(username && password && email) {
            const response = await fetch('/api/users', {
                method: 'post',
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
                headers: { 'Content-Type': 'application/json' }
            })

            if(response.ok) {
                document.location.replace('/dashboard');
            } else {
                alert(response.statusText)
            }
        }        
    } catch (error) {
        console.log(error);

    }
}

const loginHandler = async (e) => {
    try { e.preventDefault();

        const email = document.querySelector('#email-login').value.trim();
        const password = document.querySelector('#password-login').value.trim();
      
        if (email && password) {
          const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
              email,
              password
            }),
            headers: { 'Content-Type': 'application/json' }
          });
      
          if (response.ok) {
            document.location.replace('/dashboard');
          } else {
            alert(response.statusText);
          }
        }
    } catch (error) {
        console.log(error)
    }
}

document.querySelector('.signup-form').addEventListener('submit', createAccount);
document.querySelector('.login-form').addEventListener('submit', loginHandler);