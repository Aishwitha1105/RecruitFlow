import JobPosts from '../components/JobPosts';
function RecruiterDashboard(){
    const jobposts = [
  {
    title: "Frontend Developer",
    noofapplicants: 24,
    status: "active"
  },
  {
    title: "Backend Developer",
    noofapplicants: 18,
    status: "closed"
  }
];
    return(
        <main>
            <section className='recruiter-dashboard'>
                <h1>Recruiter Dashboard</h1>
                <p>Manage your job postings and find qualified candidates.</p>
            </section>
            <section className='job-posts'>
                <h3>Your Job Posts</h3>
                {
                    jobposts.map((job)=>(
                        <JobPosts
                        key={job.title}
                        title={job.title}
                        noofapplicants={job.noofapplicants}
                        status={job.status}
                        />
                    ))
                }
                <button>Create Job</button>
            </section>
        </main>
    );
}
export default RecruiterDashboard;