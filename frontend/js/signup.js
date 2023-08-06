let formSignUp = document.getElementById('signup-form');
formSignUp.addEventListener('submit', signUp)

function signUp(event) {
    event.preventDefault()

    let role = formSignUp.querySelector('.select-role').value;
    let name = formSignUp.querySelector('.name').value;
    let email = formSignUp.querySelector('.email').value;
    let username = formSignUp.querySelector('.username').value;
    let password = formSignUp.querySelector('.password').value;
    let contact = formSignUp.querySelector('.contact').value;
    let address = formSignUp.querySelector('.address').value;

    let requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "role": role,
            "name": name,
            "email": email,
            "username": username,
            "password": password,
            "contact": contact,
            "address": address,
        })
    }

    fetch('http://127.0.0.1:5000/register', requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('failed')
            } else {
                return response.json()
            }
        })
        .then((jsonResp) => {
            console.log(jsonResp)
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            if (error.message === 'failed') {
                alert('Username or Email is already exist!')
            }
        });
}