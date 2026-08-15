import { useState } from "react";
function Register(){
    const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: ""
});
    function handleSubmit(e){
        e.preventDefault();
        console.log(formData);
    }
    return(
        <main>
            <h1>Create Your RecruitFlow Account</h1>
            <p>Register as a candidate or recruiter.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                </div>
                <div><label>Email</label>
                <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})}/></div>
                <div>
                <label>Password</label>
                <input type="password" value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})}/>
            </div>
            <div>
                <label>Role</label>
                <select value={formData.role} onChange={(e)=>setFormData({...formData,role:e.target.value})}>
                    <option value="">Select Role</option>
                    <option value="candidate">Candidate</option>
                    <option value="recruiter">Recruiter</option>
                    </select>

            </div>
            <button>Register</button>
            </form>
        </main>
    );
}
export default Register;