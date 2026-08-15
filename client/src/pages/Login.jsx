import { useState } from "react";
function Login(){
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    return(
        <main>
        <h1>Login</h1>
        <p>Login to your RecruitFlow account</p>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <button>Login</button>
        </form>
        </main>
    );
    function handleSubmit(e){
        e.preventDefault();
        console.log("Email",email);
        console.log("Password",password);
    }
}
export default Login;