import nodemailer from 'nodemailer';

// Create a test account for development (you should use real SMTP in production)
const createTestAccount = async () => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    } catch (error) {
        console.error('Error creating test account:', error);
        throw error;
    }
};

// For production, you would use a real SMTP service like Gmail, SendGrid, etc.
const createProductionTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // or your preferred email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Get the appropriate transporter based on environment
const getTransporter = async () => {
    if (process.env.NODE_ENV === 'production') {
        return createProductionTransporter();
    } else {
        return await createTestAccount();
    }
};

export interface EmailNotificationData {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/**
 * Send an email notification
 */
export async function sendEmail(data: EmailNotificationData): Promise<boolean> {
    try {
        const transporter = await getTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Marketplace" <noreply@marketplace.com>',
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        };
        
        const info = await transporter.sendMail(mailOptions);
        
        if (process.env.NODE_ENV !== 'production') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

/**
 * Send notification when an item is borrowed
 */
export async function sendBorrowNotification(
    donorEmail: string,
    donorName: string,
    itemTitle: string,
    borrowerName: string,
    borrowerEmail: string
): Promise<boolean> {
    const subject = `Your donated item "${itemTitle}" has been borrowed!`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Item Borrowed Notification</h2>
            <p>Hello ${donorName},</p>
            <p>Great news! Your donated item <strong>"${itemTitle}"</strong> has been borrowed by someone in the community.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Borrower Details:</h3>
                <p><strong>Name:</strong> ${borrowerName}</p>
                <p><strong>Email:</strong> ${borrowerEmail}</p>
                <p><strong>Borrowed Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>Thank you for contributing to our community sharing initiative!</p>
            <p>Best regards,<br>The Marketplace Team</p>
        </div>
    `;
    
    const text = `
        Item Borrowed Notification
        
        Hello ${donorName},
        
        Great news! Your donated item "${itemTitle}" has been borrowed by someone in the community.
        
        Borrower Details:
        - Name: ${borrowerName}
        - Email: ${borrowerEmail}
        - Borrowed Date: ${new Date().toLocaleDateString()}
        
        Thank you for contributing to our community sharing initiative!
        
        Best regards,
        The Marketplace Team
    `;
    
    return await sendEmail({
        to: donorEmail,
        subject,
        html,
        text,
    });
}

/**
 * Send notification when an item is purchased
 */
export async function sendPurchaseNotification(
    sellerEmail: string,
    sellerName: string,
    itemTitle: string,
    buyerName: string,
    buyerEmail: string,
    price: number
): Promise<boolean> {
    const subject = `Your item "${itemTitle}" has been sold!`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Item Sold Notification</h2>
            <p>Hello ${sellerName},</p>
            <p>Congratulations! Your item <strong>"${itemTitle}"</strong> has been sold.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Sale Details:</h3>
                <p><strong>Item:</strong> ${itemTitle}</p>
                <p><strong>Price:</strong> $${price.toFixed(2)}</p>
                <p><strong>Buyer Name:</strong> ${buyerName}</p>
                <p><strong>Buyer Email:</strong> ${buyerEmail}</p>
                <p><strong>Sale Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>Please contact the buyer to arrange pickup or delivery.</p>
            <p>Best regards,<br>The Marketplace Team</p>
        </div>
    `;
    
    const text = `
        Item Sold Notification
        
        Hello ${sellerName},
        
        Congratulations! Your item "${itemTitle}" has been sold.
        
        Sale Details:
        - Item: ${itemTitle}
        - Price: $${price.toFixed(2)}
        - Buyer Name: ${buyerName}
        - Buyer Email: ${buyerEmail}
        - Sale Date: ${new Date().toLocaleDateString()}
        
        Please contact the buyer to arrange pickup or delivery.
        
        Best regards,
        The Marketplace Team
    `;
    
    return await sendEmail({
        to: sellerEmail,
        subject,
        html,
        text,
    });
}

/**
 * Send notification to buyer when they purchase an item
 */
export async function sendBuyerConfirmation(
    buyerEmail: string,
    buyerName: string,
    itemTitle: string,
    sellerName: string,
    sellerEmail: string,
    price: number
): Promise<boolean> {
    const subject = `Purchase Confirmation: "${itemTitle}"`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Purchase Confirmation</h2>
            <p>Hello ${buyerName},</p>
            <p>Thank you for your purchase! Your order has been confirmed.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Details:</h3>
                <p><strong>Item:</strong> ${itemTitle}</p>
                <p><strong>Price:</strong> $${price.toFixed(2)}</p>
                <p><strong>Seller:</strong> ${sellerName}</p>
                <p><strong>Seller Email:</strong> ${sellerEmail}</p>
                <p><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>Please contact the seller to arrange pickup or delivery.</p>
            <p>Best regards,<br>The Marketplace Team</p>
        </div>
    `;
    
    const text = `
        Purchase Confirmation
        
        Hello ${buyerName},
        
        Thank you for your purchase! Your order has been confirmed.
        
        Order Details:
        - Item: ${itemTitle}
        - Price: $${price.toFixed(2)}
        - Seller: ${sellerName}
        - Seller Email: ${sellerEmail}
        - Purchase Date: ${new Date().toLocaleDateString()}
        
        Please contact the seller to arrange pickup or delivery.
        
        Best regards,
        The Marketplace Team
    `;
    
    return await sendEmail({
        to: buyerEmail,
        subject,
        html,
        text,
    });
}
