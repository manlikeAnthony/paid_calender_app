const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by copying the following number : ${verificationToken} <br>or<br> clicking the following link : <a href="${verifyEmail}">Verify Email</a> </p>`;
  
  return sendEmail({
    to: email,
    subject: "Email confirmation",
    html: `<h4> Hello ,${name} </h4> ${message}`,
  });
};

module.exports = sendVerificationEmail;
