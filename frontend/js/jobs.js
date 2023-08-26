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

	const userId = localStorage.getItem("id");
	const isLoggedIn = localStorage.getItem("isLoggedIn");

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
	};

	const jobContainer = document.querySelector(".wrapper");
	jobContainer.innerHTML = "";

	const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"id": userId,
			"isLoggedIn": isLoggedIn,
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
		
		// Show detail first vacancy
		getJobDetails(data[0].id)
		
		data.forEach((job) => {
			const jobCard = createJobCard(job);
			jobContainer.appendChild(jobCard)
		});

	} else {
		const noFoundMessage = document.createElement("p");
		noFoundMessage.innerHTML = result.message;
		jobContainer.appendChild(noFoundMessage);

		const rightSect = document.querySelector(".detail");
		rightSect.innerHTML = "No preview available";
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

	logo.src = data.company_logo;
	company.innerHTML = data.company_name;
	position.innerHTML = data.position;
	about_company.innerHTML = data.company_about;
	job_desc.innerHTML = data.description;
	qualification.innerHTML = data.requirements;

	// Modal
	const openModalBtn = document.querySelectorAll(".btn-apply");
	const saveBtn = document.querySelector(".btn-save");
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

	submitCoverLetterBtn.onclick = () => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger'
			},
		});

		swalWithBootstrapButtons.fire({
			title: 'Apply this job?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Send!',
			cancelButtonText: 'Wait...',
		}).then((result) => {
			if (result.isConfirmed) {
				applyJob(id)
			}
		})
	};
	saveBtn.onclick = () => toggleSaveJob(id);
}

async function applyJob(id) {
	const userId = localStorage.getItem("id");
	const isLoggedIn = localStorage.getItem("isLoggedIn");

	const coverLetterText = document.getElementById("coverLetterText").value;
	const coverLetterModal = document.getElementById("coverLetterModal");
	const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
		"isLoggedIn": isLoggedIn,
	};

	const data = {
		"job_id": id,
		"cover_letter": coverLetterText,
		"status": "applied",
	};

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: JSON.stringify(data),
	};

	const response = await fetch("http://127.0.0.1:5000/application", requestOptions);
	const result = await response.json();

	if (result.status === "Success!") {
		Swal.fire({
			icon: 'success',
			title: 'Success!',
			text: result.message,
		});
		coverLetterModal.style.display = "none";
	} else {
		Swal.fire({
			icon: 'error',
			title: result.status,
			text: result.message,
		})
	};
};

async function toggleSaveJob(id) {
	const userId = localStorage.getItem("id");
	const isLoggedIn = localStorage.getItem("isLoggedIn");
	const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
		"isLoggedIn": isLoggedIn,
	};

	const requestOptions = {
		method: "GET",
		headers: myHeaders,
	};

	const response = await fetch(`http://127.0.0.1:5000/application`, requestOptions);
	const result = await response.json();
	const isSaved = result.data.find(app => app.job_id == id && app.jobseeker_id == userId && app.status === "saved");

	if (isSaved) {
		const deleteResponse = await deleteSavedJob(isSaved.id);
		const deleteResult = await deleteResponse.json();

		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 2500,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer)
				toast.addEventListener("mouseleave", Swal.resumeTimer)
			}
		});

		Toast.fire({
			icon: "success",
			title: deleteResult.message,
		});

	} else {
		saveJob(id);

		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.addEventListener("mouseenter", Swal.stopTimer)
				toast.addEventListener("mouseleave", Swal.resumeTimer)
			}
		})

		Toast.fire({
			icon: "success",
			title: "Job saved!"
		})
	}

}

async function saveJob(id) {
	const userId = localStorage.getItem("id");
	const isLoggedIn = localStorage.getItem("isLoggedIn");
	const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
		"isLoggedIn": isLoggedIn,
	};

	const data = {
		"job_id": id,
		"status": "saved"
	};

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: JSON.stringify(data),
	}

	const response = await fetch("http://127.0.0.1:5000/savedjob", requestOptions);
	return response;
};

async function deleteSavedJob(id) {
	const userId = localStorage.getItem("id");
	const isLoggedIn = localStorage.getItem("isLoggedIn");
	const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
		"isLoggedIn": isLoggedIn,
	};

	const requestOptions = {
		method: "DELETE",
		headers: myHeaders,
	};

	const response = await fetch(`http://127.0.0.1:5000/application/${id}`, requestOptions);
	return response;
};