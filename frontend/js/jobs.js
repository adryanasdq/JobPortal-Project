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
                <p><ion-icon name="hourglass-outline"></ion-icon>Full Time</p>
                <p><ion-icon name="people-outline"></ion-icon>200 applicants</p>
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

	let url = "http://127.0.0.1:5000/search/jobs?";

	if (position) {
		url += `position=${position}`
	};
	if (salary) {
		url += `&salary=${salary}`
	};
	if (location) {
		url += `&location=${location}`
	};

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
	if (result.response && result.response.length > 0) {
		for (let job of result.response) {
			const jobCard = createJobCard(job);
			jobContainer.appendChild(jobCard)
		}
	} else {
		noFoundMessage = document.createElement("p");
		noFoundMessage.innerHTML = result.message;
		jobContainer.appendChild(noFoundMessage);
	};
};

const filterSearch = document.querySelector("form.search");

filterSearch.addEventListener("submit", getJobs)
document.addEventListener("DOMContentLoaded", getJobs)


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

	// Modal
	const openModalBtn = document.querySelectorAll(".btn-apply");
	const closeModalBtn = document.getElementById("closeModalBtn");
	const coverLetterModal = document.getElementById("coverLetterModal");
	const submitCoverLetterBtn = document.getElementById("submitCoverLetterBtn");
	const toCompany = document.getElementById("to-company");
	const toPosition = document.getElementById("to-position");

	openModalBtn.forEach(button => {
		button.addEventListener("click", () => {
			coverLetterModal.style.display = "block";
			toCompany.innerHTML = data.company_name;
			toPosition.innerHTML = data.position;
		});
	});

	closeModalBtn.addEventListener("click", () => {
		coverLetterModal.style.display = "none";
	});

	submitCoverLetterBtn.addEventListener("click", applyJob(id));
}

async function applyJob(id) {
	const username = atob(localStorage.getItem("username"));
    const password = atob(localStorage.getItem("password"));
    const token = btoa(username + ":" + password);
	const coverLetterText = document.getElementById("coverLetterText").value;
	const coverLetterModal = document.getElementById("coverLetterModal");
	const myHeaders = {
        "Authorization": "Basic" + " " + token,
        "Content-type": "application/json; charset=UTF-8"
    };

	const data = {
		"job_id": id,
		"cover_letter": coverLetterText,
	};

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: JSON.stringify(data),
	}

	const response = await fetch("http://127.0.0.1:5000/application", requestOptions);
	const result = await response.json();
	if (result.status === "Success!") {
		signupForm.reset();
		Swal.fire({
			icon: 'success',
			title: 'Success!',
			text: result.message,
		});
		coverLetterModal.style.display = "none";
	};
};