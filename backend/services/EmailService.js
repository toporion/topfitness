const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }


})
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Your Fitness App" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
module.exports = { sendEmail };