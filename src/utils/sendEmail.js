import nodemailer from "nodemailer";

const FROM_EMAIL_ID = process.env.FROM_EMAIL_ID;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;


export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: FROM_EMAIL_ID,
            pass: GMAIL_PASSWORD, // app password
        },
    });

    await transporter.sendMail({
        from: `"Smart Focus Tution Center" <${FROM_EMAIL_ID}>`,
        to,
        subject,
        html,
    });
};


