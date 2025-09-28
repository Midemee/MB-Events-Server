const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },

    fullName: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "minimum password length is 6"],
    }, 
    resetToken: String,
    resetTokenExpiry:Date,
},
{timestamps : true}
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();    
});
module.exports = mongoose.model("User", userSchema);