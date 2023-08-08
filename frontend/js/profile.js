function createJobCard(jobData) {
    const card = document.createElement("div");
    card.className = "user-section";
    card.innerHTML = `
        <div class="user-header">
            <img src="./${jobData.url_pict}" alt="Profile Image" class="profile-img">
            <div class="user-info">
                <h2 class="user-name">${jobData.first_name}</h2>
                <p class="user-role">Jobseeker</p>
            </div>
        </div>
        <div class="profile-details">
            <h3>Profile Details</h3>
            <p><strong>Name:</strong> ${jobData.first_name}</p>
            <p><strong>Age:</strong> ${jobData.age}</p>
            <p><strong>Gender:</strong> ${jobData.gender}</p>
            <p><strong>Education:</strong> ${jobData.education}/p>
            <p><strong>Major:</strong> ${jobData.major}</p>
            <p><strong>Contact:</strong> ${jobData.contact}</p>
            <p><strong>Address:</strong> ${jobData.address}</p>
            <p><strong>Summary:</strong> ${jobData.summary}</p>
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
    profileContainer.appendChild(profileCard);
}

document.addEventListener("DOMContentLoaded", getProfile);