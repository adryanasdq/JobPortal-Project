from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta, date
from flask_cors import CORS


# Initiation
app = Flask(__name__)
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://postgres:admin@localhost:5432/postgres"
db = SQLAlchemy(app)
CORS(app)


# _____________________________________________________Models_____________________________________________________
class JobSeeker(db.Model):
    __tablename__ = "job_seeker"
    __table_args__ = {"schema": "portaljob"}

    id = db.Column(
        db.Integer,
        db.Sequence("jobseeker_id_seq", start=301, maxvalue=399),
        primary_key=True,
    )
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    title = db.Column(db.String)
    age = db.Column(db.Integer, db.CheckConstraint("age >= 0"))
    gender = db.Column(db.String, db.CheckConstraint("gender IN ('Male', 'Female')"))
    education = db.Column(db.String)
    major = db.Column(db.String)
    contact = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    summary = db.Column(db.Text)
    url_pict = db.Column(db.String)
    website = db.Column(db.String)
    github = db.Column(db.String)
    facebook = db.Column(db.String)
    twitter = db.Column(db.String)
    instagram = db.Column(db.String)
    application = db.relationship("Application", backref="jobseeker")

    def __repr__(self):
        return f"Job Seeker <{self.first_name}, {self.email}>"


class Company(db.Model):
    __tablename__ = "company"
    __table_args__ = {"schema": "portaljob"}

    id = db.Column(
        db.Integer,
        db.Sequence("company_id_seq", start=101, maxvalue=199),
        primary_key=True,
    )
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    industry = db.Column(db.String)
    address = db.Column(db.String, nullable=False)
    website = db.Column(db.String)
    github = db.Column(db.String)
    facebook = db.Column(db.String)
    twitter = db.Column(db.String)
    instagram = db.Column(db.String)
    contact = db.Column(db.String, nullable=False)
    logo_url = db.Column(db.String)
    about = db.Column(db.Text)
    est_date = db.Column(db.Date)
    jobvacancy = db.relationship("JobVacancy", backref="company")

    def __repr__(self):
        return f"Company <{self.name}>"


class JobVacancy(db.Model):
    __tablename__ = "job_vacancy"
    __table_args__ = {"schema": "portaljob"}

    id = db.Column(
        db.Integer,
        db.Sequence("jobvacancy_id_seq", start=201, maxvalue=299),
        primary_key=True,
    )
    company_id = db.Column(db.Integer, db.ForeignKey("portaljob.company.id"))
    position = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    posted_on = db.Column(db.Date, nullable=False)
    expired_on = db.Column(db.Date, nullable=False)
    job_type = db.Column(db.String)
    major = db.Column(db.String)
    salary = db.Column(db.Integer)
    description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    application = db.relationship("Application", backref="jobvacancy")

    def __repr__(self):
        return f"Job <{self.position}>"


class Application(db.Model):
    __tablename__ = "application"
    __table_args__ = {"schema": "portaljob"}

    id = db.Column(
        db.Integer,
        db.Sequence("application_id_seq", start=401, maxvalue=499, cycle=True),
        primary_key=True,
)
    job_id = db.Column(db.Integer, db.ForeignKey("portaljob.job_vacancy.id"), primary_key=True)
    jobseeker_id = db.Column(db.Integer, db.ForeignKey("portaljob.job_seeker.id"), primary_key=True)
    status = db.Column(db.String, db.CheckConstraint("status IN ('saved', 'applied', 'accepted', 'rejected')"))
    cover_letter = db.Column(db.Text)
    note = db.Column(db.String)

    def __repr__(self):
        return f"Application <{self.job_id}, {self.jobseeker_id}>"


# Creating Models on Database
with app.app_context():
    db.create_all()


# Login Using Basic Auth
@app.post("/login")
def login():
    username = request.authorization.get("username")
    password = request.authorization.get("password")
    jobseeker = (
        db.session.query(JobSeeker)
        .filter(JobSeeker.username == username)
        .first()
    )

    company = (
        db.session.query(Company)
        .filter(Company.username == username)
        .first()
    )

    if jobseeker:
        if jobseeker.password == password:
            return {
                "id": jobseeker.id,
                "username": jobseeker.username,
                "password": jobseeker.password,
                "name": jobseeker.first_name
            }
        else:
            return {"message": "Password is not matched!"}, 400

    elif company:
        if company.password == password:
            return {
                "id": company.id,
                "username": company.username,
                "password": company.password,
                "name": company.name
            }
        else:
            return {"message": "Password is not matched!"}, 400

    else:
        return {"message": "No such account exist!"}, 400

# _________________________________________Jobseeker and Company Register_________________________________________
@app.post("/register")
def register():
    data = request.get_json()
    if data.get("role") == "jobseeker":
        splitted_name = data.get("name").split(" ")
        new_account = JobSeeker(
            username=data.get("username"),
            password=data.get("password"),
            email=data.get("email"),
            first_name=splitted_name[0],
            last_name=" ".join(splitted_name[1:]),
            contact=data.get("contact"),
            address=data.get("address"),
        )

    elif data.get("role") == "company":
        new_account = Company(
            username=data.get("username"),
            password=data.get("password"),
            email=data.get("email"),
            name=data.get("name"),
            address=data.get("address"),
            contact=data.get("contact"),
        )

    else:
        return {
            "status": "Bad Request 400",
            "details": "Please input a valid role",
        }, 400

    conditions = db.or_(
        JobSeeker.username == new_account.username,
        JobSeeker.email == new_account.email,
        Company.username == new_account.username,
        Company.email == new_account.email,
    )

    # nomor telp juga
    existing_user = (
        db.session.query(
            JobSeeker.username, JobSeeker.email, Company.username, Company.email
        )
        .join(Company, conditions)
        .filter(conditions)
        .first()
    )

    if existing_user:
        return {
            "status": "Registration failed!",
            "message": "Username or email already exists",
        }, 400

    db.session.add(new_account)
    db.session.commit()
    return {"status": "Success!", "message": "Please login to proceed"}, 201


# _________________________________________________Jobseeker Info_________________________________________________
@app.get("/jobseeker/<int:id>")
def getJobseekerDetail(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    seeker = db.session.query(JobSeeker).filter(JobSeeker.id == id).first()
    company_applied = (
        db.session.query(JobVacancy)
        .join(Application, Application.job_id == JobVacancy.id)
        .filter(Application.jobseeker_id == id)
    )

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    # Only the owner and the company to which the owner applied have access
    elif user.get("id") == id or user.get("id") in [
        company.company_id for company in company_applied
    ]:
        response = {
            "id": seeker.id,
            "username": seeker.username,
            "url_pict": seeker.url_pict,
            "email": seeker.email,
            "first_name": seeker.first_name,
            "last_name": seeker.last_name,
            "title": seeker.title,
            "age": seeker.age,
            "gender": seeker.gender,
            "education": seeker.education,
            "major": seeker.major,
            "contact": seeker.contact,
            "address": seeker.address,
            "summary": seeker.summary,
            "website": seeker.website,
            "github": seeker.github,
            "facebook": seeker.facebook,
            "twitter": seeker.twitter,
            "instagram": seeker.instagram,
        }
        return {"message": "success", "response": response}

    elif not seeker:
        return {
            "status": "Not Found",
            "message": "No user found with this id",
        }, 404

    else:
        return {
            "status": "Unauthorized",
            "message": "You have no access to this user",
        }, 401


@app.put("/jobseeker/<int:id>")
def updateJobseeker(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    seeker = db.session.query(JobSeeker).filter(JobSeeker.id == id).first()
    if user.get("id") == id:
        data = request.get_json()

        seeker.password = data.get("password", seeker.password)
        seeker.email = data.get("email", seeker.email)
        seeker.first_name = data.get("first_name", seeker.first_name)
        seeker.last_name = data.get("last_name", seeker.last_name)
        seeker.title = data.get("title", seeker.title)

        dob = data.get("date_of_birth")
        if dob:
            convertedDob = datetime.strptime(dob, "%Y-%m-%d")
            seeker.age = ((datetime.now() - convertedDob).days) // 365

        seeker.gender = data.get("gender", seeker.gender)
        seeker.education = data.get("education", seeker.education)
        seeker.major = data.get("major", seeker.major)
        seeker.contact = data.get("contact", seeker.contact)
        seeker.address = data.get("address", seeker.address)
        seeker.summary = data.get("summary", seeker.summary)
        seeker.website = data.get("website", seeker.website)
        seeker.github = data.get("github", seeker.github)
        seeker.facebook = data.get("facebook", seeker.facebook)
        seeker.twitter = data.get("twitter", seeker.twitter)
        seeker.instagram = data.get("instagram", seeker.instagram)

        db.session.add(seeker)
        db.session.commit()
        return {
            "status": "Success!",
            "message": "Data Successfully Updated!"
        }, 200

    elif not seeker:
        return {
            "status": "Not Found",
            "message": "No jobseeker found with this id",
        }, 404

    else:
        return {
            "status": "Unauthorized",
            "message": "You have no access to this user",
        }, 401


# __________________________________________________Company Info__________________________________________________
@app.get("/company/<int:id>")
def getCompanyDetail(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    company = db.session.query(Company).filter(Company.id == id).first()

    response = {
        "id": company.id,
        "username": company.username,
        "email": company.email,
        "name": company.name,
        "about": company.about,
        "industry": company.industry,
        "address": company.address,
        "website": company.website,
        "github": company.github,
        "facebook": company.facebook,
        "twitter": company.twitter,
        "instagram": company.instagram,
        "contact": company.contact,
        "logo_url": company.logo_url,
        "est_date": company.est_date,
    }
    return {"message": "success", "response": response}, 200


@app.put("/company/<int:id>")
def updateCompany(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    company = db.session.query(Company).filter(Company.id == id).first()
    if user.get("id") == id:
        data = request.get_json()

        company.about = data.get("about", company.about)
        company.email = data.get("email", company.email)
        company.name = data.get("name", company.name)
        company.industry = data.get("industry", company.industry)
        company.address = data.get("address", company.address)
        company.website = data.get("website", company.website)
        company.github = data.get("github", company.github)
        company.facebook = data.get("facebook", company.facebook)
        company.twitter = data.get("twitter", company.twitter)
        company.instagram = data.get("instagram", company.instagram)
        company.contact = data.get("contact", company.contact)
        company.est_date = data.get("est_date", company.est_date)

        db.session.add(company)
        db.session.commit()
        return {
            "status": "Success!",
            "message": "Data Successfully Updated!"
        }, 200

    elif not company:
        return {
            "status": "Not Found",
            "message": "No company found with this id",
        }, 404

    else:
        return {
            "status": "Unauthorized",
            "message": "You have no access to this user",
        }, 401


# ________________________________________________Job Vacancy Info________________________________________________
@app.get("/jobs")
def getAllJobs():
    jobs = db.session.query(JobVacancy).all()
    response = [
        {
            "id": j.id,
            "company": j.company.name,
            "position": j.position,
            "salary": j.salary,
        }
        for j in jobs
    ]
    return {"count": len(response), "data": response}


@app.get("/jobs/<int:id>")
def getJobDetails(id):
    job = db.session.query(JobVacancy).filter(JobVacancy.id == id).first()
    if job:
        response = {
            "id": job.id,
            "company_id": job.company_id,
            "company_logo": job.company.logo_url,
            "company_name": job.company.name,
            "company_about": job.company.about,
            "position": job.position,
            "major": job.major,
            "job_type": job.job_type,
            "location": job.location,
            "posted_on": job.posted_on,
            "expired_on": job.expired_on,
            "salary": job.salary,
            "description": job.description,
            "requirements": job.requirements,
        }
        return {"status": "Success!", "data": response}, 200
    else:
        return {"status": "404 Not Found", "message": "Job is not found"}, 404


@app.post("/jobs")
def postJob():
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("1"):
        data = request.get_json()
        new_job = JobVacancy(
            company_id=user.get("id"),
            position=data.get("position"),
            major=data.get("major"),
            job_type=data.get("job_type"),
            location=data.get("location"),
            posted_on=datetime.today(),
            expired_on=datetime.today() + timedelta(int(data.get("available_for"))),
            salary=int(data.get("salary")),
            description=data.get("description"),
            requirements=data.get("requirements"),
        )

        conditions = db.and_(
            JobVacancy.company_id == new_job.company_id,
            JobVacancy.position == new_job.position,
            JobVacancy.location == new_job.location,
            JobVacancy.salary == new_job.salary,
        )

        existing_job = db.session.query(JobVacancy).filter(conditions).first()

        if existing_job:
            return {
                "status": "Posting Job failed!",
                "message": "Seems like the job you try to post is identical with existing job vacancy.",
            }, 400

        db.session.add(new_job)
        db.session.commit()
        return {"status": "Success!", "message": "Job has been added!"}, 201

    else:
        return {
            "status": "Unauthorized",
            "message": "Please login as company first",
        }, 401


@app.get("/company/jobs")
def getCompanyJobs():
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("1"):
        jobs = (
            db.session.query(JobVacancy).filter(JobVacancy.company_id == user.get("id")).all()
        )
        response = [
            {
                "id": j.id,
                "company": j.company.name,
                "job_type": j.job_type,
                "location": j.location,
                "position": j.position,
                "major": j.major,
                "salary": j.salary,
                "posted_on": j.posted_on,
                "expired_on": j.expired_on,
                "logo_url": j.company.logo_url,
            }
            for j in jobs
        ]
        return {"count": len(response), "data": response}, 200

    else:
        return {
            "status": "Unauthorized",
            "message": "Please login as company first",
        }, 401


@app.get("/company/jobs/<int:id>")
def getCompanyJobDetails(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("1"):
        job = (
            db.session.query(JobVacancy)
            .filter(JobVacancy.id == id)
            .filter(JobVacancy.company_id == user.get("id"))
            .first()
        )
        if job:
            response = {
                "id": job.id,
                "company_id": job.company_id,
                "position": job.position,
                "location": job.location,
                "posted_on": job.posted_on,
                "expired_on": job.expired_on,
                "salary": job.salary,
                "description": job.description,
                "requirements": job.requirements,
            }
            return {"status": "Success!", "data": response}, 200

        else:
            return {
                "status": "Not Found",
                "message": "Job not found in this company",
            }, 404

    else:
        return {
            "status": "Unauthorized",
            "message": "Please login as company first",
        }, 401


@app.put("/company/jobs/<int:id>")
def updateCompanyJob(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("1"):
        job = (
            db.session.query(JobVacancy)
            .filter(JobVacancy.id == id)
            .filter(JobVacancy.company_id == user.get("id"))
            .first()
        )
        data = request.get_json()

        if job:
            job.position = data.get("position", job.position)
            job.location = data.get("location", job.location)
            job.job_type = data.get("job_type", job.job_type)
            job.major = data.get("major", job.major)

            duration = data.get("available_for")
            salary = data.get("salary")
            if duration:
                job.expired_on = datetime.today() + timedelta(int(duration))

            if salary:
                job.salary = (int(data.get("salary")), job.salary)

            job.description = data.get("description", job.description)
            job.requirements = data.get("requirements", job.requirements)

            db.session.add(job)
            db.session.commit()
            return {
                "status": "Success!",
                "message": "Data Successfully Updated!"
            }, 200

        else:
            return {
                "status": "404 Not Found",
                "message": "Job not found in this company",
            }, 404

    else:
        return {
            "status": "Unauthorized",
            "message": "You have no access to this job",
        }, 401


@app.get("/jobseeker/savedjobs")
def getSavedJobs():
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("3"):
        subquery = (
            db.session.query(Application)
            .filter(Application.job_id == JobVacancy.id)
            .filter(Application.jobseeker_id == user.get("id"))
            .filter(Application.status == "saved")
            .exists()
        )
        jobs = (
            db.session.query(JobVacancy)
            .filter(subquery)
            .all()
        )
        response = [
            {
                "id": j.id,
                "company": j.company.name,
                "location": j.location,
                "position": j.position,
                "salary": j.salary,
                "posted_on": j.posted_on,
                "logo_url": j.company.logo_url,
            }
            for j in jobs
        ]
        return {"count": len(response), "data": response}

    else:
        return {
            "status": "Unauthorized",
            "message": "Please login as jobseeker first",
        }, 401


@app.get("/jobseeker/openjobs")
def getUnappliedJobs():
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("3"):
        subquery = (
            db.session.query(Application)
            .filter(Application.job_id == JobVacancy.id)
            .filter(Application.jobseeker_id == user.get("id"))
            .exists()
        )
        jobs = (
            db.session.query(JobVacancy)
            .filter(~subquery)
            .filter(JobVacancy.expired_on >= datetime.now())
            .all()
        )
        response = [
            {
                "id": j.id,
                "company": j.company.name,
                "location": j.location,
                "position": j.position,
                "salary": j.salary,
                "posted_on": j.posted_on,
                "logo_url": j.company.logo_url,
            }
            for j in jobs
        ]
        return {"count": len(response), "data": response}

    else:
        return {
            "status": "Unauthorized",
            "message": "Please login as jobseeker first",
        }, 401


# ________________________________________________Application Info________________________________________________
@app.post("/application")
def applyJob():
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    data = request.get_json()
    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("3"):
        new_app = Application(
            job_id=data.get("job_id"),
            jobseeker_id=user.get("id"),
            status=data.get("status"),
            cover_letter=data.get("cover_letter"),
        )

        existing_application = (
            db.session.query(Application)
            .filter(
                Application.job_id == new_app.job_id,
                Application.jobseeker_id == new_app.jobseeker_id,
                Application.status == new_app.status,
            )
            .first()
        )
        if existing_application:
            return {
                "status": "Apply failed!",
                "message": "You have applied this job before!",
            }, 400

        db.session.add(new_app)
        db.session.commit()
        return {"status": "Success!", "message": "Job applied!"}, 201

    else:
        return {
            "status": "Unauthorized",
            "message": "Please login as jobseeker first",
        }, 401


@app.delete("/application/<int:id>")
def deleteSavedJob(id):
    application = db.session.query(Application).filter(Application.id == id).first()
    
    db.session.delete(application)
    db.session.commit()
    return {"message": "Saved job removed!"}, 200


@app.put("/application/<int:id>")
def appResponse(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    application = db.session.query(Application).filter(Application.id == id).first()
    response = request.get_json()

    if not application:
        return {
            "status": "Not Found",
            "message": "No application found with this id",
        }, 404

    elif application.jobvacancy.company_id == user.get("id"):
        application.status = response.get("status", application.status)
        application.note = response.get("note", application.note)

        db.session.add(application)
        db.session.commit()
        return {"message": "Response has been added to application!"}, 200

    else:
        return {
            "status": "Unauthorized",
            "message": "You are not allowed to response this application",
        }, 401


@app.get("/application")
def getApps():
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("3"):
        # List of jobseeker's applied jobs and their status
        applications = (
            db.session.query(Application)
            .filter(Application.jobseeker_id == user.get("id"))
            .all()
        )
        response = [
            {
                "id": apps.id,
                "job_id": apps.job_id,
                "jobseeker_id": apps.jobseeker_id,
                "company": apps.jobvacancy.company.name,
                "location": apps.jobvacancy.location,
                "position": apps.jobvacancy.position,
                "salary": apps.jobvacancy.salary,
                "logo_url": apps.jobvacancy.company.logo_url,
                "status": apps.status,
                "note": apps.note,
            }
            for apps in applications
        ]
        return {"count": len(response), "data": response}, 200

    else:
        # List of applications received on user company for each vacancies
        subquery = (
            db.session.query(JobVacancy)
            .filter(JobVacancy.id == Application.job_id)
            .filter(JobVacancy.company_id == user.get("id"))
            .exists()
        )
        applications = (
            db.session.query(Application)
            .filter(subquery)
            .order_by(Application.id.asc())
            .all()
        )
        response = [
            {
                "id": apps.id,
                "position": apps.jobvacancy.position,
                "job_type": apps.jobvacancy.job_type,
                "location": apps.jobvacancy.location,
                "salary": apps.jobvacancy.salary,
                "applicant_name": apps.jobseeker.first_name + " " + apps.jobseeker.last_name,
                "applicant_pict": apps.jobseeker.url_pict,
                "status": apps.status,
                "note": apps.note,
            }
            for apps in applications
        ]
        return {"count": len(response), "data": response}, 200


@app.get("/application/<int:id>")
def getAppDetails(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    application = db.session.query(Application).filter(Application.id == id).first()
    # Accessible only to the owner of application and owner of a job
    if (
        application.jobseeker_id == user.get("id")
        or application.jobvacancy.company_id == user.get("id")
    ):
        response = {
            "id": application.id,
            "logo_url": application.jobvacancy.company.logo_url,
            "applicant_name": application.jobseeker.first_name + " " + application.jobseeker.last_name,
            "applicant_pict": application.jobseeker.url_pict,
            "company_name": application.jobvacancy.company.name,
            "salary": application.jobvacancy.salary,
            "job_id": application.job_id,
            "job_position": application.jobvacancy.position,
            "status": application.status,
            "cover_letter": application.cover_letter,
            "note": application.note,
        }
        return {"status": "Success!", "data": response}, 200

    elif not application:
        return {
            "status": "Not Found",
            "message": "No application found with this id",
        }, 404

    else:
        return {
            "status": "Unauthorized",
            "message": "This application id is not yours",
        }, 401


@app.get("/application/jobs/<int:id>")
def getJobApplicants(id):
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    applications = db.session.query(Application).filter(Application.job_id == id).all()
    if applications[0].jobvacancy.company_id == user.get("id"):
        response = {
            "job_id": applications[0].job_id,
            "job_position": applications[0].jobvacancy.position,
            "list_applicants": [
                {
                    "applicant": application.jobseeker.first_name,
                    "status": application.status,
                }
                for application in applications
            ],
        }
        return {"message": "Success!", "response": response}, 200

    elif not applications:
        return {
            "status": "Not Found",
            "message": "No application found with this id",
        }, 404

    else:
        return {
            "status": "Unauthorized",
            "message": "Owner of the job access only",
        }, 401


# ____________________________________________Search Jobseeker and Jobs___________________________________________
@app.get("/search/jobseeker")
def searchJobseeker():
    user = {
        "id": int(request.headers.get("id")),
        "isLoggedIn": bool(request.headers.get("isLoggedIn")),
    }

    if not user:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.get("id")).startswith("1"):
        filters = {}

        if "first_name" in request.args:
            filters["first_name"] = request.args.get("first_name")
        if "last_name" in request.args:
            filters["last_name"] = request.args.get("last_name")
        if "age" in request.args:
            filters["age"] = request.args.get("age")
        if "gender" in request.args:
            filters["gender"] = request.args.get("gender")
        if "education" in request.args:
            filters["education"] = request.args.get("education")
        if "major" in request.args:
            filters["major"] = request.args.get("major")

        query = db.session.query(JobSeeker)
        for field, value in filters.items():
            if field == "age":
                query = query.filter(JobSeeker.age >= value)
            else:
                query = query.filter(getattr(JobSeeker, field).ilike(f"%{value}%"))

        jobseekers = query.all()

        result = [
            {
                "id": js.id,
                "first_name": js.first_name,
                "last_name": js.last_name,
                "gender": js.gender,
            }
            for js in jobseekers
        ]
        return {
            "message": f"There are {len(result)} data(s) matched",
            "response": result,
        }, 200

    else:
        return {
            "status": "Unauthorized",
            "message": "Please login as company first",
        }, 401


@app.get("/search/jobs")
def searchJobs():
    filters = {}

    if "position" in request.args:
        filters["position"] = request.args.get("position")
    if "major" in request.args:
        filters["major"] = request.args.get("major")
    if "location" in request.args:
        filters["location"] = request.args.get("location")
    if "salary" in request.args:
        filters["salary"] = request.args.get("salary")
    if "job_type" in request.args:
        filters["job_type"] = request.args.get("job_type")

    query = db.session.query(JobVacancy)
    for field, value in filters.items():
        if field == "salary":
            query = query.filter(JobVacancy.salary >= value)
        else:
            query = query.filter(getattr(JobVacancy, field).ilike(f"%{value}%"))

    jobs = query.all()

    result = [
        {
            "id": j.id,
            "company": j.company.name,
            "job_type": j.job_type,
            "major": j.major,
            "location": j.location,
            "position": j.position,
            "salary": j.salary,
            "posted_on": j.posted_on,
            "logo_url": j.company.logo_url,
        }
        for j in jobs
    ]
    if len(result) > 0:
        return {
            "message": f"There are {len(result)} job(s) matched",
            "response": result,
        }, 200
    else:
        return {
            "message": "No jobs matched on the giving criteria"
        }


if __name__ == "__main__":
    app.run(debug=True)
