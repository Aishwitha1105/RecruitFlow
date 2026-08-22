import { Link } from "react-router-dom";

function JobPosts({
     id,
    title,
    noofapplicants,
    status
}) {
    return (
        <article className="job-post-card">

            <h2>{title}</h2>

            <p>
                Applicants: {noofapplicants}
            </p>

            <p>
                Status: {status}
            </p>

            <button><Link to={`/recruiter/jobs/${id}`}>
    View
</Link></button>

        </article>
    );
}

export default JobPosts;