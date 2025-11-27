const userModel = require('../../models/userModel');
const bcrypt = require('bcryptjs');

async function resetPasswordController(req, res) {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                message: "Please provide email, verification code, and new password",
                error: true,
                success: false
            });
        }

        // Validate password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
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

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(newPassword, salt);

        // Update password and clear reset fields
        user.password = hashPassword;
        user.resetPasswordCode = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({
            message: "Password reset successfully. You can now login with your new password.",
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

module.exports = resetPasswordController;
