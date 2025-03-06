import Nodemailer from 'nodemailer';    
import dotenv from 'dotenv';
dotenv.config();

console.log('Email config:', {
    user: process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS
});

const transporter = Nodemailer.createTransport({    
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true
});

transporter.verify(function(error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

export const sendOtp = async (email,otp)=>
{
    console.log('Sending OTP email to:', email);
    const mailOptions = {
        from:process.env.EMAIL_USER,
        to:email,
        subject:'Your OTP for HealthHive',
        text:`Your OTP is ${otp}`
    }
    try{
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    }
    catch(error){
        console.log('Error sending OTP email:', error);
        throw new Error('Error sending email');
    }
}

export const sendDoctorVerificationEmail = async (email, name, status) => {
    console.log('Sending verification email:', { email, name, status });
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email configuration missing. Please check EMAIL_USER and EMAIL_PASS in .env file');
        throw new Error('Email configuration missing');
    }
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Doctor Verification ${status === 'approved' ? 'Approved' : 'Rejected'} - HealthHive`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: ${status === 'approved' ? '#4CAF50' : '#f44336'};">
                        ${status === 'approved' ? 'Congratulations!' : 'Application Status Update'}
                    </h2>
                </div>
                
                <p>Dear Dr. ${name},</p>
                
                ${status === 'approved' 
                    ? `<p>We are pleased to inform you that your application to join HealthHive as a healthcare provider has been <strong style="color: #4CAF50;">approved</strong>.</p>
                       <p>You can now log in to your account and start using our platform to connect with patients and provide healthcare services.</p>
                       <p>Here's what you can do next:</p>
                       <ul>
                           <li>Complete your profile information</li>
                           <li>Set your availability schedule</li>
                           <li>Start accepting patient appointments</li>
                       </ul>`
                    : `<p>Thank you for your interest in joining HealthHive as a healthcare provider.</p>
                       <p>After careful review of your application, we regret to inform you that we are unable to approve your registration at this time.</p>
                       <p>If you believe this decision was made in error or if you would like to submit a new application with updated information, please contact our support team.</p>`
                }
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p>Best regards,<br>The HealthHive Team</p>
                </div>
            </div>
        `
    };

    try {
        console.log('Attempting to send verification email...');
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email');
    }
};