import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState("");

    async function fetchApplications(isInitialLoad = false) {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            setError("Please login to view your applications.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/my-applications", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch applications"
                );
            }

            // Check for status changes
            if (!isInitialLoad) {
                const previousApplications =
                    JSON.parse(
                        localStorage.getItem("candidateApplications") || "[]"
                    );

                for (const newApplication of data) {
                    const oldApplication =
                        previousApplications.find(
                            (item) =>
                                item._id === newApplication._id
                        );

                    if (
                        oldApplication &&
                        oldApplication.status !==
                            newApplication.status
                    ) {
                        const jobTitle =
                            newApplication.job?.title ||
                            "your job application";

                        const company =
                            newApplication.job?.company || "";

                        setNotification(
                            `Your application for ${jobTitle} at ${company} has been ${newApplication.status.replace(
                                "-",
                                " "
                            )}.`
                        );

                        break;
                    }
                }
            }

            // Save current applications
            localStorage.setItem(
                "candidateApplications",
                JSON.stringify(data)
            );

            setApplications(data);

        } catch (error) {
            console.log("Applications error:", error);
            setError("Unable to load your applications.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Initial load
        fetchApplications(true);

        // Check for status changes every 5 seconds
        const interval = setInterval(() => {
            fetchApplications(false);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <main className="my-applications">
                <h1>My Applications</h1>
                <p>Loading applications...</p>
            </main>
        );
    }

    return (
        <main className="my-applications">

            <div className="applications-header">

                <div>
                    <p className="eyebrow">
                        CANDIDATE
                    </p>

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track the status of your job applications.
                    </p>
                </div>

                <Link
                    to="/candidate/dashboard"
                    className="back-link"
                >
                    ← Browse Jobs
                </Link>

            </div>

            {/* NOTIFICATION */}

            {notification && (
                <div className="application-notification">

                    <div>
                        <strong>
                            🔔 Application Update
                        </strong>

                        <p>
                            {notification}
                        </p>
                    </div>

                    <button
                        onClick={() => setNotification("")}
                    >
                        ×
                    </button>

                </div>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!error && applications.length === 0 && (
                <div className="empty-applications">

                    <h2>
                        No applications yet
                    </h2>

                    <p>
                        Start exploring jobs and apply to
                        opportunities that match your skills.
                    </p>

                    <Link
                        to="/candidate/dashboard"
                        className="primary-btn"
                    >
                        Browse Jobs
                    </Link>

                </div>
            )}

            <section className="applications-list">

                {applications.map((application) => {

                    const job = application.job;

                    return (
                        <article
                            className="application-card"
                            key={application._id}
                        >

                            <div className="application-main">

                                <h2>
                                    {job?.title ||
                                        "Job unavailable"}
                                </h2>

                                {job && (
                                    <>
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

                                        </div>
                                    </>
                                )}

                                <p className="applied-date">
                                    Applied on{" "}
                                    {new Date(
                                        application.createdAt
                                    ).toLocaleDateString()}
                                </p>

                            </div>

                            <div className="application-status">

                                <span
                                    className={`status ${application.status}`}
                                >
                                    {application.status.replace(
                                        "-",
                                        " "
                                    )}
                                </span>

                                {job && (
                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="view-job-link"
                                    >
                                        View Job →
                                    </Link>
                                )}

                            </div>

                        </article>
                    );
                })}

            </section>

        </main>
    );
}

export default MyApplications;