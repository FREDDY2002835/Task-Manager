import nodemailer from "nodemailer";
import path from "path";

// process.cwd() is the "server" folder when the app runs (npm run dev
// is executed from there), so ".." steps up to the repo root where
// your assets/logo.png actually lives.
const logoPath = path.join(process.cwd(), "..", "assets", "logo.png");

// The transporter is created fresh on each call (not at module load
// time). Creating it at the top of this file would run before
// dotenv.config() in server.js has loaded EMAIL_USER/EMAIL_APP_PASSWORD,
// since ES module imports fully execute before the importing file's
// own code runs - that caused "Missing credentials" even with a
// correct .env.
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    // Embeds the logo as an inline image referenced via "cid:logo"
    // in the HTML below - this works across email clients without
    // needing the logo hosted at a public URL.
    attachments: [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "logo",
      },
    ],
  });
};
