const mongoose=require('mongoose');
const recruiterSchema=new mongoose.Schema({
    recruiterName:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    companyEmail:{
        type:String,
        required:true
    },
    companyWebsite:{
        type:String
    },
    companyDescription:{
        type:String
    },
    verificationStatus:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
});
const Recruiter=mongoose.model("Recruiter",recruiterSchema);
module.exports=Recruiter;