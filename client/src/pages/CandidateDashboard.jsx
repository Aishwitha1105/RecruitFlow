import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CandidateDashboard() {
    const [search, setSearch] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);
const [profileLoading, setProfileLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch(
                    `/api/jobs/matches/${user.id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch job matches");
                }

                const data = await response.json();

                setJobs(data);

            } catch (error) {
                console.log(error);
                setError("Unable to load job matches.");
            } finally {
                setLoading(false);
            }
        }

        if (user?.id) {
            fetchJobs();
        }
        async function fetchProfile() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));

        const response = await fetch(
            `/api/users/${user.id}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        setProfile(data);
    } catch (error) {
        console.log("Profile error:", error);
    } finally {
        setProfileLoading(false);
    }
}

fetchProfile();
    }, []);

    const filteredJobs = jobs.filter((item) => {
        const job = item.job;
        const searchText = search.toLowerCase();

        return (
            job.title?.toLowerCase().includes(searchText) ||
            job.company?.toLowerCase().includes(searchText) ||
            job.skills?.toLowerCase().includes(searchText) ||
            job.location?.toLowerCase().includes(searchText)
        );
    });

    return (
        <main className="dashboard">

            <section className="dashboard-header">
                <span className="dashboard-label">
                    CANDIDATE
                </span>

                <h1>
                    Find your next opportunity.
                </h1>

                <p>
                    Discover jobs that match your skills and experience.
                </p>

                <br />

                <div className="dashboard-actions">

                    <Link
                        to="/applications"
                        className="my-applications-btn"
                    >
                        My Applications
                    </Link>

                    <Link
                        to="/candidate/skills"
                        className="my-applications-btn"
                    >
                        My Skills
                    </Link>
                    <Link
    to="/candidate/resume"
    className="my-applications-btn"
>
    Upload Resume
</Link>
                </div>
            </section>
<section className="resume-analysis">

    <div className="resume-analysis-header">
        <div>
            <span className="dashboard-label">
                RESUME ANALYSIS
            </span>

            <h2>
                Your resume insights
            </h2>
        </div>
    </div>

    {profileLoading ? (
        <p>Loading resume analysis...</p>
    ) : profile?.skills?.length > 0 ? (

        <div>
            <p>
                ✓ Resume analyzed
            </p>

            <p>
                ✓ {profile.skills.length} skills detected
            </p>

            <div className="detected-skills">
                {profile.skills.map((skill) => (
                    <span key={skill}>
                        {skill}
                    </span>
                ))}
            </div>
        </div>

    ) : (

        <div>
            <p>
                No resume analysis available yet.
            </p>
        </div>

    )}

</section>
            <section className="search-section">

                <div className="search-box">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search by job title, company, skill or location..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

            </section>

            <section className="jobs-section">

                <div className="jobs-section-header">

                    <div>
                        <h2>
                            Recommended Jobs
                        </h2>

                        <p>
                            {filteredJobs.length} opportunities available
                        </p>
                    </div>

                </div>

                {loading && (
                    <div className="status-message">
                        Calculating your job matches...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && filteredJobs.length === 0 && (
                    <div className="status-message">
                        No jobs found.
                    </div>
                )}

                <div className="jobs-grid">

                    {filteredJobs.map((item) => {

                        const job = item.job;

                        return (

                            <article
                                className="job-card"
                                key={job._id}
                            >

                                <div className="job-card-top">

                                    <div className="company-logo">
                                        {job.company?.charAt(0)}
                                    </div>

                                    <span className="job-type">
                                        {job.jobType}
                                    </span>

                                </div>

                                {/* MATCH SCORE */}
                                {/* MATCH SCORE */}

<div className="match-section">

    <div className="match-header">
        <span>Job Match</span>

        <strong>
            {item.matchPercentage}%
        </strong>
    </div>

    <div className="match-bar">
        <div
            className="match-bar-fill"
            style={{
                width: `${item.matchPercentage}%`
            }}
        ></div>
    </div>

</div>

                                <h2>
                                    {job.title}
                                </h2>

                                <p className="company-name">
                                    {job.company}
                                </p>

                                <div className="job-meta">

                                    <span>
                                        📍 {job.location}
                                    </span>

                                    <span>
                                        💼 {job.experience}
                                    </span>

                                </div>

                                <div className="skills">

                                    {job.skills
                                        ?.split(",")
                                        .slice(0, 4)
                                        .map((skill) => (
                                            <span key={skill}>
                                                {skill.trim()}
                                            </span>
                                        ))}

                                </div>

                                {/* MATCH DETAILS */}

                                {/* MATCH DETAILS */}

{/* MATCH DETAILS */}

<div className="match-details">

    {/* EXACT MATCHES */}
    {item.matchedSkills?.length > 0 && (
        <div className="match-skills">

            <h4>✓ Skills you have</h4>

            <div className="skill-tags">

                {item.matchedSkills.map((skill) => (
                    <span key={skill}>
                        {skill}
                    </span>
                ))}

            </div>

        </div>
    )}

    {/* AI MATCHES */}
    {item.aiMatchedSkills?.length > 0 && (
        <div className="ai-match-skills">

            <h4>✨ AI-assisted matches</h4>

            <div className="ai-match-list">

                {item.aiMatchedSkills.map((match, index) => (
                    <div
                        className="ai-match-item"
                        key={`${match.jobSkill}-${match.candidateSkill}-${index}`}
                    >

                        <div className="ai-match-skills-row">

                            <span className="ai-candidate-skill">
                                {match.candidateSkill}
                            </span>

                            <span className="ai-arrow">
                                →
                            </span>

                            <span className="ai-job-skill">
                                {match.jobSkill}
                            </span>

                        </div>

                        {match.confidence && (
                            <span className="ai-confidence">
                                {Math.round(match.confidence * 100)}% confidence
                            </span>
                        )}

                    </div>
                ))}

            </div>

        </div>
    )}

    {/* MISSING SKILLS */}
    {item.missingSkills?.length > 0 && (
        <div className="missing-skills">

            <h4>Missing skills</h4>

            <div className="skill-tags">

                {item.missingSkills.map((skill) => (
                    <span key={skill}>
                        {skill}
                    </span>
                ))}

            </div>

        </div>
    )}

    {/* EXPLANATION */}
    <div className="match-explanation">

        <strong>
            Why this job matches
        </strong>

        <p>

            Your profile has{" "}
            <strong>
                {item.matchedSkills?.length || 0}
            </strong>{" "}
            exact skill match
            {(item.matchedSkills?.length || 0) !== 1 ? "es" : ""}.

            {item.aiMatchedSkills?.length > 0 && (
                <>
                    {" "}AI also identified{" "}
                    <strong>
                        {item.aiMatchedSkills.length}
                    </strong>{" "}
                    related skill
                    {item.aiMatchedSkills.length !== 1 ? "s" : ""}.
                </>
            )}

            {item.missingSkills?.length > 0 && (
                <>
                    {" "}You are missing{" "}
                    <strong>
                        {item.missingSkills.length}
                    </strong>{" "}
                    required skill
                    {item.missingSkills.length !== 1 ? "s" : ""}.
                </>
            )}

        </p>

    </div>

</div>
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="job-details-btn"
                                >
                                    View Details
                                </Link>

                            </article>
                        );
                    })}

                </div>

            </section>

        </main>
    );
}

export default CandidateDashboard;