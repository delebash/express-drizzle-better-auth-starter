import nodemailer from "nodemailer";

// Pull in Environments variables
const EMAIL = {
  authUser: process.env.AUTH_EMAIL_USERNAME,
  authPass: process.env.AUTH_EMAIL_PASSWORD,
  smtpServer: process.env.EMAIL_SMTP_SERVER,
  smtpPort: process.env.EMAIL_SMTP_PORT,
};

export async function main(mailOptions) {
  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: EMAIL.smtpServer,
    port: EMAIL.smtpPort,
    auth: {
      user: EMAIL.authUser,
      pass: EMAIL.authPass,
    },
  });

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: mailOptions?.from,
    to: mailOptions?.to,
    subject: mailOptions?.subject,
    text: mailOptions?.text,
    html: mailOptions?.html,
  });

  return info;
}

