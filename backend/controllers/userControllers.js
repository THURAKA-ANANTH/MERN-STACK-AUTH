import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from "../models/userModel.js";

//@desc   Auth user/set token
// Route POST/api/user/auth
// @access Public
const authUser =asyncHandler( async (req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPasswords(password))){
        generateToken(res,user._id)
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        })
    }
    else{
        res.status(401);
        throw new Error('Invalid UserId or Password');
    }

});

//@desc   Register a new user
// Route POST/api/users
// @access Public

const registerUser = asyncHandler(async (req,res)=>{
    const {name,email,password} = req.body;
    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password
    });
    if(user){
        generateToken(res,user._id)
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        })
    }
    else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//@desc   Logout a user
// Route POST/api/users
// @access Public


const logoutUser = asyncHandler(async (req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires: new Date(0),
    })
    
    res.status(200).json({message:'User Logged Out'})
});


//@desc   Get User Profile
// Route GET/api/users/profile
// @access Public

const getUserProfile =asyncHandler( async (req,res)=>{
    const user = {
        _id: req.user._id,
        name : req.user.name,
        email : req.user.email,
    }
    
    res.status(200).json(user)
});
 
//@desc   Update User Profile
// Route GET/api/users/profile
// @access Public

const updateUserProfile = asyncHandler(async (req,res)=>{
    const user =  await  User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email|| user.email;

        if(req.body.password){
            user.password =  req.body.password;
        }
        

        const UpdatedUser = await user.save();
        res.status(200).json({
            _id:UpdatedUser._id,
            name:UpdatedUser.name,
            email:UpdatedUser.email,
        })


    }else{
        res.status(404);
        throw new Error('User not Found');
    }
   
});

export {authUser,registerUser,logoutUser,getUserProfile,updateUserProfile};
