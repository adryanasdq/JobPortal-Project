// Transition between login and signup form
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
const signupForm = document.querySelector("form.signup");

signupBtn.onclick = (() => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});

loginBtn.onclick = (() => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});

signupLink.onclick = (() => {
    signupBtn.click();
    return false;
});


// Create a function to login and signup
async function login(e) {
    e.preventDefault()

    const username = loginForm.querySelector(".username").value;
    const password = loginForm.querySelector(".password").value;
    const token = btoa(username + ":" + password);
    const myHeaders = {
        "Authorization": "Basic" + " " + token,
        "Content-type": "application/json; charset=UTF-8"
    };

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
    };

    const response = await fetch('http://127.0.0.1:5000/login', requestOptions);
    const result = await response.json();

    try {
        const userStringId = result.id.toString();
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("id", result.id);
        localStorage.setItem("name", result.name);
        if (userStringId[0] === '1') {
            window.location.href = "home-company.html";
        } else {
            window.location.href = "home-jobseeker.html"
        };
    } catch {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: result.message,
          });
    }
}


async function signup(e) {
    e.preventDefault()
    
    const role = signupForm.querySelector(".role").value;
    const name = signupForm.querySelector(".name").value;
    const email = signupForm.querySelector(".email").value;
    const username = signupForm.querySelector(".username").value;
    const password = signupForm.querySelector(".password").value;
    const confirmPassword = signupForm.querySelector(".confirm-password").value;
    
    const newUser = {
        "role": role,
        "name": name,
        "email": email,
        "username": username,
        "password": password,
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(newUser),
    };

    if (password === confirmPassword) {
        const response = await fetch("http://127.0.0.1:5000/register", requestOptions);
        const result = await response.json();
    
        if (result.status === "Success!") {
            signupForm.reset();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: result.message,
              });
        } else {
            Swal.fire({
                icon: 'error',
                title: result.status,
                text: result.message,
              })
        }; 
    } else {
        Swal.fire({
            icon: "error",
            title: "Password is not matched!",
            text: "Confirmation password does not match the original password",
        })
    };
    
}

loginForm.addEventListener("submit", login);
signupForm.addEventListener("submit", signup);