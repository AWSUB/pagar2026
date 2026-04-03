const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendNewRegistrationEmail = async (adminEmails, newUser) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmails,
        subject: "Announcement: New Account Registration Needed Approval",
        html: `
            <h3>New Registration</h3>
            <p>There is new account with this detail that waiting for approval:</p>
            <ul>
                <li>Name: ${newUser.name}</li>
                <li>Role: ${newUser.role}</li>
                <li>Email: ${newUser.email}</li>
            </ul>
            <p>Please login to dashboard Admin for verification.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to Admins`);
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

const sendApprovalEmail = async (userEmail, userName, adminEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Congratulations! Your account is approved",
        html: `
            <h2>Hello, ${userName}!</h2>
            <p>You account is <b>approved</b>.</p>
            <p>Now please login and try using our website.</p>
            <br>
            <p><small>Approved by Admin: ${adminEmail}</small></p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${userEmail}`);
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

const sendResetLink = async (email, resetToken) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Link",
        html: `
            <p>You asked to reset password.</p>
            <p>This link is used to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link valid for 1 hour.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reset link has been sent to ${email}`);
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

module.exports = {
    sendNewRegistrationEmail,
    sendApprovalEmail,
    sendResetLink
};
