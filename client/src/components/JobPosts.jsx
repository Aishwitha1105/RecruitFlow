import { useState } from "react";
function JobPosts({ title, noofapplicants, status, applicants }) {
    const [showApplicants, setShowApplicants] = useState(false);
    return (
        <div>
            <h2>{title}</h2>
            <p>{noofapplicants}</p>
            <p>{status}</p>
            <button
                onClick={() => setShowApplicants(!showApplicants)}
            >
                {showApplicants ? "Hide Applicants" : "View Applicants"}
            </button>
            {showApplicants && (
                <div>
                    <h3>Top Applicants</h3>
                    {applicants.map((applicant) => (
                        <div key={applicant.name}>
                            <h4>{applicant.name}</h4>
                            <p>{applicant.skills}</p>
                            <p>Match Score: {applicant.matchScore}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default JobPosts;