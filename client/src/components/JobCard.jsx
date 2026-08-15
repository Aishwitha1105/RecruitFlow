function JobCard({title,company,matchScore}){
    return(
       <div className="job-card">
        <h2>{title}</h2>
        <p>{company}</p>
        <p>Match Score:{matchScore}</p>
        <button>View Details</button>
       </div>
    );
}
export default JobCard;