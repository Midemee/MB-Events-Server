const USER = require("../Models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {sendWelcomeEmail, sendNewsletter, sendResetPasswordEmail} = require("../Emails/sendMail")

const generateToken = (id, email)=>{
    const token = jwt.sign({id, email}, process.env.JWT_SECRET, {expiresIn : "1day"})
    console.log(token);
    return token;
    
}
exports.signUp = async (req, res)=>{
    console.log("Incoming sign up request");
    
    const {email, fullName, password} = req.body
    console.log(req.body);

    try {
        if (!email || !fullName || !password) {
        return res.status(400).json({message: "please provide all credentials"})
    }  
    const existingUser = await USER.findOne({email})
    if(existingUser) {
        return res.status(400).json({success: false, message: "User already exist"})
    }
    // if no user that match, then create a new user
    const newUser = new USER({
        email,
        fullName,
        password
    })
    await newUser.save();

    const clientUrl= `${process.env.FRONTEND_URL} /api/auth/signin`
    await sendWelcomeEmail({
        fullName: newUser.fullName,
        clientUrl,
        email: newUser.email
    })

    res.status(200).json({success: true, message: "Sign up successful", user: {email: newUser.email, fullName: newUser.fullName }})
    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error.message})
        
    }
}

exports.signIn = async (req,res) => {
    console.log("incoming sign in req");
    
    const {email, password} = req.body;
    console.log(req.body)

    try {
        if (!email || !password) {
            return res.status(400).json({message: "Please provide all credentials!"})
        }

        const user = await USER.findOne({email})
        if (!user) {
            res.status(400).json({message: "User does not exist!"})
        }

        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) {
           return res.status(401).json({message : "Invalid credentials"}) 
        }
        const token = generateToken(user._id, user.email)

        res.status(200).json({ message: "Sign in succesful", token, user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Signin failed", error: error.message})
    }
}

exports.subscribe = async (req,res) => {
    console.log("Incoming newsletter subscription");
    
    const {email} = req.body;
    console.log(req.body);
    try {
        if (!email) {
            return res.status(400).json({success: false,  message:"Email is required"})
        }
        await sendNewsletter({
            email
        })
        res.status(200).json({success: true, message: "Thank you for subscribing"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to subscribe"})
    }    
}

//get email from request body
//check if email or user exists
//then generate a reset token, save to user schema
//create reset link for the frontend
//then send email containing the reset link to reset the password

exports.forgotpassword = async (req,res) => {
    console.log("Password reset request incoming");
    const {email} = req.body;
    console.log(req.body);
    
    try {
        if (!email) {
           return res.status(400).json({success: false,  message:"Please provide an email"}) 
        }

        const user = await USER.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"})
        } 
        const resetToken = generateToken(id, email)
        user.resetToken = resetToken
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; //15minutes
        await user.save()

        const resetLink =`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
        await sendResetPasswordEmail({
            email : user.email, resetLink
        })
        console.log("sendResetPasswordEmail called with:", { email, resetLink });
        res.status(200).json({
        success: true, message : "Password reset link sent to your email", resetToken
        })
    } catch (error) {
        console.log(error, "error sending email");
        res.status(400).json({success: false, message : "Something went wrong", error: error.message})
    }
}
exports.resetPassword = async(req, res) => {
    console.log("incoming password reset request ");
    const {password} = req.body;
    console.log(req.body);
    const { token } = req.params
    try {
        if (!password || !token) {
         return res.status(400).json({success : false, message : "Invalid or expired token"})
        }
        const {id}= jwt.verify(token, process.env.JWT_SECRET)

        console.log("Received token:", token);
        const hashedPassword = await bcrypt.hash(password, 10)
        
        await USER.findByIdAndUpdate(id, {
        password: hashedPassword})
        return res.status(200).json({message: "Password reset successful"})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({message: "Invalid or expired token"})
    }
}