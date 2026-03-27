import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
    try {
        const response = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Verify your email",
            html: `<a href="${url}">Verify</a>`
        });

        console.log("EMAIL SENT:", response); 
    } catch (error) {
        console.error("EMAIL ERROR:", error); 
    }
};