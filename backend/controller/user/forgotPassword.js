const userModel = require('../../models/userModel');
const { sendPasswordResetEmail } = require('../../helpers/emailService');

async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide email address",
                error: true,
                success: false
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email address",
                error: true,
                success: false
            });
        }

        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiration time (15 minutes from now)
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

        // Save code and expiration to user document
        user.resetPasswordCode = verificationCode;
        user.resetPasswordExpires = expirationTime;
        await user.save();

        // Send email with verification code
        const emailResult = await sendPasswordResetEmail(email, verificationCode, user.name);

        if (!emailResult.success) {
            return res.status(500).json({
                message: "Failed to send verification email. Please try again.",
                error: true,
                success: false,
                debug: emailResult.error // Return real error for debugging
            });
        }

        res.json({
            data: {
                email: email,
                expiresIn: 15 // minutes
            },
            message: "Verification code sent to your email",
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = forgotPasswordController;
