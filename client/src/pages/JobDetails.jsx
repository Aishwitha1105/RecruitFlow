import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function JobDetails() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applying, setApplying] = useState(false);
const [message, setMessage] = useState("");
async function handleApply() {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        setMessage("Please login before applying.");
        return;
    }

    const user = JSON.parse(storedUser);

    try {
        setApplying(true);
        setMessage("");

       const response = await fetch("/api/applications", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
        jobId: job._id
    })
});

        const data = await response.json();

        setMessage(data.message);

    } catch (error) {
        console.log("Application error:", error);
        setMessage("Something went wrong. Please try again.");
    } finally {
        setApplying(false);
    }
}
    useEffect(() => {
        async function fetchJob() {
            try {
                const response = await fetch(`/api/jobs/${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch job");
                }

                const data = await response.json();
                setJob(data);
            } catch (error) {
                console.log(error);
                setError("Unable to load job details.");
            } finally {
                setLoading(false);
            }
        }

        fetchJob();
    }, [id]);

    if (loading) {
        return <main className="job-details">Loading job...</main>;
    }

    if (error) {
        return <main className="job-details">{error}</main>;
    }

    if (!job) {
        return <main className="job-details">Job not found.</main>;
    }

    return (
        <main className="job-details">

            <Link to="/dashboard" className="back-link">
                ← Back to Jobs
            </Link>

            <section className="job-details-container">

                <div className="job-details-main">

                    <div className="job-details-header">

                        <div className="company-logo large">
                            {job.company?.charAt(0)}
                        </div>

                        <div>
                            <h1>{job.title}</h1>

                            <p className="company-name">
                                {job.company}
                            </p>

                            <div className="job-meta horizontal">
                                <span>{job.location}</span>
                                <span>{job.experience}</span>
                                <span>{job.jobType}</span>
                            </div>
                        </div>

                    </div>

                    <hr />

                    <section className="details-section">
                        <h2>Job Description</h2>
                        <p>{job.description}</p>
                    </section>

                    <section className="details-section">
                        <h2>Required Skills</h2>

                        <div className="skills">
                            {job.skills?.split(",").map((skill) => (
                                <span key={skill}>
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="details-section">
                        <h2>Experience</h2>
                        <p>{job.experience}</p>
                    </section>

                </div>

                <aside className="apply-card">

                    <h2>Interested in this role?</h2>

                    <p>
                        Apply now and track your application
                        through RecruitFlow.
                    </p>

                   <button
    className="primary-btn"
    onClick={handleApply}
    disabled={applying}
>
    {applying ? "Applying..." : "Apply Now"}
</button>

{message && (
    <p className="application-message">
        {message}
    </p>
)}

                    <p className="apply-note">
                        Your profile will be shared with the recruiter.
                    </p>

                </aside>

            </section>

        </main>
    );
}

export default JobDetails;