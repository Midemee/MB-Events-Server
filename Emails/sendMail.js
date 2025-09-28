const nodemailer = require("nodemailer");
const {createWelcomeEmailTemplate, newsLetterTemplate, createResetEmailTemplate} = require("./emailTemplates")


const sendEmail = async ({to, subject, html}) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });
    try {
        //use await to send the email and wait for the result
        const info = await transporter.sendMail({
            from: process.env.APP_EMAIL,
            to: to,
            subject: subject,
            html: html,
        });
        console.log(`Email sent: ${info.response}`);     
    } catch (error) {
        console.log(error);  
    };
};

const sendWelcomeEmail = ({ fullName, clientUrl, email}) =>{
    const subject = "Welcome to MB events";
    const html = createWelcomeEmailTemplate(fullName, clientUrl);
    sendEmail({ to:email, subject, html});
};

const sendNewsletter = ({email})=> {
    const subject = "Your Weekly Dose of Updates Awaits";
    const html = newsLetterTemplate()

    sendEmail({to: email, subject, html})
}

const sendResetPasswordEmail = ({resetLink, email})=> {
    const subject = "Reset Password";
    const html = createResetEmailTemplate(resetLink);
   sendEmail({to: email, subject, html}) 
}
module.exports = {sendWelcomeEmail, sendNewsletter, sendResetPasswordEmail}