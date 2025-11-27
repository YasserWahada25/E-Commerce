const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Send password reset email with verification code
const sendPasswordResetEmail = async (email, code, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset Verification Code',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background: linear-gradient(to bottom right, #f0f4ff, #faf5ff);
                            border-radius: 16px;
                            padding: 40px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .header h1 {
                            color: #6366f1;
                            margin: 0;
                            font-size: 28px;
                        }
                        .content {
                            background: white;
                            border-radius: 12px;
                            padding: 30px;
                            margin: 20px 0;
                        }
                        .code-box {
                            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                            color: white;
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            text-align: center;
                            padding: 20px;
                            border-radius: 12px;
                            margin: 30px 0;
                        }
                        .info {
                            background: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            color: #64748b;
                            font-size: 14px;
                            margin-top: 30px;
                        }
                        .greeting {
                            font-size: 18px;
                            color: #0f172a;
                            margin-bottom: 15px;
                        }
                        p {
                            color: #475569;
                            margin: 10px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        
                        <div class="content">
                            <p class="greeting">Hello ${userName || 'there'},</p>
                            
                            <p>We received a request to reset your password for your ${process.env.APP_NAME} account.</p>
                            
                            <p>Your verification code is:</p>
                            
                            <div class="code-box">
                                ${code}
                            </div>
                            
                            <div class="info">
                                <strong>⏰ Important:</strong> This code will expire in <strong>15 minutes</strong> for security reasons.
                            </div>
                            
                            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                        </div>
                        
                        <div class="footer">
                            <p>This is an automated message from ${process.env.APP_NAME}</p>
                            <p>Please do not reply to this email</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Hello ${userName || 'there'},

We received a request to reset your password for your ${process.env.APP_NAME} account.

Your verification code is: ${code}

This code will expire in 15 minutes for security reasons.

If you didn't request a password reset, please ignore this email.

---
This is an automated message from ${process.env.APP_NAME}
Please do not reply to this email
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
};
