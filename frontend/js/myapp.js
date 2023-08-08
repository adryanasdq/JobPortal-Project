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
                <p><ion-icon name="today-outline"></ion-icon>${jobData.status}</p>
                <p><ion-icon name="hourglass-outline"></ion-icon>Full Time</p>
                <p><ion-icon name="people-outline"></ion-icon>200 applicants</p>
            </div>
        </div>
        <div class="card-right">
            <div class="card-salary">
                <p><b>${jobData.note}</b></span></p>
            </div>
        </div>
    `;
    return card;
}

document.addEventListener('DOMContentLoaded', getApps)


function getApps(e) {
    e.preventDefault()

    let url = 'http://127.0.0.1:5000/application';

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

    fetch(url, requestOptions)
        .then((response) => response.json())
        .then((jsonResp) => {
            if (jsonResp.data && jsonResp.data.length > 0) {
                for (let job of jsonResp.data) {
                    const jobCard = createJobCard(job);
                    jobContainer.appendChild(jobCard)
                }
            } else {
                noFoundMessage = document.createElement('p');
                noFoundMessage.innerHTML = jsonResp.message;
                jobContainer.appendChild(noFoundMessage);
            }
        })
        .catch((error) => { console.error(error) });
}