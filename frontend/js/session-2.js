async function getProfilePict(e) {
    e.preventDefault()

    const pict = document.querySelector(".profile-img");
    const user = document.getElementById("user");
    const active_user = localStorage.getItem("name");
    
    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    const myHeaders = {
        "Content-type": "application/json; charset=UTF-8",
        "id": userId,
        "isLoggedIn": isLoggedIn,
    };
    
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };
    
    const response = await fetch(`http://127.0.0.1:5000/company/${userId}`, requestOptions);
    const result = await response.json();
    const data = result.response;
    
    pict.src = data.logo_url;
    user.innerHTML = active_user[0].toUpperCase() + active_user.substring(1);
}

document.addEventListener("DOMContentLoaded", getProfilePict);