const user = document.getElementById("user");
const active_user = localStorage.getItem("name");
user.innerHTML = active_user[0].toUpperCase() + active_user.substring(1);