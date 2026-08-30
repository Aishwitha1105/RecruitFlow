import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function RecruiterJobDetails() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchJob() {
            try {
                const response = await fetch(`/api/jobs/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch job"
                    );
                }

                setJob(data);

            } catch (error) {
                console.log("Recruiter job error:", error);
                setError(
                    error.message || "Unable to load job."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <main className="recruiter-job-details">
                <div className="job-details-container">
                    <p className="job-details-message">
                        Loading job...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="recruiter-job-details">
                <div className="job-details-container">
                    <p className="job-details-error">
                        {error}
                    </p>

                    <Link
                        to="/recruiter/dashboard"
                        className="back-dashboard-button"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    if (!job) {
        return (
            <main className="recruiter-job-details">
                <div className="job-details-container">
                    <p className="job-details-error">
                        Job not found.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="recruiter-job-details">

            <div className="job-details-container">

                {/* HEADER */}

                <section className="recruiter-job-header">

                    <p className="eyebrow">
                        RECRUITER
                    </p>

                    <h1>
                        {job.title}
                    </h1>

                    <p className="company-name">
                        {job.company}
                    </p>

                    <div className="job-meta">

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

                </section>


                {/* DESCRIPTION */}

                <section className="recruiter-job-section">

                    <h2>
                        Job Description
                    </h2>

                    <p>
                        {job.description || "No description provided."}
                    </p>

                </section>


                {/* SKILLS */}

                <section className="recruiter-job-section">

                    <h2>
                        Required Skills
                    </h2>

                    <p>
                        {job.skills || "No skills specified."}
                    </p>

                </section>


                {/* STATUS */}

                <section className="recruiter-job-section">

                    <h2>
                        Job Status
                    </h2>

                    <div className="job-status-info">

                        <div>
                            <span>Status</span>

                            <strong>
                                {job.status || "active"}
                            </strong>
                        </div>

                        <div>
                            <span>Applicants</span>

                            <strong>
                                {job.noofapplicants || 0}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* ACTION BUTTONS */}

                <section className="recruiter-job-actions">

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

                </section>

            </div>

        </main>
    );
}

export default RecruiterJobDetails;