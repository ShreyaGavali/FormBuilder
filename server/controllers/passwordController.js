import User from '../models/User.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const otpStore = new Map(); // In-memory store (for testing)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email, { otp, expiresAt });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP for Password Reset',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email', error: err.message });
    console.log(err);
  }
};

export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  otpStore.set(email, { ...record, verified: true });
  res.json({ message: 'OTP verified' });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const record = otpStore.get(email);

  if (!record || !record.verified) {
    return res.status(400).json({ message: 'OTP not verified' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);

  await User.findOneAndUpdate({ email }, { password: hashed });
  otpStore.delete(email);

  res.json({ message: 'Password reset successfully' });
};
