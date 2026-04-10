import dotenv from "dotenv"
import nodemailer from "nodemailer";

dotenv.config({});

const requiredEnvVars = ['EMAIL_USER', 'CLIENT_ID', 'CLIENT_SECRET', 'REFRESH_TOKEN'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})
transporter.verify((error, success) => {
    if (error) {
        console.log("Error in email service", error);
    } else {
        console.log("Email service is ready", success);
    }
})


const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Bank Transaction" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        })
        console.log("Email sent successfully", info.messageId);
        return info;
    } catch (error) {
        console.log("Error in sending email", error);
        throw error;
    }
}

export const sendRegistrationEmail = async (email) => {
    const subject = "Welcome to Bank Transaction";
    const text = "Thank you for registering with Bank Transaction";
    const html = `
        <h1>Welcome to Bank Transaction</h1>
        <p>Thank you for registering with Bank Transaction</p>
    `;
    return await sendEmail(email, subject, text, html);
}

export default sendEmail;
