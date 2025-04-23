const Users = require("../models/user-model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config();


const register = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const userExist = await Users.findOne({ email });
        if (userExist) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        const userCreated = await Users.create({ name, email, password, isAdmin: isAdmin || false });

        res.status(201).json({
            msg: "User registered successfully",
            token: userCreated.generateToken(),
            userId: userCreated._id.toString(),
            isAdmin: userCreated.isAdmin, 
        });
    } catch (error) {
        console.error("Error in Register API:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and Password are required" });
        }

        const userExist = await Users.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        res.status(200).json({
            msg: "Login successful",
            token: userExist.generateToken(),
            userId: userExist._id.toString(),
            isAdmin: userExist.isAdmin, 
        });
    } catch (error) {
        console.error("Error in Login API:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};



const registerdata = async (req, res) => {
    try {
        const response = await Users.find();
        if (!response || response.length === 0) {
            return res.status(404).json({ msg: "Data not found" });
        }
        res.status(200).json({ msg: response });
    } catch (error) {
        console.error("Error in Fetching Users:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const forgetPassword = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        if (!req.body) {
            return res.status(400).json({ msg: "Request body is missing" });
        }

        const { email } = req.body;
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        const resetLink = `http://localhost:3000/reset/${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset.</p>
                   <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

        res.status(200).json({ msg: "Reset link sent to your email" });
    } catch (error) {
        console.error("Error in Forget Password API:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ msg: "New password is required" });
        }

        const user = await Users.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Users.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpiration: "" }
            }
        );

        console.log("Password reset successful for user:", user.email);
        res.status(200).json({ msg: "Password reset successful" });
    } catch (error) {
        console.error("Error in Reset Password API:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};



const getForgetPasswordRequests = async (req, res) => {
    try {
        const users = await Users.find({ resetToken: { $exists: true } });

        if (!users.length) {
            return res.status(404).json({ msg: "No forget password requests found" });
        }

        res.status(200).json({ msg: "Forget password requests fetched successfully", users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


const getResetPasswordRequests = async (req, res) => {
    try {
        const users = await Users.find({
            resetToken: { $exists: true },
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!users.length) {
            return res.status(404).json({ msg: "No valid reset password requests found" });
        }

        res.status(200).json({ msg: "Reset password requests fetched successfully", users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};


const logout = async (req, res) => {
    try {
        res.status(200).json({ msg: "Logout successful" });
    } catch (error) {
        console.error("Error in Logout API:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};




module.exports = { register, login, registerdata, forgetPassword, resetPassword , getForgetPasswordRequests , getResetPasswordRequests , logout  };
