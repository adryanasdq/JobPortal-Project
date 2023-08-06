let formLogin = document.getElementById('login-form')
formLogin.addEventListener('submit', signIn)

function signIn(event) {
    event.preventDefault()

    let username = formLogin.querySelector('.username').value;
    let password = formLogin.querySelector('.password').value;
    let token = btoa(username + ":" + password);
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic' + ' ' + token)
    myHeaders.append('Content-type', 'application/json; charset=UTF-8')

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
    }

    // statusbox

    fetch('http://127.0.0.1:5000/login', requestOptions)
        .then((response) => {
            if (response.ok === false) {
                throw new Error('failed')
            } else {
                return response.text()
            }
        })
        .then((txtResp) => {
            if (txtResp[0] === '1') {
                alert('Company')
            } else {
                alert('JobSeeker')
            }
        })
        .catch((error) => {
            console.error('Error:', error.message)
        })
}