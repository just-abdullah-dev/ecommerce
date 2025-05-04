import nodemailer from "nodemailer";

function checkResponse(response) {
  const successMessagePattern = /\bOK\b/;
  if (successMessagePattern.test(response)) {
    return true;
  } else {
    return false;
  }
}

export default async function sendMail(
  email,
  subject,
  message,
  attachments = []
) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: process.env.SITE_EMAIL,
        pass: process.env.APP_PASS_KEY,
      },
    });

    const info = await transporter.sendMail({
      from: {
        name: `${process.env.STORE_NAME}`,
        address: process.env.SITE_EMAIL,
      },
      to: email,
      subject: subject,
      html: `<p>${message}</p>`,
      attachments: attachments,
    });
    const obj = { success: checkResponse(info?.response), data: info };
    console.log(obj);
    return obj;
  } catch (error) {
    console.error(error);
  }
}
