function createJobCard(jobData) {
    const card = document.createElement("div");
    card.className = "app-container"
    card.innerHTML = `
        <div class="app-cordion">
            <h3>${jobData.position}</h3>
            <p>${jobData.location} (${jobData.job_type})</p>
        </div>

        <div class="panel">
            
        </div>
    `;
    
    const accordion = card.querySelector(".app-cordion");
    accordion.onclick = () => {
        accordion.classList.toggle("active");
        getJobApplicants(jobData.id)
        getCompanyJobDetails(jobData.id)
    };

    return card;
}

async function getJobApplicants(id) {
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

    const card = document.getElementById(`${id}`);
    const applicants = card.querySelector(".panel");
    applicants.innerHTML = ""

    const response = await fetch(`http://127.0.0.1:5000/application/jobs/${id}`, requestOptions);
    const result = await response.json();
    const data = result.response.list_applicants
    const filteredData = data.filter((app) => app.status !== "saved");

    filteredData.forEach((app) => {
        const applicant = document.createElement("div");
        applicant.className = "accordion-content";
        applicant.innerHTML = `
            <div class="accordion-left">
                <img src="${app.applicant_pict}" alt="">
                <div class="app-info">
                    <div><strong>${app.applicant_name}</strong></div>
                    <p>${app.status}</p>
                </div>
            </div>
            <button class="styled-button">View</button>
        `;

        applicants.appendChild(applicant)

        if (applicants.style.maxHeight) {
            applicants.style.maxHeight = null;
        } else {
            applicants.style.maxHeight = applicants.scrollHeight + "px";
        }

        const viewApp = applicant.querySelector(".styled-button");
        viewApp.onclick = () => getAppDetails(app.app_id)
    })
}

document.addEventListener('DOMContentLoaded', getCompanyJobs)

async function getCompanyJobs(e) {
    e.preventDefault()

    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (userId == null) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Please login first",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "landing.html"
            }
        });
    };

    const myHeaders = {
        "Content-type": "application/json; charset=UTF-8",
        "id": userId,
        "isLoggedIn": isLoggedIn,
    };

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const appContainer = document.getElementById("app-container");
    appContainer.innerHTML = "";

    const response = await fetch("http://127.0.0.1:5000/company/jobs", requestOptions);
    const result = await response.json();
    const data = result.data

    if (data && data.length > 0) {
        data.forEach((job) => {
            const jobCard = createJobCard(job);
            jobCard.id = job.id;
            appContainer.appendChild(jobCard)
        });

        getCompanyJobDetails(data[0].id)

    } else {
        const noFoundMessage = document.createElement("p");
        noFoundMessage.innerHTML = "No application received yet";
        appContainer.appendChild(noFoundMessage);
    };
};

async function getCompanyJobDetails(id) {
	const response = await fetch(`http://127.0.0.1:5000/jobs/${id}`);
	const result = await response.json();
	const data = result.data;

    console.log(data)

	const detail = document.querySelector(".detail");
	detail.removeAttribute("hidden")

    detail.innerHTML = `
        <div class="detail-header">
            <h2></h2>
            <p></p>
        </div>
        <hr class="divider">
        <div class="detail-desc">
            <div class="description">
                <h4>Job Description</h4>
                <p></p>
            </div>
            <hr class="divider">
            <div class="qualification">
                <h4>Qualification</h4>
                <ul>
                    <li></li>
                </ul>
            </div>
        </div>
    `;

	const position = document.querySelector(".detail-header > h2");
    const location = document.querySelector(".detail-header > p");
	const job_desc = document.querySelector(".description > p");
	const qualification = document.querySelector(".qualification > ul > li");

	position.innerHTML = data.position;
    location.innerHTML = data.location + " (" + data.job_type + ")"
	job_desc.innerHTML = data.description;
	qualification.innerHTML = data.requirements;
}

async function getAppDetails(id) {
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

    detail.innerHTML = `
        <div class="detail-header">
            <img>
            <h2></h2>
            <p></p>
        </div>
        <hr class="divider">
        <div class="detail-desc">
            <div class="about">
                <h4>Respond given</h4>
                <p></p>
            </div>
            <hr class="divider">
            <div class="description">
                <h4>Cover Letter</h4>
                <p></p>
            </div>
        </div>
        <hr class="divider">
        <div class="detail-btn">
            <button class="btn-apply">Respond Application</button>
        </div>
    `;

    const logo = document.querySelector('.detail-header > img');
    const user = document.querySelector('.detail-header > h2');
    const position = document.querySelector('.detail-header > p');
    const about_company = document.querySelector('.about > p');
    const cover_letter = document.querySelector('.description > p');

    logo.src = data.applicant_pict;
    user.innerHTML = data.applicant_name;
    position.innerHTML = data.job_position;
    about_company.innerHTML = data.note;
    cover_letter.innerHTML = data.cover_letter;

    // Modal
    const respondBtn = document.querySelector(".detail-btn")
    const openModalBtn = document.querySelectorAll(".btn-apply");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const respondModal = document.getElementById("respondModal");
    const submitRespond = document.getElementById("submitRespondBtn")
    const toUser = document.getElementById("to-user");
    const toPosition = document.getElementById("to-position");

    if (data.status != "applied") {
        respondBtn.style.display = "none"
    } else {
        respondBtn.style.display = "flex"
    };

    openModalBtn.forEach(button => {
        button.addEventListener("click", () => {
            respondModal.style.display = "block";
            toUser.innerHTML = data.applicant_name;
            toPosition.innerHTML = data.job_position;
        });
    });

    closeModalBtn.addEventListener("click", () => {
        respondModal.style.display = "none";
    });

    submitRespond.onclick = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
        });

        swalWithBootstrapButtons.fire({
            title: 'Send respond?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Send!',
            cancelButtonText: 'Wait...',
        }).then((result) => {
            if (result.isConfirmed) {
                appResponse(id)
            };
        })
    };
};

async function appResponse(id) {
    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const decision = document.getElementById("decision").value;
    const note = document.getElementById("respondNote").value;

    const respondModal = document.getElementById("respondModal");
    const myHeaders = {
        "Content-type": "application/json; charset=UTF-8",
        "id": userId,
        "isLoggedIn": isLoggedIn,
    };

    const data = {
        "status": decision,
        "note": note,
    };

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/application/${id}`, requestOptions);
        const result = await response.json();

        if (result.status === "Success!") {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: result.message,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "myapp-company.html"
                    respondModal.style.display = "none";
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
            title: "Send Failed!",
            text: "Please select the status!",
        })
    }
}