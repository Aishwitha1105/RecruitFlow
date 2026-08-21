import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobPosts from "../components/JobPosts";

function RecruiterDashboard() {
    const [jobposts, setJobposts] = useState([]);
    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch("/api/jobs");
                const data = await response.json();

                console.log("Recruiter jobs:", data);

                setJobposts(data);
            } catch (error) {
                console.log("Error fetching jobs:", error);
            }
        }

        fetchJobs();
    }, []);

    return (
        <main>
            <section className="recruiter-dashboard">
                <h1>Recruiter Dashboard</h1>
                <p>Manage your job postings and find qualified candidates.</p>
            </section>

            <section className="job-posts">
                <h3>Your Job Posts</h3>

                {jobposts.map((job) => (
                    <JobPosts
                        key={job._id}
                        title={job.title}
                        noofapplicants={job.noofapplicants || 0}
                        status={job.status || "active"}
                    />
                ))}
<Link to="/recruiter/create-job">
    Create Job
</Link>
            </section>
        </main>
    );
}

export default RecruiterDashboard;