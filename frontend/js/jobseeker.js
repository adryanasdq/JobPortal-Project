function createJobCard(jobData) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-left">
            <img src="${jobData.url_pict}" alt="">
        </div>
        <div class="card-center">
            <h3>${jobData.first_name + " " + jobData.last_name}</h3>
            <p class="card-loc"><ion-icon name="location-outline"></ion-icon>${jobData.address}</p>
            <div class="card-sub">
                <p><ion-icon name="today-outline"></ion-icon>${jobData.age} years old</p>
                <p><ion-icon name="school-outline"></ion-icon>${jobData.education}</p>
            </div>
        </div>
        <div class="card-right">
        <div class="card-salary">
            <p>${jobData.title}</p>
        </div>
    </div>
    `;
    card.onclick = () => getJobseekerDetails(jobData.id);
    return card;
}


async function getJobs(e) {
    e.preventDefault()

    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const education = document.getElementById("education").value;
    const age = document.getElementById("age").value;

    let url = "http://127.0.0.1:5000/search/jobseeker?";

    if (firstName) {
        url += `first_name=${firstName}`
    };
    if (lastName) {
        url += `&last_name=${lastName}`
    };
    if (education) {
        url += `&education=${education}`
    };
    if (age) {
        url += `&age=${age}`
    }

    const appContainer = document.getElementById("applicants");
    const otherContainer = document.getElementById("others")
    appContainer.innerHTML = "";
    otherContainer.innerHTML = "";

    const myHeaders = {
        "Content-type": "application/json; charset=UTF-8",
        "id": userId,
        "isLoggedIn": isLoggedIn,
    };

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

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
    };

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    const data = result.response;

    const app = await fetch("http://127.0.0.1:5000/application", requestOptions);
    const appResult = await app.json();
    const appData = appResult.data.filter(app => app.status != "saved");

    const applicants = data.filter(seeker =>
        appData.some(apps => apps.applicant_id === seeker.id));

    const others = data.filter(seeker =>
        !appData.some(apps => apps.applicant_id === seeker.id));

    if (data && data.length > 0) {
        const appHead = document.getElementById("app-head");
        const otherHead = document.getElementById("other-head");

        if (applicants.length > 0) {
            applicants.forEach((apps) => {
                appHead.style.display = "flex";
                const appsCard = createJobCard(apps);
                appContainer.appendChild(appsCard)
            });
        } else {
            appHead.style.display = "none";
        };

        if (others.length > 0) {
            others.forEach((other) => {
                otherHead.style.display = "flex";
                const otherCard = createJobCard(other);
                otherContainer.appendChild(otherCard)
            });
        } else {
            otherHead.style.display = "none";
        };

    } else {
        const noFoundMessage = document.createElement("p");
        const appHead = document.getElementById("app-head");
        const otherHead = document.getElementById("other-head");

        appHead.style.display = "none";
        otherHead.style.display = "none";
        noFoundMessage.innerHTML = result.message;
        appContainer.appendChild(noFoundMessage);
    };
};

const filterSearch = document.querySelector("form.search");
const sorter = document.querySelector(".sort-by");

filterSearch.addEventListener("submit", getJobs);
document.addEventListener("DOMContentLoaded", getJobs);


async function getJobseekerDetails(id) {
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

    const detail = document.querySelector(".detail");
    const detailContent = document.querySelector(".detail-content");
    const unauthContent = document.querySelector(".unauth-content");
    const unauth = document.querySelector("unauth-content > p");
    
    const response = await fetch(`http://127.0.0.1:5000/jobseeker/${id}`, requestOptions);
    const result = await response.json();
    const data = result.response;

    detail.removeAttribute("hidden")
    
    if (result.status === "Unauthorized") {
        unauthContent.hidden = false
        detailContent.hidden = true

    } else {
        unauthContent.hidden = true
        detailContent.hidden = false

        const pict = document.querySelector(".detail-header > img");
        const name = document.querySelector(".detail-header > h2");
        const title = document.querySelector(".detail-header > p");
        const summary = document.querySelector(".about > p");
        const gendAge = document.querySelector(".description > p");
        const qualification = document.querySelector(".qualification > p");
        const contact = document.querySelector(".contact > p");

        pict.src = data.url_pict;
        name.innerHTML = data.first_name + " " + data.last_name;
        title.innerHTML = data.title;
        summary.innerHTML = data.summary;
        gendAge.innerHTML = data.gender + ", " + data.age + " years old";
        qualification.innerHTML = data.education + " in " + data.major;
        contact.innerHTML = data.contact + " (" + data.email + ")";
    };
};