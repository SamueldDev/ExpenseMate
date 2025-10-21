


import bcrypt from "bcrypt"
// import json from "jsonwebtoken"

import jwt from "jsonwebtoken"

import User from "../models/UserModel.js"

import dotenv from "dotenv"
dotenv.config({ quiet: true })

const generateToken = (user) => {
    return jwt.sign({ id: user._id, name: user.name, email: user.email}, process.env.JWT_SECRET,{ expiresIn: "7d"})
}

// register a user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try{
        const existingUser = await User.findOne({ email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword});
        await newUser.save();

        const token = generateToken(newUser);
        res.status(201).json({ 
            message: "Registration successful", 
            user: { id: newUser._id, name: newUser.name, email: newUser.email}, token})
    } catch (err){
        res.status(500).json({ message: "Registration failed", error: err.message})
    }
}


// login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email});
        if(!user) return res.status(400).json({ message: "Invalid email or password"})

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(400).json({ message: "Invalid email or password"});

        const token = generateToken(user);
        res.status(200).json({
             message: "login successful", 
             user: { id: user._id, name: user.name, email: user.email}, token});
    } catch(err){
        res.status(500).json({ message: "Login failed", error: err.message})
    }
}