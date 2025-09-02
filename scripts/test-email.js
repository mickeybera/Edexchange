const nodemailer = require('nodemailer');

async function testEmail() {
    try {
        console.log('🔍 Testing email configuration...');
        
        // Create test account
        const testAccount = await nodemailer.createTestAccount();
        console.log('✅ Test account created');
        console.log('Email:', testAccount.user);
        console.log('Password:', testAccount.pass);
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        
        console.log('✅ Transporter created');
        
        // Send test email
        const info = await transporter.sendMail({
            from: '"Marketplace Test" <test@marketplace.com>',
            to: 'test@example.com',
            subject: 'Test Email from Marketplace',
            text: 'This is a test email to verify the email configuration is working.',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Test Email</h2>
                    <p>This is a test email to verify the email configuration is working correctly.</p>
                    <p>If you receive this email, the email system is properly configured!</p>
                    <p>Best regards,<br>The Marketplace Team</p>
                </div>
            `,
        });
        
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        
        console.log('🎉 All email tests passed!');
        
    } catch (error) {
        console.error('❌ Email test failed:', error);
    }
}

// Run the test
testEmail();
