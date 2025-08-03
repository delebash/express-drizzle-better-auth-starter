import nodemailer from "nodemailer";
import {envConfig} from "../config/env.config.js";
// Pull in Environments variables
const EMAIL = {
  authUser: envConfig.emailAuthUsreName,
  authPass: envConfig.emailAuthPassword,
  smtpServer: envConfig.emailSmptServer,
  smtpPort: envConfig.emailSmtpPort,
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

