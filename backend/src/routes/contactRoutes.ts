import { Router } from "express";
import nodemailer from "nodemailer";

export const createContactRouter = () => {
  const router = Router();

  router.post("/", async (req, res) => {
    let { username, name, surname, email, tel, message, linkedInProfile } =
      req.body;

    if (!message) {
      return res.status(400).json({ error: "Nachricht ist leer" });
    }

    // Remove trailing and leading spaces and allow only 2 \n
    const cleanedMessage = message.trim().replace(/(\r?\n){3,}/g, "\n\n");

    // Configure mail transporter
    // TODO: Find new host - free trial of sendgrid has ended
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: process.env.CONTACT_MAIL,
      replyTo: email,
      subject: `Portfolio Kontakt: ${name} ${surname}`,
      text: `Nachricht von: ${name} ${surname} (${email})\n\n${message}`,
      html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
        <h3 style="color: #0891b2;">Neue Portfolio-Anfrage</h3>
        <p><strong>Von:</strong> ${name} ${surname} (${username || "Gast"})</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>LinkedIn:</strong> ${linkedInProfile} </p>
        ${tel ? `<p><strong>Tel:</strong> ${tel}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Nachricht:</strong></p>
        <pre style="
          white-space: pre-wrap; 
          word-wrap: break-word; 
          font-family: sans-serif; 
          background-color: #f5f5f5; 
          padding: 15px; 
          border-radius: 5px; 
          border: 1px solid #ddd;
          color: #333;
        ">${cleanedMessage}</pre>
      </div>
    `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "E-Mail erfolgreich gesendet", info });
    } catch (error) {
      console.error("Mail Error:", error);
      res.status(500).json({ error: "Fehler beim E-Mail Versand" });
    }
  });

  return router;
};
