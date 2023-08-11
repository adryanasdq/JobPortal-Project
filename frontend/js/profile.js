function createJobCard(jobData) {
    const full_name = jobData.first_name + ' ' + jobData.last_name;
    const words = full_name.split(' ');

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    };

    const capped_name = words.join(' ');

    const card = document.createElement("div");
    card.className = "user-section";
    card.innerHTML = `
        <div class="user-header">
            <img src="${jobData.url_pict}" alt="Profile Image" class="profile-img">
            <div class="user-info">
                <h2 class="user-name">${capped_name}</h2>
                <p class="user-role">Jobseeker</p>
            </div>
        </div>
        <div class="profile-details">
            <h3>About</h3>
            <p><strong>Summary:</strong> ${jobData.summary}</p>
            <p><strong>Age:</strong> ${jobData.age}</p>
            <p><strong>Gender:</strong> ${jobData.gender}</p>
            <p><strong>Education:</strong> ${jobData.education}</p>
            <p><strong>Major:</strong> ${jobData.major}</p>
            <p><strong>Contact:</strong> ${jobData.contact}</p>
            <p><strong>Address:</strong> ${jobData.address}</p>
        </div>
    `;
    return card;
}

async function getProfile(e) {
    e.preventDefault()

    const user_id = localStorage.getItem("id");
    const username = atob(localStorage.getItem("username"));
    const password = atob(localStorage.getItem("password"));
    const token = btoa(username + ":" + password);
    const myHeaders = {
        "Authorization": "Basic" + " " + token,
        "Content-type": "application/json; charset=UTF-8"
    };

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const profileContainer = document.querySelector(".user-section");
    profileContainer.innerHTML = '';

    const response = await fetch(`http://127.0.0.1:5000/jobseeker/${user_id}`, requestOptions);
    const result = await response.json();
    const profileCard = createJobCard(result.response);
    console.log(result.response);
    profileContainer.appendChild(profileCard);
}

document.addEventListener("DOMContentLoaded", getProfile);