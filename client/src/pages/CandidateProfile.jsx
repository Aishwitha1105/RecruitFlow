import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function CandidateProfile() {
    const { candidateId } = useParams();

    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCandidate() {
            try {
                const response = await fetch(
                    `/api/recruiter/candidates/${candidateId}`,
                    {
                        headers: {
                            "Authorization":
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch candidate"
                    );
                }

                setCandidate(data);

            } catch (error) {
                console.log(
                    "Candidate error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load candidate."
                );

            } finally {
                setLoading(false);
            }
        }

        fetchCandidate();
    }, [candidateId]);

    if (loading) {
        return (
            <main className="candidate-profile-page">
                <p>Loading candidate...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="candidate-profile-page">
                <p className="error-message">
                    {error}
                </p>

                <Link
                    to="/recruiter/applications"
                    className="back-link"
                >
                    ← Back to Applicants
                </Link>
            </main>
        );
    }

    return (
        <main className="candidate-profile-page">

            <div className="candidate-profile-header">

                <div>
                    <span className="section-label">
                        CANDIDATE
                    </span>

                    <h1>
                        {candidate?.name || "Unknown Candidate"}
                    </h1>

                    <p>
                        {candidate?.email || "No email available"}
                    </p>
                </div>

                <Link
                    to="/recruiter/applications"
                    className="back-link"
                >
                    ← Back to Applicants
                </Link>

            </div>

            {/* CANDIDATE INFORMATION */}

            <section className="candidate-profile-card">

                <h2>
                    Candidate Information
                </h2>

                <div className="candidate-details">

                    <div>
                        <span>Name</span>

                        <strong>
                            {candidate?.name || "Not available"}
                        </strong>
                    </div>

                    <div>
                        <span>Email</span>

                        <strong>
                            {candidate?.email || "Not available"}
                        </strong>
                    </div>

                    <div>
                        <span>Role</span>

                        <strong>
                            {candidate?.role || "Candidate"}
                        </strong>
                    </div>

                </div>

            </section>

            {/* SKILLS */}

            <section className="candidate-profile-card">

                <h2>
                    Skills
                </h2>

                {candidate?.skills?.length > 0 ? (

                    <div className="candidate-skills">

                        {candidate.skills.map(
                            (skill) => (
                                <span key={skill}>
                                    {skill}
                                </span>
                            )
                        )}

                    </div>

                ) : (

                    <p>
                        No skills have been added yet.
                    </p>

                )}

            </section>

            {/* RESUME */}

            <section className="candidate-profile-card">

                <h2>
                    Resume
                </h2>

                {candidate?.resume?.fileName ? (

                    <div className="candidate-resume">

                        <div>
                            <span>
                                Resume
                            </span>

                            <strong>
                                {candidate.resume.originalName}
                            </strong>
                        </div>

                        {candidate.resume.uploadedAt && (
                            <p>
                                Uploaded on{" "}
                                {new Date(
                                    candidate.resume.uploadedAt
                                ).toLocaleDateString()}
                            </p>
                        )}

                        <a
                            href={`http://localhost:5000/uploads/${candidate.resume.fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-resume-button"
                        >
                            View Resume
                        </a>

                    </div>

                ) : (

                    <p>
                        No resume uploaded yet.
                    </p>

                )}

            </section>

        </main>
    );
}

export default CandidateProfile;