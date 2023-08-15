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
}

document.addEventListener("DOMContentLoaded", getProfile);