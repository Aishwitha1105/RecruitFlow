import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function RecruiterDashboard() {
    const [jobposts, setJobposts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch("/api/jobs", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();

                console.log("Recruiter jobs:", data);

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch jobs"
                    );
                }

                setJobposts(data);

            } catch (error) {
                console.log("Error fetching jobs:", error);
                setMessage("Unable to load your job postings.");
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <main className="recruiter-page">
                <section className="recruiter-dashboard">
                    <div>
                        <span className="recruiter-eyebrow">
                            RECRUITER
                        </span>

                        <h1>
                            Manage your hiring.
                        </h1>

                        <p>
                            Loading your job postings...
                        </p>
                    </div>
                </section>
            </main>
        );
    }

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
                        Manage your job postings and find qualified
                        candidates.
                    </p>
                </div>

                <Link
                    to="/recruiter/create-job"
                    className="create-job-button"
                >
                    + Create Job
                </Link>

            </section>


            {/* ERROR MESSAGE */}

            {message && (
                <div className="dashboard-message">
                    {message}
                </div>
            )}


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
                            Manage your active opportunities and
                            applicants.
                        </p>

                    </div>

                    <div className="job-count">
                        {jobposts.length}

                        <span>
                            Jobs
                        </span>
                    </div>

                </div>


                {jobposts.length === 0 ? (

                    <div className="empty-jobs">

                        <h3>
                            No job posts yet
                        </h3>

                        <p>
                            Create your first job posting to start
                            finding candidates.
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

                                {/* CARD HEADER */}

                                <div className="job-card-header">

                                    <div className="company-icon">
                                        {job.company
                                            ?.charAt(0)
                                            ?.toUpperCase() || "C"}
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


                                {/* JOB TITLE */}

                                <h3>
                                    {job.title}
                                </h3>

                                <p className="recruiter-company">
                                    {job.company}
                                </p>


                                {/* JOB INFORMATION */}

                                <div className="recruiter-job-info">

                                    <span>
                                        📍 {job.location || "Not specified"}
                                    </span>

                                    <span>
                                        💼 {job.jobType || "Not specified"}
                                    </span>

                                    <span>
                                        🎓 {job.experience || "Not specified"}
                                    </span>

                                </div>


                                {/* APPLICANTS */}

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


                                {/* ACTIONS */}

                                <div className="job-card-actions">

                                    <Link
                                        to={`/recruiter/jobs/${job._id}`}
                                        className="view-job-button"
                                    >
                                        View Job
                                    </Link>

                                    <Link
                                        to={`/recruiter/jobs/${job._id}/edit`}
                                        className="edit-job-button"
                                    >
                                        Edit Job
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