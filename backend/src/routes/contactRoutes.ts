import { Router } from "express";
import nodemailer from "nodemailer";
import { Resend } from "resend";

export const createContactRouter = () => {
  const router = Router();

  const resend = new Resend(process.env.SMTP_API_KEY);

  const senderMail = process.env.SENDER_MAIL as string;
  const contactMail = process.env.CONTACT_MAIL as string;
  const mailHost = process.env.SMTP_API_HOST as string;

  if (!senderMail || !contactMail) {
    throw new Error("Missing mail env vars");
  }

  router.post("/", async (req, res) => {
    const { username, name, surname, email, tel, message, linkedInProfile } =
      req.body;

    if (!message) {
      return res.status(400).json({ error: "Nachricht ist leer" });
    }

    if (!email) {
      return res.status(400).json({ error: "E-Mail ist erforderlich" });
    }

    // Remove trailing and leading spaces and allow only 2 \n
    const cleanedMessage = message.trim().replace(/(\r?\n){3,}/g, "\n\n");

    try {
      resend.emails.send({
        from: senderMail,
        to: contactMail,
        subject: `Portfolio Kontakt: ${name} ${surname}`,
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
        ">${escapeHtml(cleanedMessage)}</pre>
      </div>
    `,
      });

      res
        .status(200)
        .json({ message: "E-Mail erfolgreich gesendet mit ", mailHost });
    } catch (error) {
      console.error("Mail Error:", error);
      res
        .status(500)
        .json({ error: "Fehler beim E-Mail Versand mit ", mailHost });
    }
  });

  return router;
};

// Replace some specific chars against HTML-injection attacks
function escapeHtml(str: string = ""): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
