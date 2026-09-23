

const sendOrderConfirmationEmail = async (email, name, orderItems, totalPrice, shippingInfo) => {
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
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "ShopZone", email: "naveedmian0342@gmail.com" }, // Yahan apna wo Gmail likhein jo Brevo par verify kiya
        to: [{ email: email, name: name }],
        subject: "Order Confirmation — ShopZone",
        htmlContent: html
      })
    });

    if (response.ok) {
      console.log(`✅ Order confirmation email sent to ${email}`);
    } else {
      const errorData = await response.json();
      console.error("❌ Brevo Error:", errorData.message);
    }
  } catch (error) {
    console.error("❌ Failed to send order email:", error.message);
  }
};

// ─── Send New Order Notification Email (Admin) ───
const sendAdminOrderEmail = async (orderItems, totalPrice, shippingInfo) => {
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
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "ShopZone System", email: "naveedmian0342@gmail.com" },
        to: [{ email: "naveedmian0342@gmail.com", name: "Admin" }], // Aapke khud ke email par notification jayegi
        subject: "New Order Received — ShopZone",
        htmlContent: html
      })
    });

    if (response.ok) {
      console.log(`✅ Admin notification email sent`);
    } else {
      const errorData = await response.json();
      console.error("❌ Brevo Admin Error:", errorData.message);
    }
  } catch (error) {
    console.error("❌ Failed to send admin email:", error.message);
  }
};

module.exports = { sendOrderConfirmationEmail, sendAdminOrderEmail };