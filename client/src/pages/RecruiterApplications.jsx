import { useEffect, useState } from "react";

function RecruiterApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchApplications() {
            try {
                const response = await fetch("/api/applications", {
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
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
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status })
    }
);

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to update status");
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

    if (loading) {
        return (
            <main className="recruiter-applications">
                <h1>Applicants</h1>
                <p>Loading applicants...</p>
            </main>
        );
    }

    return (
        <main className="recruiter-applications">

            <div className="recruiter-applications-header">
                <div>
                    <p className="eyebrow">RECRUITER</p>

                    <h1>Applicants</h1>

                    <p>
                        Review candidates and manage their application status.
                    </p>
                </div>
            </div>

            {message && (
                <p className="application-message">
                    {message}
                </p>
            )}

            {applications.length === 0 ? (
                <div className="empty-applications">
                    <h2>No applications yet</h2>

                    <p>
                        Applications from candidates will appear here.
                    </p>
                </div>
            ) : (
                <section className="recruiter-applications-list">

                    {applications.map((application) => (
                        <article
                            className="recruiter-application-card"
                            key={application._id}
                        >
                            <div className="applicant-info">
                                <h2>
                                    {application.candidate?.name || "Unknown"}
                                </h2>

                                <p>
                                    {application.candidate?.email}
                                </p>
                            </div>

                            <div className="applied-job">
                                <span>Applied for</span>

                                <h3>
                                    {application.job?.title || "Job unavailable"}
                                </h3>

                                <p>
                                    {application.job?.company}
                                </p>
                            </div>

                            <div className="status-control">
                                <select
                                    value={application.status}
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