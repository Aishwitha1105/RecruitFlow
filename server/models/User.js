const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["candidate", "recruiter"],
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    resume: {
        originalName: {
            type: String,
            default: ""
        },

        fileName: {
            type: String,
            default: ""
        },

        uploadedAt: {
            type: Date,
            default: null
        }
    }
});

module.exports = mongoose.model("User", userSchema);