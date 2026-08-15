import JobPosts from '../components/JobPosts';
function RecruiterDashboard(){
    const jobposts = [
  {
    title: "Frontend Developer",
    noofapplicants: 24,
    status: "active",
    applicants: [
        {
            name: "Rahul Kumar",
            skills: "React, JavaScript, Node.js",
            matchScore: "91%"
        },
        {
            name: "Priya Sharma",
            skills: "React, HTML, CSS",
            matchScore: "86%"
        }
    ]
},
 {
    title: "Backend Developer",
    noofapplicants: 18,
    status: "closed",
    applicants: [
        {
            name: "Arjun Reddy",
            skills: "Node.js, Express, MongoDB",
            matchScore: "89%"
        },
        {
            name: "Sneha Rao",
            skills: "Python, Django, PostgreSQL",
            matchScore: "84%"
        }
    ]
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
                        applicants={job.applicants}
                        />
                    ))
                }
                <button>Create Job</button>
            </section>
        </main>
    );
}
export default RecruiterDashboard;