const userModel = require('../../models/userModel');

async function verifyResetCodeController(req, res) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                message: "Please provide email and verification code",
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

        // Check if code exists
        if (!user.resetPasswordCode) {
            return res.status(400).json({
                message: "No password reset request found. Please request a new code.",
                error: true,
                success: false
            });
        }

        // Check if code has expired
        if (new Date() > user.resetPasswordExpires) {
            // Clear expired code
            user.resetPasswordCode = null;
            user.resetPasswordExpires = null;
            await user.save();

            return res.status(400).json({
                message: "Verification code has expired. Please request a new one.",
                error: true,
                success: false
            });
        }

        // Check if code matches
        if (user.resetPasswordCode !== code) {
            return res.status(400).json({
                message: "Invalid verification code. Please try again.",
                error: true,
                success: false
            });
        }

        // Code is valid
        res.json({
            data: {
                email: email,
                verified: true
            },
            message: "Verification code confirmed successfully",
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

module.exports = verifyResetCodeController;
