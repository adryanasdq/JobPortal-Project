from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_cors import CORS


# Initiation
app = Flask(__name__)
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://postgres:admin@localhost:5433/portproject"
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
    age = db.Column(db.Integer, db.CheckConstraint("age >= 0"))
    gender = db.Column(db.String, db.CheckConstraint("gender IN ('L', 'P')"))
    education = db.Column(db.String)
    major = db.Column(db.String)
    contact = db.Column(db.String, nullable=False, unique=True)
    address = db.Column(db.String, nullable=False)
    summary = db.Column(db.Text)
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
    contact = db.Column(db.String, nullable=False, unique=True)
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
    job_id = db.Column(
        db.Integer, db.ForeignKey("portaljob.job_vacancy.id"), primary_key=True
    )
    jobseeker_id = db.Column(
        db.Integer, db.ForeignKey("portaljob.job_seeker.id"), primary_key=True
    )
    status = db.Column(
        db.String, db.CheckConstraint("status IN ('applied', 'accepted', 'rejected')")
    )
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
        .filter(JobSeeker.password == password)
        .first()
    )

    company = (
        db.session.query(Company)
        .filter(Company.username == username)
        .filter(Company.password == password)
        .first()
    )

    global loginFailed
    loginFailed = False

    if jobseeker:
        return str(jobseeker.id)

    elif company:
        return str(company.id)

    else:
        loginFailed = True
        return {"message": "Login Failed!"}, 400


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
    user = login()
    seeker = db.session.query(JobSeeker).filter(JobSeeker.id == id).first()
    company_applied = (
        db.session.query(JobVacancy)
        .join(Application, Application.job_id == JobVacancy.id)
        .filter(Application.jobseeker_id == id)
    )

    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    # Only the owner and the company to which the owner applied have access
    elif user.id == id or user.id in [
        company.company_id for company in company_applied
    ]:
        response = {
            "id": seeker.id,
            "email": seeker.email,
            "first_name": seeker.first_name,
            "last_name": seeker.last_name,
            "age": seeker.age,
            "gender": seeker.gender,
            "education": seeker.education,
            "major": seeker.major,
            "contact": seeker.contact,
            "address": seeker.address,
            "summary": seeker.summary,
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
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    seeker = db.session.query(JobSeeker).filter(JobSeeker.id == id).first()
    if user.id == id:
        data = request.get_json()

        seeker.password = data.get("password", seeker.password)
        seeker.email = data.get("email", seeker.email)
        seeker.first_name = data.get("first_name", seeker.first_name)
        seeker.last_name = data.get("last_name", seeker.last_name)

        dob = data.get("date of birth")
        if dob:
            convertedDob = datetime.strptime(dob, "%Y-%m-%d")
            seeker.age = ((datetime.now() - convertedDob).days) // 365

        seeker.gender = data.get("gender", seeker.gender)
        seeker.education = data.get("education", seeker.education)
        seeker.major = data.get("major", seeker.major)
        seeker.contact = data.get("contact", seeker.contact)
        seeker.address = data.get("address", seeker.address)
        seeker.summary = data.get("summary", seeker.summary)

        db.session.add(seeker)
        db.session.commit()
        return {"message": "Data Successfully Updated!"}, 200

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
@app.put("/company/<int:id>")
def updateCompany(id):
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    company = db.session.query(Company).filter(Company.id == id).first()
    if user.id == id:
        data = request.get_json()

        company.password = data.get("password", company.password)
        company.email = data.get("email", company.email)
        company.name = data.get("name", company.name)
        company.industry = data.get("industry", company.industry)
        company.address = data.get("address", company.address)
        company.website = data.get("website", company.website)
        company.contact = data.get("contact", company.contact)

        db.session.add(company)
        db.session.commit()
        return {"message": "Data Successfully Updated!"}, 200

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
            "company": job.company.name,
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
        return {"status": "404 Not Found", "message": "Job is not found"}, 404


@app.post("/jobs")
def postJob():
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.id).startswith("1"):
        data = request.get_json()
        new_job = JobVacancy(
            company_id=user.id,
            position=data.get("position"),
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
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.id).startswith("1"):
        jobs = (
            db.session.query(JobVacancy).filter(JobVacancy.company_id == user.id).all()
        )
        response = [
            {
                "id": j.id,
                "position": j.position,
                "expired_on": j.expired_on,
                "salary": j.salary,
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
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.id).startswith("1"):
        job = (
            db.session.query(JobVacancy)
            .filter(JobVacancy.id == id)
            .filter(JobVacancy.company_id == user.id)
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
    user = login()

    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.id).startswith("1"):
        job = (
            db.session.query(JobVacancy)
            .filter(JobVacancy.id == id)
            .filter(JobVacancy.company_id == user.id)
            .first()
        )
        data = request.get_json()

        if job:
            job.position = data.get("position", job.position)
            job.location = data.get("location", job.location)

            duration = data.get("available_for")
            salary = data.get("salary")
            if duration:
                job.expired_on = job.posted_on + timedelta(int(duration))

            if salary:
                job.salary = (int(data.get("salary")), job.salary)

            job.description = data.get("description", job.description)
            job.requirements = data.get("requirements", job.requirements)

            db.session.add(job)
            db.session.commit()
            return {"message": "Data Successfully Updated!"}, 200

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


@app.get("/jobseeker/jobs")
def getUnappliedJobs():
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.id).startswith("3"):
        subquery = (
            db.session.query(Application)
            .filter(Application.job_id == JobVacancy.id)
            .filter(Application.jobseeker_id == user.id)
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
                "position": j.position,
                "expired_on": j.expired_on,
                "salary": j.salary,
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
    user = login()
    data = request.get_json()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.id).startswith("3"):
        new_app = Application(
            job_id=data.get("job_id"),
            jobseeker_id=user.id,
            status="applied",
            cover_letter=data.get("cover_letter"),
        )

        existing_application = (
            db.session.query(Application)
            .filter(
                Application.job_id == new_app.job_id,
                Application.jobseeker_id == new_app.jobseeker_id,
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


@app.put("/application/<int:id>")
def appResponse(id):
    user = login()
    if loginFailed:
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

    elif application.jobvacancy.company_id == user.id:
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
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.id).startswith("3"):
        # List of jobseeker's applied jobs and their status
        applications = (
            db.session.query(Application)
            .filter(Application.jobseeker_id == user.id)
            .all()
        )
        response = [
            {
                "id": apps.id,
                "position": apps.jobvacancy.position,
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
            .filter(JobVacancy.company_id == user.id)
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
                "applicant": apps.jobseeker.first_name,
                "status": apps.status,
                "note": apps.note,
            }
            for apps in applications
        ]
        return {"count": len(response), "data": response}, 200


@app.get("/application/<int:id>")
def getDetailApps(id):
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    application = db.session.query(Application).filter(Application.id == id).first()
    # Accessible only to the owner of application and owner of a job
    if (
        application.jobseeker_id == user.id
        or application.jobvacancy.company_id == user.id
    ):
        response = {
            "id": application.id,
            "job_id": application.job_id,
            "job_position": application.jobvacancy.position,
            "job_applicant": application.jobseeker.first_name,
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
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    applications = db.session.query(Application).filter(Application.job_id == id).all()
    if applications[0].jobvacancy.company_id == user.id:
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
    user = login()
    if loginFailed:
        return {
            "status": "Unauthorized",
            "message": "Please check username and password!",
        }, 401

    elif str(user.id).startswith("1"):
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

    query = db.session.query(JobVacancy)
    for field, value in filters.items():
        if field == "salary":
            query = query.filter(JobVacancy.salary >= value)
        else:
            query = query.filter(getattr(JobVacancy, field).ilike(f"%{value}%"))

    jobs = query.all()

    result = [
        {
            "company": j.company.name,
            "location": j.location,
            "position": j.position,
            "salary": j.salary,
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
