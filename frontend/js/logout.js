const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', logout);

function logout(event) {
    event.preventDefault()

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = 'index.html'
}