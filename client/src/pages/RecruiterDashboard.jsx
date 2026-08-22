import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobPosts from "../components/JobPosts";

function RecruiterDashboard() {

    const [jobposts, setJobposts] = useState([]);

    useEffect(() => {

        async function fetchJobs() {

            try {

                const response = await fetch("/api/jobs", {
                    headers: {
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();

                console.log("Recruiter jobs:", data);

                setJobposts(data);

            } catch (error) {

                console.log(
                    "Error fetching jobs:",
                    error
                );

            }
        }

        fetchJobs();

    }, []);

    return (

        <main className="recruiter-page">

            {/* HEADER */}

            <section className="recruiter-dashboard">

                <div>

                    <span className="recruiter-eyebrow">
                        RECRUITER
                    </span>

                    <h1>
                        Manage your hiring.
                    </h1>

                    <p>
                        Manage your job postings and find qualified candidates.
                    </p>

                </div>

                <Link
                    to="/recruiter/create-job"
                    className="create-job-button"
                >
                    + Create Job
                </Link>

            </section>


            {/* JOB POSTS */}

            <section className="job-posts">

                <div className="job-posts-header">

                    <div>

                        <span className="section-label">
                            JOB POSTINGS
                        </span>

                        <h2>
                            Your Job Posts
                        </h2>

                        <p>
                            Manage your active opportunities and applicants.
                        </p>

                    </div>

                    <div className="job-count">
                        {jobposts.length}
                        <span>Jobs</span>
                    </div>

                </div>


                {jobposts.length === 0 ? (

                    <div className="empty-jobs">

                        <h3>
                            No job posts yet
                        </h3>

                        <p>
                            Create your first job posting to start finding candidates.
                        </p>

                        <Link
                            to="/recruiter/create-job"
                            className="create-job-button"
                        >
                            Create Your First Job
                        </Link>

                    </div>

                ) : (

                    <div className="recruiter-job-grid">

                        {jobposts.map((job) => (

                            <div
                                className="recruiter-job-card"
                                key={job._id}
                            >

                                <div className="job-card-header">

                                    <div className="company-icon">
                                        {job.company?.charAt(0)}
                                    </div>

                                    <span
                                        className={
                                            job.status === "active"
                                                ? "status active"
                                                : "status"
                                        }
                                    >
                                        {job.status || "active"}
                                    </span>

                                </div>


                                <h3>
                                    {job.title}
                                </h3>

                                <p className="recruiter-company">
                                    {job.company}
                                </p>


                                <div className="recruiter-job-info">

                                    <span>
                                        📍 {job.location}
                                    </span>

                                    <span>
                                        💼 {job.jobType}
                                    </span>

                                    <span>
                                        🎓 {job.experience}
                                    </span>

                                </div>


                                <div className="applicant-box">

                                    <div>

                                        <strong>
                                            {job.noofapplicants || 0}
                                        </strong>

                                        <span>
                                            Applicants
                                        </span>

                                    </div>

                                    <span className="applicant-icon">
                                        👥
                                    </span>

                                </div>


                                <div className="job-card-actions">

                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="view-job-button"
                                    >
                                        View Job
                                    </Link>

                                    <Link
                                        to="/recruiter/applications"
                                        className="view-applicants-button"
                                    >
                                        View Applicants
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default RecruiterDashboard;