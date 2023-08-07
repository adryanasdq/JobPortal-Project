let formLogin = document.getElementById('login-form')
formLogin.addEventListener('submit', login)

function login(event) {
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
            if (!response.ok) {
                throw new Error('Login failed! check username or password')
            } else {
                return response.json()
            }
        })
        .then((jsonResp) => {
            if (jsonResp.id.toString()[0] === '1') {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("username", jsonResp.username)
                window.location.href = 'home-company.html'
            } else {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("username", jsonResp.username)
                window.location.href = 'home-jobseeker.html'
            }
        })
        .catch((error) => {
            alert(error.message)
        })
}