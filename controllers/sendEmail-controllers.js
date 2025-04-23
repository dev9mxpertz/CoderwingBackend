const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmailRoute = async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS  
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to send email", error: error.message });
    }
};


module.exports = { sendEmailRoute };
