const nodemailer = require("nodemailer");

// Create transporter (uses Gmail SMTP)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ─── Send Verification Email ───
const sendVerificationEmail = async (email, name, verificationToken) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email/${verificationToken}`;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">ShopZone</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Verify Your Email Address</p>
      </div>
      <div style="padding: 32px; background: white;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi <strong>${name}</strong>,</p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">Thanks for signing up on ShopZone! Please verify your email address to activate your account and start shopping.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(99,102,241,0.4);">Verify My Email</a>
        </div>
        <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">Or copy and paste this link in your browser:</p>
        <p style="color: #6366f1; font-size: 13px; word-break: break-all; margin: 8px 0 0;">${verificationUrl}</p>
      </div>
      <div style="padding: 20px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This link expires in <strong>24 hours</strong>. If you didn't create an account, please ignore this email.</p>
        <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0;">&copy; ${new Date().getFullYear()} ShopZone. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"ShopZone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email — ShopZone",
      html,
    });
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send verification email:", error.message);
    return false;
  }
};

// ─── Send Password Reset Email ───
const sendPasswordResetEmail = async (email, name, resetToken) => {
  const transporter = createTransporter();

  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">ShopZone</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Reset Your Password</p>
      </div>
      <div style="padding: 32px; background: white;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi <strong>${name}</strong>,</p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">We received a request to reset your password. Click the button below to set a new password.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 40px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(99,102,241,0.4);">Reset Password</a>
        </div>
        <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">Or copy and paste this link:</p>
        <p style="color: #6366f1; font-size: 13px; word-break: break-all; margin: 8px 0 0;">${resetUrl}</p>
      </div>
      <div style="padding: 20px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This link expires in <strong>1 hour</strong>. If you didn't request this, please ignore this email.</p>
        <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0;">&copy; ${new Date().getFullYear()} ShopZone. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"ShopZone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password — ShopZone",
      html,
    });
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send reset email:", error.message);
    return false;
  }
};

// ─── Send Order Confirmation Email (Customer) ───
const sendOrderConfirmationEmail = async (email, name, orderItems, totalPrice, shippingInfo) => {
  const transporter = createTransporter();

  const itemsList = orderItems.map(item => `<li style="margin-bottom: 8px; color: #4b5563;">${item.name} (Qty: ${item.quantity}) - Rs ${(item.price * item.quantity).toFixed(2)}</li>`).join('');

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">ShopZone</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Order Confirmation</p>
      </div>
      <div style="padding: 32px; background: white;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi <strong>${name}</strong>,</p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">Thank you for your order! We've received your order and will start processing it right away.</p>
        <h3 style="color: #374151; font-size: 18px; margin-bottom: 12px;">Order Summary:</h3>
        <ul style="padding-left: 20px; margin: 0 0 24px;">${itemsList}</ul>
        <p style="color: #374151; font-size: 18px; font-weight: bold; margin: 0 0 24px;">Total: Rs ${totalPrice}</p>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;"><strong>Shipping Address:</strong> ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"ShopZone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Order Confirmation — ShopZone",
      html,
    });
    console.log(`✅ Order confirmation email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send order email:", error.message);
  }
};

// ─── Send New Order Notification Email (Admin) ───
const sendAdminOrderEmail = async (orderItems, totalPrice, shippingInfo) => {
  const transporter = createTransporter();

  const itemsList = orderItems.map(item => `<li style="margin-bottom: 8px; color: #4b5563;">${item.name} (Qty: ${item.quantity}) - Rs ${(item.price * item.quantity).toFixed(2)}</li>`).join('');

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">New Order Received!</h1>
      </div>
      <div style="padding: 32px; background: white;">
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">A new order has been placed by <strong>${shippingInfo.fullName}</strong>.</p>
        <h3 style="color: #374151; font-size: 18px; margin-bottom: 12px;">Order Details:</h3>
        <ul style="padding-left: 20px; margin: 0 0 24px;">${itemsList}</ul>
        <p style="color: #374151; font-size: 18px; font-weight: bold; margin: 0 0 24px;">Total: Rs ${totalPrice}</p>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;"><strong>Customer Email:</strong> ${shippingInfo.email}</p>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;"><strong>Customer Phone:</strong> ${shippingInfo.phone}</p>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;"><strong>Shipping Address:</strong> ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"ShopZone System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Aapke khud ke email par notification jayega
      subject: "New Order Received — ShopZone",
      html,
    });
    console.log(`✅ Admin notification email sent`);
  } catch (error) {
    console.error("❌ Failed to send admin email:", error.message);
  }
};

// Sab functions ko export kar diya
module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendOrderConfirmationEmail, sendAdminOrderEmail };