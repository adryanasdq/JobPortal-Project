const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', logout);

function logout(e) {
    e.preventDefault();

    Swal.fire({
        title: 'Logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            localStorage.removeItem("name");
            localStorage.removeItem("password");
            localStorage.removeItem("id");
            window.location.href = 'landing.html';
        }
    })
}