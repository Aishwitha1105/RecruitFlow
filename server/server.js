const express=require('express');
const connectDB=require('./config/db');
const Job=require('./models/Job');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User=require('./models/User');  
const Recruiter=require('./models/Recruiter'); 
require("dotenv").config(); 
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
app.post("/api/register",async (req,res)=>{
try{
    const{name,email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(500).json({message:"User already exists"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await User.create({
        name,
        email,
        password:hashedPassword,
        role:"candidate"
    });
    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }
    });
}catch(error){
    console.log(error);
    res.status(500).json({
        message:"Registration failed"
    });
}
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
    {
        userId: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);  
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});
app.post("/api/recruiters", async (req, res) => {
    try {
        const {
            recruiterName,
            companyName,
            companyEmail,
            companyWebsite,
            companyDescription
        } = req.body;

        const existingRecruiter = await Recruiter.findOne({
            companyEmail
        });

        if (existingRecruiter) {
            return res.status(400).json({
                message: "A recruiter account with this company email already exists"
            });
        }

        const recruiter = await Recruiter.create({
            recruiterName,
            companyName,
            companyEmail,
            companyWebsite,
            companyDescription
        });

        res.status(201).json({
            message: "Recruiter registration submitted for verification",
            recruiter
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Recruiter registration failed"
        });
    }
});
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});