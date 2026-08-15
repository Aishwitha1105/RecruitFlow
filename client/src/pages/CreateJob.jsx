import {useState} from "react";
function CreateJob(){
    const[jobData,setJobData]=useState({
        title:"",
        company:"",
        location:"",
        jobType:"",
        skills:"",
        experience:"",
        description:""
    });
    function handleSubmit(e){
        e.preventDefault();
        console.log(jobData);
    }
    return(
        <main>
            <h1>Create Job</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" value={jobData.title} onChange={(e)=>setJobData({...jobData,title:e.target.value})}/>
                </div>
                <div>
                    <label>Company</label>
                    <input type="text" value={jobData.company} onChange={(e)=>setJobData({...jobData,company:e.target.value})}/>
                </div>
                <div>
                    <label>Location</label>
                    <input type="text" value={jobData.location} onChange={(e)=>setJobData({...jobData,location:e.target.value})}/>
                </div>
                <div>
                    <label>Job Type</label>
                    <select value={jobData.jobType} onChange={(e)=>setJobData({...jobData,jobType:e.target.value})}>
                        <option value="">Select Job Type</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="internship">Intership</option>
                    </select>
                </div>
                <div>
                    <label>Skills</label>
                    <input type="text" value={jobData.skills} onChange={(e)=>setJobData({...jobData,skills:e.target.value})}/>
                </div>
                <div>
                    <label>Experience</label>
                    <textarea value={jobData.experience} onChange={(e)=>setJobData({...jobData,experience:e.target.value})}/>
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" value={jobData.description} onChange={(e)=>setJobData({...jobData,description:e.target.value})}/>
                </div>
                <button>Create Job</button>
            </form>
        </main>
    );
}
export default CreateJob;