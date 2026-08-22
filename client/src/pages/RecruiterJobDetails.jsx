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
                const response = await fetch(`/api/jobs/${id}`);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch job"
                    );
                }

                setJob(data);

            } catch (error) {
                console.log("Recruiter job error:", error);
                setError("Unable to load job.");
            } finally {
                setLoading(false);
            }
        }

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <main>
                <p>Loading job...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <p>{error}</p>
            </main>
        );
    }

    if (!job) {
        return (
            <main>
                <p>Job not found.</p>
            </main>
        );
    }

    return (
        <main className="recruiter-job-details">

            <section>
                <p className="eyebrow">
                    RECRUITER
                </p>

                <h1>
                    {job.title}
                </h1>

                <p>
                    {job.company}
                </p>

                <p>
                    📍 {job.location}
                </p>

                <p>
                    💼 {job.jobType}
                </p>
            </section>

            <section>
                <h2>
                    Job Description
                </h2>

                <p>
                    {job.description}
                </p>
            </section>

            <section>
                <h2>
                    Required Skills
                </h2>

                <p>
                    {job.skills}
                </p>
            </section>

            <section>
                <h2>
                    Experience
                </h2>

                <p>
                    {job.experience}
                </p>
            </section>

            <section>
                <h2>
                    Job Status
                </h2>

                <p>
                    {job.status}
                </p>

                <p>
                    Applicants: {job.noofapplicants || 0}
                </p>
            </section>

            <Link to="/recruiter/applications">
                View Applicants
            </Link>

        </main>
    );
}

export default RecruiterJobDetails;