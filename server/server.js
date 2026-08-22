require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const connectDB = require("./config/db");
const Job = require("./models/Job");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Recruiter = require("./models/Recruiter");
const Application = require("./models/Application");
const protect = require("./middleware/authMiddleware");

// ==================================================
// SKILL NORMALIZATION
// ==================================================

function normalizeSkill(skill) {
    if (!skill) return "";

    let normalized = skill
        .toLowerCase()
        .trim();

    // Remove common prefixes
    normalized = normalized
        .replace(/^microsoft\s+/, "")
        .replace(/^ms\s+/, "");

    // Normalize punctuation
    normalized = normalized
        .replace(/[._]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    // Common skill aliases / spelling corrections
    const aliases = {
        "web developement": "web development",
        "webdevelopment": "web development",

        "frontend development": "frontend development",
        "front end development": "frontend development",

        "javascript development": "javascript",

        "node js": "node.js",
        "nodejs": "node.js",

        "react js": "react",
        "reactjs": "react",

        "vue js": "vue",
        "vuejs": "vue",

        "angular js": "angular",
        "angularjs": "angular",

        "html5": "html",
        "css3": "css",

        "structured query language": "sql",

        "data analysis": "data analysis",
        "data analytics": "data analytics",
        "microsoft excel": "excel",
    "microsoft access": "access",
    "microsoft powerpoint": "powerpoint",

    "react.js": "react",
    "reactjs": "react",

    "node js": "node.js",
    "nodejs": "node.js",

    "web developement": "web development",
    "webdevelopment": "web development",

    "sql database": "sql"
    };

    return aliases[normalized] || normalized;
}

// ==================================================
// GEMINI AI
// ==================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ==================================================
// APP
// ==================================================

const app = express();

app.use(express.json());

connectDB();

const PORT = 5000;

// ==================================================
// SKILL VOCABULARY
// ==================================================

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

// ==================================================
// MULTER / RESUME UPLOAD
// ==================================================

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

const upload = multer({
    storage
});

// ==================================================
// JOB ROUTES
// ==================================================

// CREATE JOB
app.post("/api/jobs", protect, async (req, res) => {
    try {

        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Recruiter access required"
            });
        }

        const job = await Job.create({
            ...req.body,
            recruiter: req.user.userId
        });

        res.status(201).json(job);

    } catch (error) {

        console.log("Create job error:", error);

        res.status(500).json({
            message: "Failed to create job"
        });
    }
});
// GET ALL JOBS

app.get("/api/jobs", protect, async (req, res) => {
    try {

        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Recruiter access required"
            });
        }

        const jobs = await Job.find({
            recruiter: req.user.userId
        });

        res.json(jobs);

    } catch (error) {

        console.log("Fetch jobs error:", error);

        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
});

// GET SINGLE JOB

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

// ==================================================
// TEST ROUTE
// ==================================================

app.get("/api/test", (req, res) => {

    res.json("RecruitFlow is working");

});

// ==================================================
// REGISTER
// ==================================================

app.post("/api/register", async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        if (
            !role ||
            !["candidate", "recruiter"].includes(role)
        ) {
            return res.status(400).json({
                message: "Please select a valid role"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: "User registered successfully",

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
            message: "Registration failed"
        });
    }
});

// ==================================================
// LOGIN
// ==================================================

app.post("/api/login", async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
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

// ==================================================
// RECRUITER REGISTRATION
// ==================================================

app.post("/api/recruiters", async (req, res) => {
    try {

        const {
            recruiterName,
            companyName,
            companyEmail,
            companyWebsite,
            companyDescription
        } = req.body;

        const existingRecruiter =
            await Recruiter.findOne({
                companyEmail
            });

        if (existingRecruiter) {
            return res.status(400).json({
                message:
                    "A recruiter account with this company email already exists"
            });
        }

        const recruiter =
            await Recruiter.create({
                recruiterName,
                companyName,
                companyEmail,
                companyWebsite,
                companyDescription
            });

        res.status(201).json({
            message:
                "Recruiter registration submitted for verification",

            recruiter
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                "Recruiter registration failed"
        });
    }
});
// GET APPLICATIONS FOR RECRUITER
app.get(
    "/api/applications",
    protect,
    async (req, res) => {

        try {

            if (req.user.role !== "recruiter") {
                return res.status(403).json({
                    message: "Recruiter access required"
                });
            }

            // Find jobs belonging to this recruiter
            const recruiterJobs = await Job.find({
                recruiter: req.user.userId
            }).select("_id");

            const jobIds = recruiterJobs.map(
                job => job._id
            );

            // Find applications for those jobs
            const applications =
                await Application.find({
                    job: { $in: jobIds }
                })
                .populate(
                    "candidate",
                    "name email"
                )
                .populate(
                    "job",
                    "title company location"
                )
                .sort({
                    createdAt: -1
                });

            res.json(applications);

        } catch (error) {

            console.log(
                "Recruiter applications error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch recruiter applications"
            });
        }
    }
);
// ==================================================
// APPLICATIONS
// ==================================================

// APPLY FOR JOB

app.post(
    "/api/applications",
    protect,
    async (req, res) => {

        try {

            const { jobId } = req.body;

            if (!jobId) {
                return res.status(400).json({
                    message: "Job is required"
                });
            }

            if (req.user.role !== "candidate") {
                return res.status(403).json({
                    message:
                        "Only candidates can apply for jobs"
                });
            }

            const candidateId = req.user.userId;

            // Check job exists
            const job = await Job.findById(jobId);

            if (!job) {
                return res.status(404).json({
                    message: "Job not found"
                });
            }

            // Check duplicate application
            const existingApplication =
                await Application.findOne({
                    candidate: candidateId,
                    job: jobId
                });

            if (existingApplication) {
                return res.status(400).json({
                    message:
                        "You have already applied for this job"
                });
            }

            // Create application
            const application =
                await Application.create({
                    candidate: candidateId,
                    job: jobId
                });

            // Increase applicant count
            await Job.findByIdAndUpdate(
                jobId,
                {
                    $inc: {
                        noofapplicants: 1
                    }
                }
            );

            res.status(201).json({
                message:
                    "Application submitted successfully",

                application
            });

        } catch (error) {

            console.log(
                "Application error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to submit application"
            });
        }
    }
);
// GET APPLICATIONS FOR CANDIDATE

app.get(
    "/api/applications/:candidateId",
    protect,
    async (req, res) => {

        try {

            if (req.user.role !== "candidate") {
                return res.status(403).json({
                    message:
                        "Candidate access required"
                });
            }

            if (
                req.user.userId.toString() !==
                req.params.candidateId
            ) {
                return res.status(403).json({
                    message:
                        "Access denied"
                });
            }

            const applications =
                await Application.find({
                    candidate:
                        req.params.candidateId
                })
                    .populate("job");

            res.json(applications);

        } catch (error) {

            console.log(
                "Fetch applications error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch applications"
            });
        }
    }
);

// GET MY APPLICATIONS

app.get(
    "/api/my-applications",
    protect,
    async (req, res) => {

        try {

            if (req.user.role !== "candidate") {
                return res.status(403).json({
                    message:
                        "Candidate access required"
                });
            }

            const applications =
                await Application.find({
                    candidate:
                        req.user.userId
                })
                    .populate("job");

            res.json(applications);

        } catch (error) {

            console.log(
                "Fetch applications error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch applications"
            });
        }
    }
);

// UPDATE APPLICATION STATUS

app.put(
    "/api/applications/:id/status",
    protect,
    async (req, res) => {

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

            const application =
                await Application.findById(
                    req.params.id
                );

            if (!application) {
                return res.status(404).json({
                    message: "Application not found"
                });
            }

            const job =
                await Job.findById(
                    application.job
                );

            if (!job) {
                return res.status(404).json({
                    message: "Job not found"
                });
            }

            // Make sure this recruiter owns the job
            if (
                job.recruiter.toString() !==
                req.user.userId.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You cannot update this application"
                });
            }

            application.status = status;

            await application.save();

            await application.populate([
                {
                    path: "candidate",
                    select: "name email"
                },
                {
                    path: "job",
                    select: "title company location"
                }
            ]);

            res.json({
                message:
                    "Application status updated",
                application
            });

        } catch (error) {

            console.log(
                "Update application error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update application status"
            });
        }
    }
);
// ==================================================
// MANUAL SKILLS UPDATE
// ==================================================

app.put(
    "/api/users/:id/skills",
    async (req, res) => {

        try {

            const { skills } = req.body;

            if (
                !skills ||
                !Array.isArray(skills)
            ) {
                return res.status(400).json({
                    message:
                        "Skills must be an array"
                });
            }

            const normalizedSkills = [
                ...new Set(
                    skills
                        .filter(
                            skill =>
                                typeof skill === "string"
                        )
                        .map(normalizeSkill)
                        .filter(Boolean)
                )
            ];

            const user =
                await User.findByIdAndUpdate(
                    req.params.id,
                    {
                        skills:
                            normalizedSkills
                    },
                    {
                        returnDocument: "after"
                    }
                );

            if (!user) {
                return res.status(404).json({
                    message:
                        "User not found"
                });
            }

            res.json({
                message:
                    "Skills updated successfully",

                user
            });

        } catch (error) {

            console.log(
                "Skills update error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update skills"
            });
        }
    }
);

// ==================================================
// GET USER PROFILE
// ==================================================

app.get(
    "/api/users/:id",
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                )
                    .select("-password");

            if (!user) {
                return res.status(404).json({
                    message:
                        "User not found"
                });
            }

            res.json(user);

        } catch (error) {

            console.log(
                "Profile error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch profile"
            });
        }
    }
);

// ==================================================
// AI RESUME ANALYSIS
// ==================================================

app.post(
    "/api/users/:id/resume",
    upload.single("resume"),
    async (req, res) => {

        try {

            // --------------------------------------------------
            // CHECK FILE
            // --------------------------------------------------

            if (!req.file) {
                return res.status(400).json({
                    message:
                        "Please upload a resume"
                });
            }

            // --------------------------------------------------
            // CHECK USER
            // --------------------------------------------------

            const user =
                await User.findById(
                    req.params.id
                );

            if (!user) {
                return res.status(404).json({
                    message:
                        "User not found"
                });
            }

            // --------------------------------------------------
            // EXTRACT PDF TEXT
            // --------------------------------------------------

            const parser = new PDFParse({
                url: req.file.path
            });

            const result =
                await parser.getText();

            await parser.destroy();

            const extractedText =
                result.text;

            console.log(
                "Extracted resume text:"
            );

            console.log(
                extractedText
            );

            // ==================================================
            // EXISTING SKILL EXTRACTION
            // ==================================================

            const extractedSkills = [];

            for (const skill of skillKeywords) {

                const escapedSkill =
                    skill.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    );

                const regex =
                    new RegExp(
                        `\\b${escapedSkill}\\b`,
                        "i"
                    );

                if (
                    regex.test(
                        extractedText
                    )
                ) {

                    extractedSkills.push(
                        skill
                    );
                }
            }

            // --------------------------------------------------
            // REMOVE DUPLICATE / NESTED SKILLS
            // --------------------------------------------------

            const uniqueSkills =
                extractedSkills.filter(
                    (skill) => {

                        if (
                            skill === "Excel"
                        ) {
                            return !extractedSkills.includes(
                                "Microsoft Excel"
                            );
                        }

                        if (
                            skill === "ReactJS"
                        ) {
                            return !extractedSkills.includes(
                                "React"
                            );
                        }

                        return true;
                    }
                );

            console.log(
                "Existing extracted skills:",
                uniqueSkills
            );

            // ==================================================
            // GEMINI AI RESUME ANALYSIS
            // ==================================================

            let aiSkills = [];

            try {

                // --------------------------------------------------
                // REMOVE CONTACT INFORMATION
                // --------------------------------------------------

                const sanitizedText =
                    extractedText

                        .replace(
                            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
                            "[EMAIL REMOVED]"
                        )

                        .replace(
                            /https?:\/\/\S+|www\.\S+/gi,
                            "[URL REMOVED]"
                        )

                        .replace(
                            /(\+?\d[\d\s().-]{7,}\d)/g,
                            "[PHONE REMOVED]"
                        );

                // --------------------------------------------------
                // SEND RESUME TO GEMINI
                // --------------------------------------------------

                const response =
                    await ai.models.generateContent({

                        model:
                            "gemini-3.5-flash-lite",

                        contents: `

You are an AI resume skill extraction engine for a recruitment platform.

Your task is to extract ONLY professional skills from the resume below.

A skill is a specific ability, technology, tool, methodology,
or professional competency that could reasonably be required
in a job description.

INCLUDE:

- Programming languages
- Frameworks and libraries
- Databases and query languages
- Software and technical tools
- Data and analytics skills
- Business skills
- IT skills
- Project management skills
- Communication and leadership skills
- Professional competencies
- Industry-relevant technical skills

EXAMPLES OF VALID SKILLS:

JavaScript
Python
Java
React
Node.js
SQL
MongoDB
Excel
Power BI
Data Analysis
Machine Learning
Project Management
Business Analysis
Troubleshooting
Leadership
Communication

DO NOT INCLUDE:

- Person names
- Company names
- University names
- Locations
- Addresses
- Phone numbers
- Email addresses
- URLs
- Dates
- Years
- Degrees
- GPA
- Job titles
- Job positions
- Coursework
- Resume section names
- Generic words such as "work", "experience",
  "responsibility", "team", or "career"

LANGUAGES:

Do not include spoken languages such as Spanish,
French, etc. unless the resume clearly presents
language proficiency as a professional/job skill.

OPERATING SYSTEMS:

Do not include Windows, macOS, OS X, or similar
operating systems unless they represent a meaningful
technical requirement.

CERTIFICATIONS:

Do not treat the certification name itself as a skill
unless it represents a genuine professional capability.

NORMALIZATION RULES:

1. Avoid duplicate skills.

2. Treat equivalent names as the same skill.

Examples:

"Microsoft Excel" → "Excel"
"Microsoft PowerPoint" → "PowerPoint"
"Microsoft Access" → "Access"
"SQL Database" → "SQL"

3. Use the most commonly recognized professional name.

4. Keep framework and library names specific.

Examples:

"React.js" → "React"
"ReactJS" → "React"
"Node JS" → "Node.js"

5. Do not combine unrelated skills into one skill.

For example:

"Python, Java, SQL"

should become separate skills:

"Python"
"Java"
"SQL"

6. Do not infer skills that are not reasonably supported
by the resume.

7. A skill should only be included if the resume provides
evidence for it.

8. Prefer concise skill names.

9. Remove duplicates caused by capitalization or wording.

10. Return ONLY the JSON object described below.

OUTPUT FORMAT:

Return ONLY a JSON object with a "skills" property.

Example:

{
    "skills": [
        "SQL",
        "Excel",
        "Data Analysis",
        "SAS"
    ]
}

Do NOT return markdown.
Do NOT return explanations.
Do NOT include any properties other than "skills".

Resume:

${sanitizedText}

                        `,

                        config: {

                            responseMimeType:
                                "application/json",

                            responseSchema: {

                                type:
                                    "OBJECT",

                                properties: {

                                    skills: {

                                        type:
                                            "ARRAY",

                                        items: {

                                            type:
                                                "STRING"
                                        }
                                    }
                                },

                                required: [
                                    "skills"
                                ]
                            }
                        }
                    });

                // --------------------------------------------------
                // PARSE AI RESPONSE
                // --------------------------------------------------

                const parsedAI =
                    JSON.parse(
                        response.text
                    );

                const rawAISkills =
                    Array.isArray(parsedAI)
                        ? parsedAI
                        : Array.isArray(parsedAI.skills)
                            ? parsedAI.skills
                            : [];

                console.log(
                    "Raw Gemini response:",
                    parsedAI
                );

                console.log(
                    "AI skills:",
                    rawAISkills
                );

                // --------------------------------------------------
                // NORMALIZE AI SKILLS
                // --------------------------------------------------

                aiSkills = [
                    ...new Set(
                        rawAISkills
                            .filter(
                                skill =>
                                    typeof skill ===
                                    "string"
                            )
                            .map(
                                normalizeSkill
                            )
                            .filter(Boolean)
                    )
                ];

                console.log(
                    "Normalized AI skills:",
                    aiSkills
                );

            } catch (error) {

                console.log(
                    "AI resume analysis failed:",
                    error.message
                );

                console.log(
                    "Using existing skill extraction as fallback."
                );

                aiSkills = [];
            }

            // ==================================================
            // COMBINE AI + EXISTING SKILLS
            // ==================================================

            const combinedSkills = [
                ...uniqueSkills,
                ...aiSkills
            ];

            // --------------------------------------------------
            // NORMALIZE + REMOVE DUPLICATES
            // --------------------------------------------------

            const finalSkills = [
                ...new Set(
                    combinedSkills
                        .filter(
                            skill =>
                                typeof skill ===
                                "string"
                        )
                        .map(
                            normalizeSkill
                        )
                        .filter(Boolean)
                )
            ];

            console.log(
                "Final resume skills:",
                finalSkills
            );

            // ==================================================
            // SAVE SKILLS TO USER
            // ==================================================

            const updatedUser =
                await User.findByIdAndUpdate(
                    req.params.id,
                    {
                        skills:
                            finalSkills
                    },
                    {
                        returnDocument:
                            "after"
                    }
                )
                    .select("-password");

            if (!updatedUser) {
                return res.status(404).json({
                    message:
                        "User not found"
                });
            }

            // ==================================================
            // RESPONSE
            // ==================================================

            res.status(200).json({

                message:
                    "Resume analyzed successfully",

                skills:
                    finalSkills,

                skillCount:
                    finalSkills.length,

                user:
                    updatedUser
            });

        } catch (error) {

            console.log(
                "Resume upload error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to analyze resume"
            });
        }
    }
);
// ==================================================
// AI SKILL MATCHING
// ==================================================

async function findAISkillMatches(candidateSkills, jobSkills) {
    try {
        if (!candidateSkills.length || !jobSkills.length) {
            return [];
        }

        const prompt = `
You are a careful AI recruitment skill-matching assistant.

Your task is to determine whether a candidate skill matches a required job skill.

CANDIDATE SKILLS:
${JSON.stringify(candidateSkills)}

JOB REQUIRED SKILLS:
${JSON.stringify(jobSkills)}

MATCHING RULES:

1. Match exact skills.
2. Match common naming variations.
3. Match common abbreviations.
4. Match spelling mistakes and obvious typos.
5. Match equivalent names for the same technology/tool.
6. Match a specific skill to a broader skill ONLY when the relationship is clear.
7. Do NOT match unrelated technologies.
8. Do NOT assume that similar-looking words mean the same thing.
9. Do NOT match programming languages that are merely similar.

VALID EXAMPLES:

"excel" ↔ "microsoft excel"
"powerpoint" ↔ "microsoft powerpoint"
"access" ↔ "microsoft access"
"react.js" ↔ "react"
"node js" ↔ "node.js"
"web developement" ↔ "web development"
"webdevelopment" ↔ "web development"
"sql database" ↔ "sql"
"javascript development" ↔ "javascript"

INVALID EXAMPLES:

"javascript" ↔ "java"
"python" ↔ "python java"
"html" ↔ "react"
"css" ↔ "react"
"sql" ↔ "excel"
"management" ↔ "python"
"research" ↔ "javascript"

IMPORTANT:

A candidate skill should only match a job skill when you are reasonably confident that they represent the same or substantially equivalent professional skill.

Return ONLY a JSON array.

For every valid match return:

[
    {
        "jobSkill": "job skill",
        "candidateSkill": "candidate skill",
        "matched": true,
        "confidence": 0.95
    }
]

Confidence must be a number between 0 and 1.

Only return matches where:

confidence >= 0.80

Do not return unmatched skills.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",

            contents: prompt,

            config: {
                responseMimeType: "application/json",

                responseSchema: {
                    type: "ARRAY",

                    items: {
                        type: "OBJECT",

                        properties: {
                            jobSkill: {
                                type: "STRING"
                            },

                            candidateSkill: {
                                type: "STRING"
                            },

                            matched: {
                                type: "BOOLEAN"
                            },

                            confidence: {
                                type: "NUMBER"
                            }
                        },

                        required: [
                            "jobSkill",
                            "candidateSkill",
                            "matched",
                            "confidence"
                        ]
                    }
                }
            }
        });

        // Gemini returns JSON text
        const result = JSON.parse(response.text);

        if (!Array.isArray(result)) {
            console.log("AI returned invalid skill matches.");
            return [];
        }

        // Normalize the AI response
        const validMatches = result
            .filter(item => {

                if (!item) {
                    return false;
                }

                if (item.matched !== true) {
                    return false;
                }

                if (
                    typeof item.jobSkill !== "string" ||
                    typeof item.candidateSkill !== "string"
                ) {
                    return false;
                }

                if (
                    typeof item.confidence !== "number"
                ) {
                    return false;
                }

                if (item.confidence < 0.80) {
                    return false;
                }

                return true;
            })
            .map(item => ({
                jobSkill: normalizeSkill(
                    item.jobSkill
                ),

                candidateSkill: normalizeSkill(
                    item.candidateSkill
                ),

                confidence: item.confidence
            }));

        // ------------------------------------------
        // SAFETY CHECK
        // ------------------------------------------
        // Only accept matches for skills that
        // actually exist in our input arrays.
        // This prevents Gemini from inventing skills.

        const safeMatches = validMatches.filter(
            match => {

                const jobExists =
                    jobSkills.includes(
                        match.jobSkill
                    );

                const candidateExists =
                    candidateSkills.includes(
                        match.candidateSkill
                    );

                return (
                    jobExists &&
                    candidateExists
                );
            }
        );

        console.log(
            "AI skill matches:",
            safeMatches
        );

        return safeMatches;

    } catch (error) {

        console.log(
            "AI skill matching failed:",
            error.message
        );

        // AI failure should NEVER break
        // normal job matching.
        return [];
    }
}

// ==================================================
// JOB MATCHING
// ==================================================

// ==================================================
// JOB MATCHING
// ==================================================

app.get(
    "/api/jobs/matches/:candidateId",
    async (req, res) => {

        try {

            // ==================================================
            // GET CANDIDATE
            // ==================================================

            const candidate =
                await User.findById(
                    req.params.candidateId
                );

            if (!candidate) {
                return res.status(404).json({
                    message: "Candidate not found"
                });
            }

            // ==================================================
            // GET JOBS
            // ==================================================

            const jobs = await Job.find();

            // ==================================================
            // NORMALIZE CANDIDATE SKILLS
            // ==================================================

            const candidateSkills = [
                ...new Set(
                    (candidate.skills || [])
                        .map(skill => normalizeSkill(skill))
                        .filter(Boolean)
                )
            ];

            console.log(
                "Candidate skills:",
                candidateSkills
            );

            const matchedJobs = [];

            // ==================================================
            // PROCESS EACH JOB
            // ==================================================

            for (const job of jobs) {

                // --------------------------------------------------
                // SPLIT JOB SKILLS
                // --------------------------------------------------
                //
                // Supports:
                //
                // "SQL, Excel, Python"
                //
                // and also:
                //
                // "C++ Python Java WebDevelopment"
                //
                // --------------------------------------------------

                let rawJobSkills = [];

                if (Array.isArray(job.skills)) {

                    rawJobSkills = job.skills;

                } else {

                    rawJobSkills =
                        String(job.skills || "")
                            .split(",")
                            .flatMap(skill => {

                                const trimmed =
                                    skill.trim();

                                // Fix common badly formatted
                                // combined skills.

                                if (
                                    /^c\+\+\s+python\s+java$/i
                                        .test(trimmed)
                                ) {
                                    return [
                                        "C++",
                                        "Python",
                                        "Java"
                                    ];
                                }

                                if (
                                    /^python\s+java$/i
                                        .test(trimmed)
                                ) {
                                    return [
                                        "Python",
                                        "Java"
                                    ];
                                }

                                return [trimmed];
                            });
                }

                // --------------------------------------------------
                // NORMALIZE JOB SKILLS
                // --------------------------------------------------

                const jobSkills = [
                    ...new Set(
                        rawJobSkills
                            .map(skill =>
                                normalizeSkill(skill)
                            )
                            .filter(Boolean)
                    )
                ];

                // ==================================================
                // EXACT MATCHING
                // ==================================================

                const exactMatchedSkills = [];

                const unmatchedJobSkills = [];

                for (const jobSkill of jobSkills) {

                    if (
                        candidateSkills.includes(
                            jobSkill
                        )
                    ) {

                        exactMatchedSkills.push(
                            jobSkill
                        );

                    } else {

                        unmatchedJobSkills.push(
                            jobSkill
                        );
                    }
                }

                // ==================================================
                // AI MATCHING
                // ==================================================
                //
                // IMPORTANT:
                //
                // AI is ONLY used for skills that did not
                // already match exactly.
                //
                // Therefore AI can never reduce an exact
                // match.
                //
                // ==================================================

                let aiMatchedSkills = [];

                if (
                    unmatchedJobSkills.length > 0 &&
                    candidateSkills.length > 0
                ) {

                    const aiMatches =
                        await findAISkillMatches(
                            candidateSkills,
                            unmatchedJobSkills
                        );

                    // ------------------------------------------
                    // SAFETY CHECK
                    // ------------------------------------------

                    for (const match of aiMatches) {

                        const jobSkill =
                            normalizeSkill(
                                match.jobSkill
                            );

                        const candidateSkill =
                            normalizeSkill(
                                match.candidateSkill
                            );

                        const confidence =
                            Number(
                                match.confidence || 0
                            );

                        // Only accept if:

                        // 1. Job skill actually exists
                        // 2. Candidate skill actually exists
                        // 3. Job skill was not already an
                        //    exact match
                        // 4. Confidence >= 0.80

                        if (
                            unmatchedJobSkills.includes(
                                jobSkill
                            ) &&

                            candidateSkills.includes(
                                candidateSkill
                            ) &&

                            !exactMatchedSkills.includes(
                                jobSkill
                            ) &&

                            confidence >= 0.80
                        ) {

                            // Avoid duplicate AI matches

                            const alreadyMatched =
                                aiMatchedSkills.some(
                                    item =>
                                        item.jobSkill ===
                                            jobSkill
                                );

                            if (!alreadyMatched) {

                                aiMatchedSkills.push({

                                    jobSkill,

                                    candidateSkill,

                                    confidence: match.confidence
                                });
                            }
                        }
                    }
                }

                // ==================================================
                // FINAL MATCHED SKILLS
                // ==================================================

                const aiMatchedJobSkills =
                    aiMatchedSkills.map(
                        match =>
                            match.jobSkill
                    );

                const matchedSkills = [
                    ...exactMatchedSkills,
                    ...aiMatchedJobSkills
                ];

                // ==================================================
                // FINAL MISSING SKILLS
                // ==================================================

                const missingSkills =
                    jobSkills.filter(
                        skill =>
                            !matchedSkills.includes(
                                skill
                            )
                    );

                // ==================================================
                // MATCH SCORE
                // ==================================================
                //
                // EXACT MATCH:
                //      1.00 point
                //
                // AI MATCH:
                //      confidence score
                //
                // Example:
                //
                // Job:
                // SQL
                // Excel
                // Python
                //
                // Candidate:
                // SQL
                // Excel
                //
                // Score:
                //
                // 2 / 3 = 67%
                //
                // --------------------------------------------------
                //
                // Example with AI:
                //
                // SQL       = 1.00
                // Excel     = 1.00
                // Business Analysis
                // vs Data Analysis = 0.85
                //
                // Total:
                //
                // 2.85 / 3 = 95%
                //
                // ==================================================

                const exactScore =
                    exactMatchedSkills.length;

                const aiScore =
                    aiMatchedSkills.reduce(
                        (total, match) =>
                            total +
                            Math.min(
                                match.confidence,
                                1
                            ),
                        0
                    );

                const totalScore =
                    exactScore + aiScore;

                const matchPercentage =
                    jobSkills.length > 0
                        ? Math.round(
                            (
                                totalScore /
                                jobSkills.length
                            ) * 100
                        )
                        : 0;

                // ==================================================
                // DEBUG LOGGING
                // ==================================================

                console.log(
                    "----------------------------------------"
                );

                console.log(
                    `Job: ${job.title}`
                );

                console.log(
                    "Job skills:",
                    jobSkills
                );

                console.log(
                    "Exact matched:",
                    exactMatchedSkills
                );

                console.log(
                    "AI matched:",
                    aiMatchedSkills
                );

                console.log(
                    "Missing:",
                    missingSkills
                );

                console.log(
                    "Match percentage:",
                    matchPercentage
                );

                // ==================================================
                // SAVE RESULT
                // ==================================================

                matchedJobs.push({

                    job,

                    matchPercentage,

                    matchedSkills,

                    missingSkills,

                    aiMatchedSkills
                });
            }

            // ==================================================
            // SORT BEST MATCHES FIRST
            // ==================================================

            matchedJobs.sort(
                (a, b) =>
                    b.matchPercentage -
                    a.matchPercentage
            );

            // ==================================================
            // RETURN RESULTS
            // ==================================================

            res.json(
                matchedJobs
            );

        } catch (error) {

            console.log(
                "Job matching error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to calculate job matches"
            });
        }
    }
);
// START SERVER
// ==================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);