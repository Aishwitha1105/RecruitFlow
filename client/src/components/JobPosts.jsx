function JobPosts({title,noofapplicants,status}){
    return(
        <div>
            <h2>{title}</h2>
            <p>{noofapplicants}</p>
            <p>{status}</p>
            <button>View</button>
        </div>
    );
}
export default JobPosts;