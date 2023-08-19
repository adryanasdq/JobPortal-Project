function createJobCard(jobData) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-left">
            <img src="${jobData.applicant_pict}" alt="">
        </div>
        <div class="card-center">
            <h3>${jobData.applicant_name}</h3>
            <p class="card-detail">${jobData.position}</p>
            <p class="card-loc"><ion-icon name="location-outline"></ion-icon>${jobData.location}</p>
            <div class="card-sub">
                <p><ion-icon name="hourglass-outline"></ion-icon>${jobData.job_type}</p>
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

    const appContainer = document.getElementById("app");
    const respContainer = document.getElementById("resp")
    appContainer.innerHTML = "";
    respContainer.innerHTML = "";

    const response = await fetch("http://127.0.0.1:5000/application", requestOptions);
    const result = await response.json();
    const data = result.data.filter(app => app.status != "saved");

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
            if (job.status === "applied") {
                appContainer.appendChild(jobCard)
            } else {
                respContainer.appendChild(jobCard)
            };
        });

    } else {
        const noFoundMessage = document.createElement("p");
        noFoundMessage.innerHTML = "No application received yet";
        appContainer.appendChild(noFoundMessage);
    };
};

async function getAppDetails(id) {
    const logo = document.querySelector('.detail-header > img');
    const user = document.querySelector('.detail-header > h2');
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

    submitRespond.onclick = () => appResponse(id);
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
}


const sorter = document.querySelector(".sort-by");
sorter.addEventListener("change", getApps);