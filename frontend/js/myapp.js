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

    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const sortby = document.querySelector(".sort-by").value;
    const myHeaders = {
        "Content-type": "application/json; charset=UTF-8",
        "id": userId,
        "isLoggedIn": isLoggedIn,
    };

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const appContainer = document.querySelector('.wrapper');
    appContainer.innerHTML = '';

    const response = await fetch("http://127.0.0.1:5000/application", requestOptions);
    const result = await response.json();
    const data = result.data;
    if (data && data.length > 0) {
		if (sortby === "newest") {
			data.sort((a, b) => {
				return b.id - a.id
			});
		} else if (sortby === "oldest") {
			data.sort((a, b) => {
				return a.id - b.id
			});
		} else if (sortby === "highpaid") {
			data.sort((a, b) => {
				return b.salary - a.salary
			});
		} else if (sortby === "lowpaid") {
			data.sort((a, b) => {
				return a.salary - b.salary
			});
		};

		data.forEach((job) => {
			const jobCard = createJobCard(job);
			appContainer.appendChild(jobCard)
		});

	} else {
		const noFoundMessage = document.createElement("p");
		noFoundMessage.innerHTML = "Wow, such empty! are you new? try apply for a job!";
		appContainer.appendChild(noFoundMessage);
	};
};

async function getAppDetails(id) {
    const logo = document.querySelector('.detail-header > img');
    const company = document.querySelector('.detail-header > h2');
    const position = document.querySelector('.detail-header > p');
    const about_company = document.querySelector('.about > p');
    const cover_letter = document.querySelector('.description > p');

    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const url = `http://127.0.0.1:5000/application/${id}`;
    const myHeaders = {
        "Content-type": "application/json; charset=UTF-8",
        "id": userId,
        "isLoggedIn": isLoggedIn,
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

const sorter = document.querySelector(".sort-by");
sorter.addEventListener("change", getApps);