import { useState } from "react";
import JobCard from "../components/JobCard";
function CandidateDashboard(){
  const[search,setSearch]=useState("");
  const[jobType,setJobType]=useState("");
   const jobs = [
  {
    title: "Frontend Developer",
    company: "TechNova",
    matchScore: "87%",
    jobType: "Full-time"
  },
  {
    title: "React Developer",
    company: "InnovateLabs",
    matchScore: "82%",
    jobType: "Internship"
  },
  {
    title: "Software Engineer",
    company: "CloudWorks",
    matchScore: "76%",
    jobType: "Full-time"
  }
];
const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) &&
    (jobType === "" || job.jobType === jobType)
);
    return(
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
<select
    value={jobType}
    onChange={(e) => setJobType(e.target.value)}
>
    <option value="">All Job Types</option>
    <option value="full-time">Full-time</option>
    <option value="part-time">Part Time</option>
    <option value="internship">Internship</option>
</select>
            <section className="jobs-section">
                <h2>Recommended Jobs</h2>
                <div className="jobs-grid">
                  {filteredJobs.map((job)=>(
             <JobCard
             key={job.title}
             title={job.title}
             company={job.company}
             matchScore={job.matchScore}
            />
            ))}  
                </div>
            </section>
        </main>
    );
}
export default CandidateDashboard;