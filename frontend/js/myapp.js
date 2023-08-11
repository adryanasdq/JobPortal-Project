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
                <p><ion-icon name="hourglass-outline"></ion-icon>Full Time</p>
                <p><ion-icon name="cash-outline"></ion-icon>Rp. ${jobData.salary.toLocaleString('id')} /month</p>
            </div>
        </div>
        <div class="card-right">
            <div class="card-salary">
                <p>${jobData.status}</p>
            </div>
        </div>
    `;
    card.onclick = () => getAppDetails(jobData.id);
    return card;
}

document.addEventListener('DOMContentLoaded', getApps)


async function getApps(e) {
    e.preventDefault()

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

    const appContainer = document.querySelector('.wrapper');
    appContainer.innerHTML = '';

    const response = await fetch("http://127.0.0.1:5000/application", requestOptions);
    const result = await response.json();
    for (const app of result.data) {
        const appCard = createJobCard(app);
        appContainer.appendChild(appCard);
    };
};

async function getAppDetails(id) {
    const logo = document.querySelector('.detail-header > img');
    const company = document.querySelector('.detail-header > h2');
    const position = document.querySelector('.detail-header > p');
    const about_company = document.querySelector('.about > p');
    const cover_letter = document.querySelector('.description > p');

    const username = atob(localStorage.getItem("username"));
    const password = atob(localStorage.getItem("password"));
    const token = btoa(username + ":" + password);
    const url = `http://127.0.0.1:5000/application/${id}`;
    const myHeaders = {
        "Authorization": "Basic" + " " + token,
        "Content-type": "application/json; charset=UTF-8"
    };

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    const data = result.data;

    const detail = document.querySelector('.detail');
    detail.removeAttribute('hidden')

    logo.src = data.logo_url;
    company.innerHTML = data.company_name;
    position.innerHTML = data.job_position;
    about_company.innerHTML = data.note;
    cover_letter.innerHTML = data.cover_letter;
}