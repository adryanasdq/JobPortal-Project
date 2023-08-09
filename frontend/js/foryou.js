function createJobCard(jobData) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-left">
            <img src="${jobData.logo_url}" alt="">
        </div>
        <div class="card-center">
            <h3>${jobData.company}</h3>
            <p class="card-detail">${jobData.position}</p>
            <p class="card-loc"><ion-icon name="location-outline"></ion-icon>${jobData.location}</p>
            <div class="card-sub">
                <p><ion-icon name="today-outline"></ion-icon>${jobData.expired_on}</p>
                <p><ion-icon name="hourglass-outline"></ion-icon>Full Time</p>
                <p><ion-icon name="people-outline"></ion-icon>200 applicants</p>
            </div>
        </div>
        <div class="card-right">
            <div class="card-salary">
                <p><b>Rp. ${jobData.salary}</b> <span>/ month</span></p>
            </div>
        </div>
    `;
    return card;
}


async function getJobs(e) {
    e.preventDefault()

    const url = 'http://127.0.0.1:5000/jobseeker/jobs';
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

    const jobContainer = document.querySelector('.wrapper');
    jobContainer.innerHTML = '';

    const response = await fetch(url, requestOptions);
    const result = await response.json();

    if (result.data && result.data.length > 0) {
        for (let job of result.data) {
            const jobCard = createJobCard(job);
            jobContainer.appendChild(jobCard)
        };
    } else {
        noFoundMessage = document.createElement('p');
        noFoundMessage.innerHTML = jsonResp.message;
        jobContainer.appendChild(noFoundMessage);
    }
}

document.addEventListener('DOMContentLoaded', getJobs)