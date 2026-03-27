import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, url) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: to, // ✅ correct
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify:</p>
        <a href="${url}">Verify Email</a>
      `,
    });

    console.log("EMAIL SENT:", response);
  } catch (error) {
    console.error("EMAIL ERROR:", error);
  }
};