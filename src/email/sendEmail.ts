import {main} from "./email.ts";

const fixedMailOptions = {
  from: process.env.EMAIL_FROM,
};

export default function sendEmail(options = {}) {
  const mailOptions = Object.assign({}, options, fixedMailOptions);
  return main(mailOptions);
}


