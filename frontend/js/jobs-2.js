function createJobCard(jobData) {
	const postedDate = new Date(jobData.posted_on);
	const oneDay = 1000 * 60 * 60 * 24;
	const countDays = Math.round((new Date().getTime() - postedDate.getTime()) / oneDay);

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
                <p><ion-icon name="today-outline"></ion-icon>${countDays} day(s) ago</p>
                <p><ion-icon name="hourglass-outline"></ion-icon>${jobData.job_type}</p>
                <p><ion-icon name="school-outline"></ion-icon>${jobData.major}</p>
            </div>
        </div>
        <div class="card-right">
            <div class="card-salary">
                <p><b>Rp. ${jobData.salary.toLocaleString("id")}</b> <span>/ month</span></p>
            </div>
        </div>
    `;
	card.onclick = () => getJobDetails(jobData.id);
	return card;
}


async function getJobs(e) {
	e.preventDefault()

	const position = document.querySelector(".job-position").value;
	const major = document.querySelector(".job-major").value;
	const salary = document.querySelector(".job-salary").value;
	const location = document.querySelector(".job-location").value;
	const jobType = document.getElementById("job-type").value;
	const sortby = document.querySelector(".sort-by").value;

	let url = "http://127.0.0.1:5000/search/jobs?";

	if (position) {
		url += `position=${position}`
	};
	if (major) {
		url += `&major=${major}`
	};
	if (salary) {
		url += `&salary=${salary}`
	};
	if (location) {
		url += `&location=${location}`
	};
	if (jobType) {
		url += `&job_type=${jobType}`
	}

	const jobContainer = document.querySelector(".wrapper");
	jobContainer.innerHTML = "";

	const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	}

	const response = await fetch(url, requestOptions);
	const result = await response.json();
	const data = result.response;
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
			jobContainer.appendChild(jobCard)
		});

	} else {
		const noFoundMessage = document.createElement("p");
		noFoundMessage.innerHTML = result.message;
		jobContainer.appendChild(noFoundMessage);
	};
};

const filterSearch = document.querySelector("form.search");
const sorter = document.querySelector(".sort-by");

filterSearch.addEventListener("submit", getJobs);
sorter.addEventListener("change", getJobs);
document.addEventListener("DOMContentLoaded", getJobs);


async function getJobDetails(id) {
	const logo = document.querySelector(".detail-header > img");
	const company = document.querySelector(".detail-header > h2");
	const position = document.querySelector(".detail-header > p");
	const about_company = document.querySelector(".about > p");
	const job_desc = document.querySelector(".description > p");
	const qualification = document.querySelector(".qualification > ul > li");

	const response = await fetch(`http://127.0.0.1:5000/jobs/${id}`);
	const result = await response.json();
	const data = result.data;

	const detail = document.querySelector(".detail");
	detail.removeAttribute("hidden")

	logo.src = data.company_logo;
	company.innerHTML = data.company_name;
	position.innerHTML = data.position;
	about_company.innerHTML = data.company_about;
	job_desc.innerHTML = data.description;
	qualification.innerHTML = data.requirements;
}