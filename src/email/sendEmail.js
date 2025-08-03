import {main} from "./email.js";
import {envConfig} from "../config/env.config.js";

const fixedMailOptions = {
  from: envConfig.server.nodeEnv,
};

export default function sendEmail(options = {}) {
  const mailOptions = Object.assign({}, options, fixedMailOptions);
  return main(mailOptions);
}


