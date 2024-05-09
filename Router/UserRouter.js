import express from 'express';
import { register, verifyOTPAndRegister,login } from '../Contex/UserContex.js';

const router = express.Router();

// Route for user registration
router.post('/register', register);    

// Route for OTP verification and registration
router.post('/verify', verifyOTPAndRegister);
router.post('/login',login)

export default router;
