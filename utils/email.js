const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const msg = {
      to: email,
      from: "tom.cekala@gmail.com",
      subject: "Email Verification",
      text: `Please click on the following link to verify your email: http://localhost:3000/api/users/verify/${verificationToken}`,
    };

    await sgMail.send(msg);

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

module.exports = {
  sendVerificationEmail,
};
