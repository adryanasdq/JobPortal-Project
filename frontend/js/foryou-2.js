function createJobCard(jobData) {
	const postedDate = new Date(jobData.posted_on);
	const oneDay = 1000 * 60 * 60 * 24;
	const countDays = Math.round((new Date().getTime() - postedDate.getTime()) / oneDay);

	const card = document.createElement("div");
	card.className = "job";
	card.innerHTML = `
		<h3>${jobData.position}</h3>
		<p><ion-icon name="location-outline"></ion-icon>${jobData.location}</p>
		<div class="card-sub">
			<p><ion-icon name="today-outline"></ion-icon>${countDays} day(s) ago</p>
			<p><ion-icon name="hourglass-outline"></ion-icon>${jobData.job_type}</p>
			<p><ion-icon name="school-outline"></ion-icon>${jobData.major}</p>
		</div>
		<p class="salary"><b>Rp. ${jobData.salary.toLocaleString("id")}</b> <span>/ month</span></p>
    `;
	card.onclick = () => getJobDetails(jobData.id);
	return card;
};


async function getCompanyJobs(e) {
	e.preventDefault()

	const url = "http://127.0.0.1:5000/company/jobs";
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

	const jobContainer = document.getElementById("company-job");
	jobContainer.innerHTML = "";

	if (userId == null) {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "Please login first",
			confirmButtonText: "Yes",
		}).then((result) => {
			if (result.isConfirmed) {
				window.location.href = "landing.html"
			}
		});
	} else {
		const response = await fetch(url, requestOptions);
		const result = await response.json();
		const data = result.data;

		getJobDetails(data[0].id)

		data.forEach((job) => {
			if (new Date(job.expired_on) < new Date()) {
				job.position += " (Expired)"
			};
		});

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
			})
		} else {
			const noFoundMessage = document.createElement("p");
			noFoundMessage.innerHTML = "No vacancy posted.";
			jobContainer.appendChild(noFoundMessage);
		};
	};

	// Modal
	const openModalBtn = document.querySelectorAll(".btn-post");
	const closeModalBtn = document.getElementById("closeModal1");
	const postJobModal = document.getElementById("postJobModal");
	const submitPost = document.getElementById("submitPost");

	openModalBtn.forEach(button => {
		button.addEventListener("click", () => {
			postJobModal.style.display = "block";
		});
	});

	closeModalBtn.addEventListener("click", () => {
		postJobModal.style.display = "none";
	});

	submitPost.onclick = () => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger'
			},
		});

		swalWithBootstrapButtons.fire({
			title: 'Post this job?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Post!',
			cancelButtonText: 'Wait...',
		}).then((result) => {
			if (result.isConfirmed) {
				postJob()
			};
		})
	};
};

const sorter = document.querySelector(".sort-by");

sorter.addEventListener("change", getCompanyJobs);
document.addEventListener("DOMContentLoaded", getCompanyJobs);


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
	const openModalBtn = document.querySelectorAll("#btn-edit");
	const closeModalBtn = document.getElementById("closeModal2");
	const editJobModal = document.getElementById("editJobModal");
	const submitEdit = document.getElementById("submitEdit");

	const jobPosition = document.getElementById("job-position2");
	const jobLocation = document.getElementById("job-location2");
	const jobType = document.getElementById("job-type2");
	const jobMajor = document.getElementById("job-major2");
	const jobDuration = document.getElementById("job-duration2");
	const jobSalary = document.getElementById("job-salary2");
	const jobDescription = document.getElementById("job-description2");
	const jobRequirements = document.getElementById("job-requirements2");

	const posted_on = new Date(data.posted_on);
	const expired_on = new Date(data.expired_on);

	const timeDif = Math.abs(expired_on - posted_on);
	const days = Math.floor(timeDif / (1000 * 60 * 60 * 24))

	jobPosition.value = data.position;
	jobLocation.value = data.location;
	jobType.value = data.job_type;
	jobMajor.value = data.major;
	jobDuration.value = days;
	jobSalary.value = data.salary;
	jobDescription.value = data.description;
	jobRequirements.value = data.requirements;

	openModalBtn.forEach(button => {
		button.addEventListener("click", () => {
			editJobModal.style.display = "block";
		});
	});

	closeModalBtn.addEventListener("click", () => {
		editJobModal.style.display = "none";
	});

	submitEdit.onclick = () => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger'
			},
		});

		swalWithBootstrapButtons.fire({
			title: 'Update the existing data?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Update!',
			cancelButtonText: 'Wait...',
		}).then((result) => {
			if (result.isConfirmed) {
				editJob(id)
			};
		})
	};
};

async function postJob() {
	const userId = localStorage.getItem("id");
	const isLoggedIn = localStorage.getItem("isLoggedIn");

	const position = document.getElementById("job-position").value;
	const location = document.getElementById("job-location").value;
	const jobType = document.getElementById("job-type").value;
	const major = document.getElementById("job-major").value;
	const duration = document.getElementById("job-duration").value;
	const salary = document.getElementById("job-salary").value;
	const description = document.getElementById("job-description").value;
	const requirements = document.getElementById("job-requirements").value;

	const editJobModal = document.getElementById("editJobModal");

	const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
		"isLoggedIn": isLoggedIn,
	};

	const data = {
		"position": position,
		"location": location,
		"job_type": jobType,
		"major": major,
		"available_for": duration,
		"salary": salary,
		"description": description,
		"requirements": requirements,
	};

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: JSON.stringify(data),
	};

	try {
		const response = await fetch(`http://127.0.0.1:5000/jobs`, requestOptions);
		const result = await response.json();
	
		if (result.status === "Success!") {
			Swal.fire({
				icon: "success",
				title: "Success!",
				text: result.message,
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.href = "foryou-company.html"
					editJobModal.style.display = "none";
				};
			});
		} else {
			Swal.fire({
				icon: "error",
				title: result.status,
				text: result.message,
			})
		};
	} catch {
		Swal.fire({
			icon: "error",
			title: "Post Failed!",
			text: "Please fill all the fields!",
		})
	};
};

async function editJob(id) {
	const userId = localStorage.getItem("id");
	const isLoggedIn = localStorage.getItem("isLoggedIn");

	const position = document.getElementById("job-position2").value;
	const location = document.getElementById("job-location2").value;
	const jobType = document.getElementById("job-type2").value;
	const major = document.getElementById("job-major2").value;
	const duration = document.getElementById("job-duration2").value;
	const salary = document.getElementById("job-salary2").value;
	const description = document.getElementById("job-description2").value;
	const requirements = document.getElementById("job-requirements2").value;

	const editJobModal = document.getElementById("editJobModal");

	const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
		"isLoggedIn": isLoggedIn,
	};

	const data = {
		"position": position,
		"location": location,
		"job_type": jobType,
		"major": major,
		"available_for": duration,
		"salary": salary,
		"description": description,
		"requirements": requirements,
	};

	const requestOptions = {
		method: "PUT",
		headers: myHeaders,
		body: JSON.stringify(data),
	};

	const response = await fetch(`http://127.0.0.1:5000/company/jobs/${id}`, requestOptions);
	const result = await response.json();

	if (result.status === "Success!") {
		Swal.fire({
			icon: "success",
			title: "Success!",
			text: result.message,
		}).then((result) => {
			if (result.isConfirmed) {
				window.location.href = "foryou-company.html"
				editJobModal.style.display = "none";
			};
		});
	} else {
		Swal.fire({
			icon: "error",
			title: result.status,
			text: result.message,
		})
	};
};