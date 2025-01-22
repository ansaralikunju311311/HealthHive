import Nodemailer from 'nodemailer';    
import dotenv from 'dotenv';
dotenv.config();

const transporter = Nodemailer.createTransport({    
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

export const sendOtp = async (email,otp)=>
{
const mailOptions = {
    from:process.env.EMAIL_USER,
    to:email,
    subject:'Your OTP for HealthHive',
    text:`Your OTP is ${otp}`
}
   try{
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
   }
   catch(error){
    console.log(error);
    throw new Error('Error sending email');
   }
}