function JobCard({ title, company, location, jobType, skills }) {
    return (
        <div>
            <h2>{title}</h2>
            <p>Company: {company}</p>
            <p>Location: {location}</p>
            <p>Job Type: {jobType}</p>
            <p>Skills: {skills}</p>
            <button>View Details</button>
        </div>
    );
}

export default JobCard;