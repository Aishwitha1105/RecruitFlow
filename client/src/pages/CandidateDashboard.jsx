import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";

function CandidateDashboard() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
    async function fetchJobs() {
        try {
            const response = await fetch("/api/jobs");

            console.log("Response status:", response.status);

            const data = await response.json();

            console.log("Jobs received:", data);

            setJobs(data);
        } catch (error) {
            console.log("Fetch error:", error);
        }
    }

    fetchJobs();
}, []);

    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="dashboard">

            <section className="dashboard-header">
                <h1>Candidate Dashboard</h1>
                <p>Find opportunities that match your skills.</p>
            </section>

            <section className="search-section">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </section>

            <p>Jobs loaded: {jobs.length}</p>

            <section className="jobs-section">
                <h2>Recommended Jobs</h2>

                {filteredJobs.map((job) => (
                    <JobCard
                        key={job._id}
                        title={job.title}
                        company={job.company}
                        location={job.location}
                        jobType={job.jobType}
                        skills={job.skills}
                    />
                ))}
            </section>

        </main>
    );
}

export default CandidateDashboard;