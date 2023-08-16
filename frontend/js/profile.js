async function getProfile(e) {
    e.preventDefault()

    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const userPict = document.querySelector(".user-img");
    const name = document.querySelector(".user-info > .user-name");
    const title = document.querySelector(".user-info > .user-title");
    const address = document.querySelector(".user-info > .user-address");
    const website = document.querySelector(".user-website");
    const github = document.querySelector(".user-github");
    const facebook = document.querySelector(".user-facebook");
    const twitter = document.querySelector(".user-twitter");
    const instagram = document.querySelector(".user-instagram");
    const summary = document.querySelector(".user-summary");
    const age = document.querySelector(".user-age");
    const gender = document.querySelector(".user-gender");
    const education = document.querySelector(".user-education");
    const major = document.querySelector(".user-major");
    const contact = document.querySelector(".user-contact");

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
            icon: 'error',
            title: 'Oops...',
            text: "Please login first",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "landing.html"
            }
        });
    } else {
        const response = await fetch(`http://127.0.0.1:5000/jobseeker/${userId}`, requestOptions);
        const result = await response.json();
        const data = result.response;

        const fullName = data.first_name + " " + data.last_name;
        const words = fullName.split(' ');

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substring(1);
        };

        const capped_name = words.join(' ');

        userPict.src = 'https://drive.google.com/uc?export=view&id=' + data.url_pict;
        name.innerHTML = capped_name;
        title.innerHTML = data.title;
        address.innerHTML = data.address;
        website.innerHTML = data.website;
        github.innerHTML = data.github;
        facebook.innerHTML = data.facebook;
        twitter.innerHTML = data.twitter;
        instagram.innerHTML = data.instagram;
        summary.innerHTML = data.summary;
        age.innerHTML = data.age + " years old";
        gender.innerHTML = data.gender;
        education.innerHTML = data.education;
        major.innerHTML = data.major;
        contact.innerHTML = data.contact;
    };

    // Modal 1
    const openModal1 = document.querySelector("#modal-1 ion-icon");
    const closeModal1 = document.getElementById("closeModal1");
    const modal1 = document.getElementById("firstModal");
    const submitEdit1 = document.getElementById("submitEdit1");

    // Modal 2
    const openModal2 = document.getElementById("link-edit");
    const closeModal2 = document.getElementById("closeModal2");
    const modal2 = document.getElementById("secondModal");
    const submitEdit2 = document.getElementById("submitEdit2");

    // Modal 3
    const openModal3 = document.getElementById("about-edit");
    const closeModal3 = document.getElementById("closeModal3");
    const modal3 = document.getElementById("thirdModal");
    const submitEdit3 = document.getElementById("submitEdit3");

    openModal1.addEventListener("click", () => {
        modal1.style.display = "block";
    });

    closeModal1.addEventListener("click", () => {
        modal1.style.display = "none";
    });

    openModal2.addEventListener("click", () => {
        modal2.style.display = "block";
    });

    closeModal2.addEventListener("click", () => {
        modal2.style.display = "none";
    });

    openModal3.addEventListener("click", () => {
        modal3.style.display = "block";
    });

    closeModal3.addEventListener("click", () => {
        modal3.style.display = "none";
    });

    submitEdit1.onclick = () => updateProfile1(userId);
    submitEdit2.onclick = () => updateProfile2(userId);
    submitEdit3.onclick = () => updateProfile3(userId);

}

async function updateProfile1(id) {
    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const firstModal = document.getElementById("firstModal");

    const newFirstName = document.getElementById("user-firstName").value;
    const newLastName = document.getElementById("user-lastName").value;
    const newTitle = document.getElementById("user-title").value;
    const newAddress = document.getElementById("user-address").value;

    const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
        "isLoggedIn": isLoggedIn,
	};

    const data = {
		"first_name": newFirstName,
        "last_name": newLastName,
        "title": newTitle,
        "address": newAddress,
	};

    Object.keys(data).forEach(key => {
        if (!data[key]) {
            delete data[key];
        }
    });

	const requestOptions = {
		method: "PUT",
		headers: myHeaders,
		body: JSON.stringify(data),
	};

    const response = await fetch(`http://127.0.0.1:5000/jobseeker/${id}`, requestOptions);
    const result = await response.json();

    if (result.status === "Success!") {
		Swal.fire({
			icon: 'success',
			title: 'Success!',
			text: result.message,
            confirmButtonText: "Yes"
		}).then((result) => {
            if (result.isConfirmed) {
                firstModal.style.display = "none";
                window.location.href = "profile-jobseeker.html"
            }
        });
	} else {
		Swal.fire({
			icon: 'error',
			title: result.status,
			text: result.message,
		})
	};
};

async function updateProfile2(id) {
    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const secondModal = document.getElementById("secondModal");

    const newWebsite = document.getElementById("user-website").value;
    const newGithub = document.getElementById("user-github").value;
    const newFacebook = document.getElementById("user-facebook").value;
    const newTwitter = document.getElementById("user-twitter").value;
    const newInstagram = document.getElementById("user-instagram").value;

    const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
        "isLoggedIn": isLoggedIn,
	};

    const data = {
		"website": newWebsite,
        "github": newGithub,
        "facebook": newFacebook,
        "twitter": newTwitter,
        "instagram": newInstagram
	};

    Object.keys(data).forEach(key => {
        if (!data[key]) {
            delete data[key];
        }
    });

	const requestOptions = {
		method: "PUT",
		headers: myHeaders,
		body: JSON.stringify(data),
	};

    const response = await fetch(`http://127.0.0.1:5000/jobseeker/${id}`, requestOptions);
    const result = await response.json();

    if (result.status === "Success!") {
		Swal.fire({
			icon: 'success',
			title: 'Success!',
			text: result.message,
            confirmButtonText: "Yes"
		}).then((result) => {
            if (result.isConfirmed) {
                secondModal.style.display = "none";
                window.location.href = "profile-jobseeker.html"
            }
        });
	} else {
		Swal.fire({
			icon: 'error',
			title: result.status,
			text: result.message,
		})
	};
};

async function updateProfile3(id) {
    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const secondModal = document.getElementById("secondModal");

    const newSummary = document.getElementById("user-summary").value;
    const newDoB = document.getElementById("user-dob").value;
    const newGender = document.getElementById("user-gender").value;
    const newEducation = document.getElementById("user-education").value;
    const newMajor = document.getElementById("user-major").value;
    const newContact = document.getElementById("user-contact").value;

    const myHeaders = {
		"Content-type": "application/json; charset=UTF-8",
		"id": userId,
        "isLoggedIn": isLoggedIn,
	};

    const data = {
		"summary": newSummary,
        "date_of_birth": newDoB,
        "gender": newGender,
        "education": newEducation,
        "major": newMajor,
        "contact": newContact,
	};

    Object.keys(data).forEach(key => {
        if (!data[key]) {
            delete data[key];
        }
    });

	const requestOptions = {
		method: "PUT",
		headers: myHeaders,
		body: JSON.stringify(data),
	};

    const response = await fetch(`http://127.0.0.1:5000/jobseeker/${id}`, requestOptions);
    const result = await response.json();

    if (result.status === "Success!") {
		Swal.fire({
			icon: 'success',
			title: 'Success!',
			text: result.message,
            confirmButtonText: "Yes"
		}).then((result) => {
            if (result.isConfirmed) {
                secondModal.style.display = "none";
                window.location.href = "profile-jobseeker.html"
            }
        });
	} else {
		Swal.fire({
			icon: 'error',
			title: result.status,
			text: result.message,
		})
	};
};


document.addEventListener("DOMContentLoaded", getProfile);