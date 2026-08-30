import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecruiterApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchApplications() {
            try {
                const response = await fetch("/api/applications", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();

                console.log("Applications received:", data);

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch applications"
                    );
                }

                setApplications(data);
            } catch (error) {
                console.log("Fetch applications error:", error);
                setMessage("Failed to load applicants.");
            } finally {
                setLoading(false);
            }
        }

        fetchApplications();
    }, []);

    async function updateStatus(applicationId, status) {
        try {
            const response = await fetch(
                `/api/applications/${applicationId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to update status"
                );
                return;
            }

            setMessage("Application status updated successfully.");

            setApplications((currentApplications) =>
                currentApplications.map((application) =>
                    application._id === applicationId
                        ? data.application
                        : application
                )
            );
        } catch (error) {
            console.log("Update status error:", error);
            setMessage("Failed to update application status.");
        }
    }

    function getStatusClass(status) {
        switch (status) {
            case "shortlisted":
                return "status-shortlisted";

            case "rejected":
                return "status-rejected";

            case "under-review":
                return "status-review";

            default:
                return "status-applied";
        }
    }

    if (loading) {
        return (
            <main className="recruiter-applications">
                <div className="applications-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading applicants...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="recruiter-applications">

            {/* PAGE HEADER */}
            <div className="recruiter-applications-header">
                <div>
                    <p className="eyebrow">
                        RECRUITER
                    </p>

                    <h1>
                        Applicants
                    </h1>

                    <p className="applications-subtitle">
                        Review candidates and manage their application status.
                    </p>
                </div>

                <div className="application-count">
                    <span>
                        {applications.length}
                    </span>

                    <small>
                        {applications.length === 1
                            ? "Application"
                            : "Applications"}
                    </small>
                </div>
            </div>

            {/* MESSAGE */}
            {message && (
                <div className="application-message">
                    {message}
                </div>
            )}

            {/* EMPTY STATE */}
            {applications.length === 0 ? (
                <div className="empty-applications">

                    <div className="empty-icon">
                        👤
                    </div>

                    <h2>
                        No applications yet
                    </h2>

                    <p>
                        Applications from candidates will appear here.
                    </p>

                </div>
            ) : (

                /* APPLICATION LIST */
                <section className="recruiter-applications-list">

                    {applications.map((application) => (

                        <article
                            className="recruiter-application-card"
                            key={application._id}
                        >

                            {/* CANDIDATE */}
                            <div className="applicant-info">

                                <div className="candidate-avatar">
                                    {application.candidate?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "?"}
                                </div>

                                <div className="candidate-main-info">

                                    <h2>
                                        {application.candidate?.name ||
                                            "Unknown Candidate"}
                                    </h2>

                                    <p className="candidate-email">
                                        {application.candidate?.email ||
                                            "No email available"}
                                    </p>

                                    <p className="application-date">
                                        Applied on{" "}
                                        {application.createdAt
                                            ? new Date(
                                                application.createdAt
                                            ).toLocaleDateString()
                                            : "Unknown date"}
                                    </p>

                                    <Link
                                        to={`/recruiter/candidates/${application.candidate?._id}`}
                                        className="view-candidate-button"
                                    >
                                        View Candidate
                                    </Link>

                                </div>

                            </div>

                            {/* JOB */}
                            <div className="applied-job">

                                <span className="job-label">
                                    APPLIED FOR
                                </span>

                                <h3>
                                    {application.job?.title ||
                                        "Job unavailable"}
                                </h3>

                                <p>
                                    {application.job?.company ||
                                        "Company unavailable"}
                                </p>

                                {application.job?.location && (
                                    <span className="job-location">
                                        📍 {application.job.location}
                                    </span>
                                )}

                            </div>

                            {/* STATUS */}
                            <div className="status-control">

                                <span className="status-label">
                                    STATUS
                                </span>

                                <select
                                    className={getStatusClass(
                                        application.status
                                    )}
                                    value={
                                        application.status || "applied"
                                    }
                                    onChange={(e) =>
                                        updateStatus(
                                            application._id,
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="applied">
                                        Applied
                                    </option>

                                    <option value="under-review">
                                        Under Review
                                    </option>

                                    <option value="shortlisted">
                                        Shortlisted
                                    </option>

                                    <option value="rejected">
                                        Rejected
                                    </option>

                                </select>

                            </div>

                        </article>
                    ))}

                </section>
            )}

        </main>
    );
}

export default RecruiterApplications;