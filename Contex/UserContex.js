import jwt from 'jsonwebtoken';
import db from "../connect.js";
import nodemailer from 'nodemailer';
import { json } from 'express';

// Email configuration (configure this with your email service provider)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'subhajitncvt@gmail.com',
        pass: 'ofkl wdyz tzlg lbky'
    }
});

// Function to generate a random 4-digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
};

// Function to generate JWT token containing the OTP payload
const generateOTPToken = (otp) => {
    console.log(otp)
    return jwt.sign({ otp }, "otp_secret", { expiresIn: '10m' }); 
    
    // Token expires in 10 minutes
};

export const register = (req, res) => {
    const otp = generateOTP(); // Generate OTP
    const email = req.body.email;

    // Generate OTP token
    const token = generateOTPToken(otp);

    // Send OTP to user's email
    transporter.sendMail({
        from: 'subhajitncvt@gmail.com',
        to: email,
        subject: 'Registration OTP',
        text: `Your OTP for registration is: ${otp}`
    }, (err, info) => {
        if (err) {
            console.error("Error occurred while sending email:", err);
            return res.status(500).json({ error: "Failed to send OTP email", details: err });
        }

        console.log("Email sent successfully:", typeof(token));
        return res.status(200).json({ message: "OTP sent successfully", token });
    });
};

export const verifyOTPAndRegister = (req, res) => {
    console.log('running')
    const { otpToken, otp, email, username, password } = req.body;
console.log(req.body)
    // Verify OTP token
    jwt.verify(otpToken, "otp_secret", (err, decoded) => {
        if (err) {
            return res.status(400).json({ error: "Invalid or expired OTP token" , otp : otpToken });
        }

        // Check if OTP from token matches the user input
        if (decoded.otp !== otp) {
       
            return res.status(400).json({ error: "Invalid OTP", otp : decoded.otp });
        }

        // Proceed with the registration process
        const insertQuery = "INSERT INTO user (email, password, username) VALUES (?, ?, ?)";
        const values = [
            email,
            password,
            username
        ];

        db.query(insertQuery, values, (err) => {
            if (err) {
         
                return res.status(500).json({ error: err.message });
              
            }
          
            return res.status(200).json({ message: "User registered successfully" });
        });
    });
};
export const login = (req, res) => {
    const q = "SELECT * FROM user WHERE email = ?";
    db.query(q, [req.body.email], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } 
        if (data.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        if (req.body.password !== data[0].password) {
            return res.status(401).json({ error: "User credentials do not match" });
        }
        const token = jwt.sign({ id: data[0].id }, "secretkey");
      
        console.log("JWT Key:", token); // Logging the JWT key
        
        const { password, ...others } = data[0];
        res.cookie("accessToken", token, { httpOnly: true }).status(200).json({ token, ...others });
    });
};


export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User is logged out");
};