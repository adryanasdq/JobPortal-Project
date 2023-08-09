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
                <p><ion-icon name="today-outline"></ion-icon>${jobData.posted_on}</p>
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

	const position = document.querySelector('.job-position').value;
	const major = document.querySelector('.job-major').value;
	const salary = document.querySelector('.job-salary').value;
	const location = document.querySelector('.job-location').value;
	
	let url = 'http://127.0.0.1:5000/search/jobs?';
	
	if (position) {
		url += `position=${position}`
	};
	if (salary) {
		url += `&salary=${salary}`
	};
	if (location) {
		url += `&location=${location}`
	};

	const jobContainer = document.querySelector('.wrapper');
	jobContainer.innerHTML = '';

	const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	}

	const response = await fetch(url, requestOptions);
	const result = await response.json();
	if (result.response && result.response.length > 0) {
		for (let job of result.response) {
			const jobCard = createJobCard(job);
			jobContainer.appendChild(jobCard)
		}
	} else {
		noFoundMessage = document.createElement('p');
		noFoundMessage.innerHTML = jsonResp.message;
		jobContainer.appendChild(noFoundMessage);
	};
};

const filterSearch = document.querySelector("form.search");

filterSearch.addEventListener("submit", getJobs)
document.addEventListener("DOMContentLoaded", getJobs)