const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhander");
const express = require('express');
const router = express.Router();
const sendToken = require("../utils/jwtToken")
const { isAuthenticatedUser } = require("../middleware/auths");
router.post("/register",async (req, res, next) => {
    const { name, email, password } = req.body;
    try{const user = await User.create({
        name,
        email,
        password,
    });
    
    sendToken(user,201,res);}
    catch{
        return(next(new ErrorHandler("Wrong Credential",402)))
    }
    
})

//login 
router.post("/login",async(req,res,next)=>{
    const {email, password} = req.body;

    //check emailid and password both are give
    if(!email || !password){
        return(next(new ErrorHandler("invalid password and email",400)))
    }

    const user = await User.findOne({email}).select("+password");;
    if(!user){
        return(next(new ErrorHandler("User not found",401)))
    }
    
    const ispasswordMatch =await user.comparePassword(password);
    if(!ispasswordMatch){
        return(next(new ErrorHandler("Wrong password",402)))
    }

    sendToken(user,201,res);
}) 

router.get("/me",isAuthenticatedUser, async (req, res, next) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error); 
    }
});

router.get("/logout", async (req, res, next) => {
    const token ="thank you";
    const options="see you again"
    res.status(200).cookie("token", token, options).json({
        success: true
      });
});

module.exports = router;