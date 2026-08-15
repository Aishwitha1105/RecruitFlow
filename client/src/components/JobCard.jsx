function JobCard({ title, company, matchScore }) {
    const score = parseInt(matchScore);
    return (
        <div className="job-card">
            <h2>{title}</h2>
            <p>{company}</p>
            <div className="match-section">
                <div className="match-header">
                    <span>Match Score</span>
                    <span>{matchScore}</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress"
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
            </div>
            <Link to="/jobdetails">View Details</Link>
        </div>
    );
}
export default JobCard;