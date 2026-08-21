require("dotenv").config(); 
const express=require('express');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const connectDB=require('./config/db');
const Job=require('./models/Job');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User=require('./models/User');  
const Recruiter=require('./models/Recruiter'); 
const Application = require("./models/Application");
const protect = require("./middleware/authMiddleware");
const skillKeywords = [
    "JavaScript",
    "TypeScript",
    "React",
    "ReactJS",
    "Node.js",
    "Express.js",
    "MongoDB",
    "HTML",
    "CSS",
    "Python",
    "Java",
    "C++",
    "C",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "Git",
    "GitHub",
    "Docker",
    "AWS",
    "Excel",
    "Microsoft Excel",
    "Access",
    "PowerPoint",
    "Visual Basic",
    "SAS",
    "Data Analysis",
    "Machine Learning",
    "Artificial Intelligence"
];
const app=express();
app.use(express.json());
connectDB();
const PORT=5000;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }
});

const upload = multer({ storage });
app.post("/api/jobs", protect, async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Recruiter access required"
            });
        }

        const job = await Job.create(req.body);

        res.status(201).json(job);

    } catch (error) {
        console.log("Create job error:", error);

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

app.get("/api/jobs/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(job);

    } catch (error) {
        console.log("Fetch job error:", error);

        res.status(500).json({
            message: "Failed to fetch job"
        });
    }
});

app.get('/api/test',(req,res)=>{
res.json("RecruitFlow is working");
});

app.post("/api/register",async (req,res)=>{
try{
    const{name,email,password,role}=req.body;

    const existingUser=await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            message:"User already exists"
        });
    }

    if(!role || !["candidate","recruiter"].includes(role)){
        return res.status(400).json({
            message:"Please select a valid role"
        });
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const user=await User.create({
        name,
        email,
        password:hashedPassword,
        role
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
            token,
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

app.post("/api/applications", protect, async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job is required"
            });
        }

        if (req.user.role !== "candidate") {
            return res.status(403).json({
                message: "Only candidates can apply for jobs"
            });
        }

        const candidateId = req.user.userId;

        const existingApplication =
            await Application.findOne({
                candidate: candidateId,
                job: jobId
            });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        const application =
            await Application.create({
                candidate: candidateId,
                job: jobId
            });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.log("Application error:", error);

        res.status(500).json({
            message: "Failed to submit application"
        });
    }
});

app.get("/api/applications/:candidateId", protect, async (req, res) => {
    try {

        if (req.user.role !== "candidate") {
            return res.status(403).json({
                message: "Candidate access required"
            });
        }

        if (req.user.userId.toString() !== req.params.candidateId) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const applications = await Application.find({
            candidate: req.params.candidateId
        })
        .populate("job");

        res.json(applications);

    } catch (error) {
        console.log("Fetch applications error:", error);

        res.status(500).json({
            message: "Failed to fetch applications"
        });
    }
});

app.get("/api/my-applications", protect, async (req, res) => {
    try {

        if (req.user.role !== "candidate") {
            return res.status(403).json({
                message: "Candidate access required"
            });
        }

        const applications = await Application.find({
            candidate: req.user.userId
        })
        .populate("job");

        res.json(applications);

    } catch (error) {
        console.log("Fetch applications error:", error);

        res.status(500).json({
            message: "Failed to fetch applications"
        });
    }
});
app.put("/api/applications/:id/status", protect, async (req, res) => {
    try {

        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Recruiter access required"
            });
        }

        const { status } = req.body;

        const validStatuses = [
            "applied",
            "under-review",
            "shortlisted",
            "rejected"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate("candidate", "name email")
            .populate("job", "title company location");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application status updated",
            application
        });

    } catch (error) {
        console.log("Update application error:", error);

        res.status(500).json({
            message: "Failed to update application status"
        });
    }
});
app.put("/api/users/:id/skills", async (req, res) => {
    try {
        const { skills } = req.body;

        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({
                message: "Skills must be an array"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { skills },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Skills updated successfully",
            user
        });

    } catch (error) {
        console.log("Skills update error:", error);

        res.status(500).json({
            message: "Failed to update skills"
        });
    }
});
app.get("/api/jobs/matches/:candidateId", async (req, res) => {
    try {
        const candidate = await User.findById(req.params.candidateId);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        const jobs = await Job.find();

        const candidateSkills = candidate.skills.map(
            (skill) => skill.toLowerCase().trim()
        );

        const matchedJobs = jobs.map((job) => {
            const jobSkills = job.skills
                .split(",")
                .map((skill) => skill.toLowerCase().trim())
                .filter(Boolean);

            const matchedSkills = jobSkills.filter((skill) =>
                candidateSkills.includes(skill)
            );

            const missingSkills = jobSkills.filter((skill) =>
                !candidateSkills.includes(skill)
            );

            const matchPercentage =
                jobSkills.length > 0
                    ? Math.round(
                        (matchedSkills.length / jobSkills.length) * 100
                    )
                    : 0;

            return {
                job,
                matchPercentage,
                matchedSkills,
                missingSkills
            };
        });

        matchedJobs.sort(
            (a, b) => b.matchPercentage - a.matchPercentage
        );

        res.json(matchedJobs);

    } catch (error) {
        console.log("Job matching error:", error);

        res.status(500).json({
            message: "Failed to calculate job matches"
        });
    }
});
app.post(
    "/api/users/:id/resume",
    upload.single("resume"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please upload a resume"
                });
            }

            const parser = new PDFParse({
                url: req.file.path
            });

            const result = await parser.getText();

            await parser.destroy();

            const extractedText = result.text;

            console.log("Extracted resume text:");
            console.log(extractedText);

            const extractedSkills = [];

for (const skill of skillKeywords) {
    const escapedSkill = skill.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const regex = new RegExp(
        `\\b${escapedSkill}\\b`,
        "i"
    );

    if (regex.test(extractedText)) {
        extractedSkills.push(skill);
    }
}

// Remove duplicate/nested skills
const uniqueSkills = extractedSkills.filter(
    (skill) => {
        if (skill === "Excel") {
            return !extractedSkills.includes(
                "Microsoft Excel"
            );
        }

        return true;
    }
);

console.log(
    "Extracted skills:",
    uniqueSkills
);

            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    skills: uniqueSkills
                },
                {
                    new: true
                }
            );

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "Resume uploaded and skills extracted successfully",
                skills: user.skills
            });

        } catch (error) {
            console.log("Resume parsing error:", error);

            res.status(500).json({
                message: "Failed to parse resume"
            });
        }
    }
);
app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        console.log("Profile error:", error);

        res.status(500).json({
            message: "Failed to fetch profile"
        });
    }
});
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});