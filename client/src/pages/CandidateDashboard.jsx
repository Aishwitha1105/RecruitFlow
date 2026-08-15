import JobCard from "../components/JobCard";
function CandidateDashboard(){
    const jobs = [
  {
    title: "Frontend Developer",
    company: "TechNova",
    matchScore: "87%"
  },
  {
    title: "React Developer",
    company: "InnovateLabs",
    matchScore: "82%"
  },
  {
    title: "Software Engineer",
    company: "CloudWorks",
    matchScore: "76%"
  }
];
    return(
        <main className="dashboard">
            <section className="dashboard-header">
                <h1>Candidate Dashboard</h1>
        <p>Find opportunities that match your skills.</p>
            </section>
            <section className="jobs-section">
                <h2>Recommended Jobs</h2>
                <div className="jobs-grid">
                  {jobs.map((job)=>(
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