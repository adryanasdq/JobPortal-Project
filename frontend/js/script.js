$(".card").on("click", function() {
    $(".detail").addClass("active");
})

$(".close-detail").on("click", function() {
    $(".detail").removeClass("active");
})

$(".menu-bar").on("click", function() {
    $(".sidebar").addClass("active");
})

$(".logo").on("click", function() {
    $(".sidebar").removeClass("active")
})

// Get all job
const filterSearch = document.getElementById('job-filter');
filterSearch.addEventListener('submit', getJobs)

// create card for every jobs
function createJobCard(dataItem) {
	const companyList = document.createElement('div');
	companyList.classList.add('company-list');

	const row = document.createElement('div');
	row.classList.add('row');
	companyList.appendChild(row);

	const logoCol = document.createElement('div');
	logoCol.classList.add('col-md-2', 'col-sm-2');
	row.appendChild(logoCol);

	const companyLogo = document.createElement('div');
	companyLogo.classList.add('company-logo');
	logoCol.appendChild(companyLogo);

	const logoImg = document.createElement('img');
	logoImg.src = dataItem.logo_url;
	logoImg.classList.add('img-responsive');
	logoImg.alt = dataItem.company;
	companyLogo.appendChild(logoImg);

	const contentCol = document.createElement('div');
	contentCol.classList.add('col-md-10', 'col-sm-10');
	row.appendChild(contentCol);

	const companyContent = document.createElement('div');
	companyContent.classList.add('company-content');
	contentCol.appendChild(companyContent);

	const jobTitle = document.createElement('h3');
	jobTitle.textContent = dataItem.position;
	companyContent.appendChild(jobTitle);

	const jobInfo = document.createElement('p');
	companyContent.appendChild(jobInfo);

	const companyName = document.createElement('span');
	companyName.classList.add('company-name');
	companyName.innerHTML = `<i class="fa fa-briefcase"></i> ${dataItem.company}`;
	jobInfo.appendChild(companyName);

	const companyLocation = document.createElement('span');
	companyLocation.classList.add('company-location');
	companyLocation.innerHTML = `<i class="fa fa-map-marker"></i> ${dataItem.location}`;
	jobInfo.appendChild(companyLocation);

	const salaryRange = document.createElement('span');
	salaryRange.classList.add('package');
	salaryRange.innerHTML = `<i class="fa fa-money"></i> ${dataItem.salary}`;
	jobInfo.appendChild(salaryRange);

	return companyList;
}

function getJobs(e) {
	e.preventDefault()

	const position = filterSearch.querySelector('.job-position').value;
	const major = filterSearch.querySelector('.job-major').value;
	const salary = filterSearch.querySelector('.job-salary').value;
	const location = filterSearch.querySelector('.job-location').value;

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

	const jobContainer = document.querySelector('.jobs-container');
	jobContainer.innerHTML = '';

	fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	})
		.then((response) => response.json())
		.then((jsonResp) => {
			if (jsonResp.response && jsonResp.response.length > 0) {
				for (let job of jsonResp.response) {
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