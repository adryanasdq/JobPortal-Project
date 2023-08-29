async function getProfile(e) {
    e.preventDefault()

    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const userPict = document.querySelector(".user-img");
    const name = document.querySelector(".user-info > .user-name");
    const industry1 = document.querySelector(".user-info > .user-industry");
    const industry2 = document.querySelector("#user-industry");
    const website = document.querySelector(".user-website");
    const github = document.querySelector(".user-github");
    const facebook = document.querySelector(".user-facebook");
    const twitter = document.querySelector(".user-twitter");
    const instagram = document.querySelector(".user-instagram");
    const summary = document.querySelector(".user-summary");
    const est = document.querySelector(".user-est");
    const address = document.querySelector(".user-address");
    const email = document.querySelector(".user-email");
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
        const response = await fetch(`http://127.0.0.1:5000/company/${userId}`, requestOptions);
        const result = await response.json();
        const data = result.response;

        const dateString = data.est_date;
        const date = new Date(dateString);

        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        userPict.src = data.logo_url;
        name.innerHTML = data.name;
        industry1.innerHTML = data.industry + " Company";
        industry2.innerHTML = data.industry;
        website.innerHTML = data.website;
        github.innerHTML = data.github;
        facebook.innerHTML = data.facebook;
        twitter.innerHTML = data.twitter;
        instagram.innerHTML = data.instagram;
        summary.innerHTML = data.about;
        est.innerHTML = formattedDate;
        address.innerHTML = data.address;
        email.innerHTML = data.email;
        contact.innerHTML = data.contact;

        // Modal 1
        const openModal1 = document.querySelector("#modal-1 ion-icon");
        const closeModal1 = document.getElementById("closeModal1");
        const modal1 = document.getElementById("firstModal");
        const submitEdit1 = document.getElementById("submitEdit1");
    
        const userCompanyName = document.getElementById("company-name");
        const userIndustry = document.getElementById("company-industry");
    
        userCompanyName.value = data.name;
        userIndustry.value = data.industry;
    
        // Modal 2
        const openModal2 = document.getElementById("link-edit");
        const closeModal2 = document.getElementById("closeModal2");
        const modal2 = document.getElementById("secondModal");
        const submitEdit2 = document.getElementById("submitEdit2");
    
        const userWebsite = document.getElementById("user-website");
        const userGithub = document.getElementById("user-github");
        const userFacebook = document.getElementById("user-facebook");
        const userTwitter = document.getElementById("user-twitter");
        const userInstagram = document.getElementById("user-instagram");

        userWebsite.value = data.website;
        userGithub.value = data.github;
        userFacebook.value = data.facebook;
        userTwitter.value = data.twitter;
        userInstagram.value = data.instagram;
    
        // Modal 3
        const openModal3 = document.getElementById("about-edit");
        const closeModal3 = document.getElementById("closeModal3");
        const modal3 = document.getElementById("thirdModal");
        const submitEdit3 = document.getElementById("submitEdit3");
    
        const userAbout = document.getElementById("company-about");
        const userEstDate = document.getElementById("company-est");
        const newIndustry = document.getElementById("company-industry");
        const userAddress = document.getElementById("company-address");
        const userEmail = document.getElementById("company-email");
        const userContact = document.getElementById("company-contact");

        userAbout.value = data.about;
        userEstDate.value = new Date(data.est_date).toISOString().substring(0, 10);
        newIndustry.value = data.industry;
        userAddress.value = data.address;
        userEmail.value = data.email;
        userContact.value = data.contact;
    
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
    };

}

async function updateProfile1(id) {
    const userId = localStorage.getItem("id");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const firstModal = document.getElementById("firstModal");

    const newCompanyName = document.getElementById("company-name").value;
    const newIndustry = document.getElementById("company-industry").value;

    const myHeaders = {
        "Content-type": "application/json; charset=UTF-8",
        "id": userId,
        "isLoggedIn": isLoggedIn,
    };

    const data = {
        "name": newCompanyName,
        "industry": newIndustry,
    };

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(data),
    };

    const response = await fetch(`http://127.0.0.1:5000/company/${id}`, requestOptions);
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
                window.location.href = "profile-company.html"
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

    const response = await fetch(`http://127.0.0.1:5000/company/${id}`, requestOptions);
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
                window.location.href = "profile-company.html"
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
    const thirdModal = document.getElementById("thirdModal");

    const newAbout = document.getElementById("company-about").value;
    const newEstDate = document.getElementById("company-est").value;
    const newIndustry = document.getElementById("company-industry").value;
    const newAddress = document.getElementById("company-address").value;
    const newEmail = document.getElementById("company-email").value;
    const newContact = document.getElementById("company-contact").value;

    const myHeaders = {
        "Content-type": "application/json; charset=UTF-8",
        "id": userId,
        "isLoggedIn": isLoggedIn,
    };

    const data = {
        "about": newAbout,
        "est_date": newEstDate,
        "industry": newIndustry,
        "address": newAddress,
        "email": newEmail,
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

    const response = await fetch(`http://127.0.0.1:5000/company/${id}`, requestOptions);
    const result = await response.json();

    if (result.status === "Success!") {
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: result.message,
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                thirdModal.style.display = "none";
                window.location.href = "profile-company.html"
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