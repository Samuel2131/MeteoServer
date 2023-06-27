import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "jany.reichert4@ethereal.email",
        pass: "YFhS84Urbr7TH2ekX3"
    }
});

const VerifyAccount = (tokenVerify: string) => {
    return `
    <html>
      <body>
        <h1>Account Verification</h1>
        <p>Please click the following link to verify your account:</p>
        <a href="http://localhost:${process.env.PORT}/v1/users/validate/${tokenVerify}">Verify Account</a>
      </body>
    </html>`;
};

export const sendEmail = async (email: string, verify: string): Promise<boolean> => {
    try{
        await transporter.sendMail({
            from: "jany.reichert4@ethereal.email", 
            to: email, 
            subject: "Validation email",
            html: VerifyAccount(verify), 
        });
        return true;
    } catch(e) {
        return false;
    }
};