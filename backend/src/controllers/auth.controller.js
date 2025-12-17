import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import {upsertStreamUser} from "../config/stream.config.js";

export const signUp = async (req, res) => {
    const {email, password, fullName} = req.body;
    try {
        if(!email || !password || !fullName) {
            return res.status(400).json({
                errorCode: 400,
                message: 'Email, password and Full Name is required'
            });
        }
        if(password.length < 8) {
            return res.status(400).json({
                errorCode: 400,
                message: 'Password must be at least 8 characters'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({
                errorCode: 400,
                message: 'Wrong email pattern'
            })
        }
        const emailExists = await User.findOne({email})

        if(emailExists) {
            return res.status(400).json({
                errorCode: 400,
                message: 'User with email already exists'
            })
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`
        const newUser = await new User({
            email,
            password,
            fullName,
            profilePic: randomAvatar,
        })
        await newUser.save();

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie('token', token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            });
            console.log(`stream user created for ${newUser.fullName}`);
        } catch (err) {
            res.status(500).json({
                errorCode: 500,
                message: `Error creating stream user => ${err.message}`,
                newUser
            })
        }
        return await res.status(200).json({
            success: true,
            message: 'User successfully created',
        })
    } catch (e) {
        console.error("Error in Sign Up Controller", e.message)
        return res.status(500).json({errorCode: 500, message: e.message})
    }
}

export const signIn = async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!password || !password) {
            return res.status(400).json({
                errorCode: 400,
                message: 'All fields are required'
            })
        }
        const existingUser = await User.findOne({email})
        if(!existingUser) {
            return res.status(404).json({
                errorCode: 404,
                message: 'User with email not found'
            })
        }
        const isPasswordCorrect = await existingUser.matchPassword(password);
        if(!isPasswordCorrect) {
            return res.status(401).json({
                errorCode: 401,
                message: 'Wrong password'
            })
        }
        const token = jwt.sign({userId: existingUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie('token', token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });
        return await res.status(200).json({
            status: 'success',
            message: 'Sign in successfully!',
            existingUser
        })
    } catch (e) {
        console.error("Error in Sign In Controller", e.message)
        return res.status(500).json({errorCode: 500, message: e.message})
    }
}

export const signOut = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        success: true,
        message: 'User successfully logged out',
    })
}

export const onboard = async (req, res) => {
   try {
       const userId = req.user._id;
       const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                errorCode: 400,
                message: 'All fields are required',
                missingFields: [
                    !fullName && 'fullName',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage',
                    !location && 'location'
                ].filter(Boolean)
            })
        }
       const updatedUser = await User.findOneAndUpdate(userId,{
           fullName, bio, nativeLanguage, learningLanguage, location,
           isOnboarded: true
       },{new:true});
        if(!updatedUser) {
            return res.status(404).json({
                errorCode: 404,
                message: 'User with email not found'
            })
        }
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
                language: updatedUser.nativeLanguage
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (e) {
            console.error("Error in onboarding Stream", e.message)
        }

       return res.status(200).json({
           success: true,
           updatedUser
       })
   } catch (e) {
       console.error("Error in onboard Controller", e.message);
       return res.status(500).json({errorCode: 500, message: e.message})
   }
}

export const whoImAm = (req, res) => {
    res.status(200).json({success: true, user: req.user});
}