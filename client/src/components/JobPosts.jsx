function JobPosts({ title, noofapplicants, status }) {
    return (
        <div>
            <h2>{title}</h2>

            <p>Applicants: {noofapplicants}</p>

            <p>Status: {status}</p>

            <button>View</button>
        </div>
    );
}

export default JobPosts;