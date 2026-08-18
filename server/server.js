const express=require('express');
const connectDB=require('./config/db');
const Job=require('./models/Job');
const cors = require("cors");
const app=express();
app.use(express.json());
connectDB();
const PORT=5000;
app.post("/api/jobs", async (req, res) => {
    try {
        const job = await Job.create(req.body);

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create job"
        });
    }
});
app.get("/api/jobs",async (req,res)=>{
    try{
        const jobs=await Job.find();
        res.json(jobs);
    }catch(error){
        res.status(500).json({message:"Failed to fetch jobs"});
    }
});
app.get('/api/test',(req,res)=>{
res.json("RecruitFlow is working");
});
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});