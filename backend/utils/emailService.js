const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send admin notification on new registration
const sendAdminNotification = async (user) => {
  try {
    await transporter.sendMail({
      from: `"Hanz Nails System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🆕 New Customer Registration - Hanz Nails',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 30px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">💅 New Customer Registered</h1>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #d4af37;">Name:</strong> ${user.name}</p>
            <p><strong style="color: #d4af37;">Email:</strong> ${user.email}</p>
            <p><strong style="color: #d4af37;">Phone:</strong> ${user.phone}</p>
            <p><strong style="color: #d4af37;">Birthday:</strong> ${user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not provided'}</p>
            <p><strong style="color: #d4af37;">Registered:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="text-align: center; color: #888;">Hanz Nails Salon - Nasr City, Cairo</p>
        </div>
      `
    });
    console.log(`📧 Admin notified of new registration: ${user.email}`);
  } catch (error) {
    console.error('Admin notification error:', error.message);
  }
};

// Welcome email for new customer
const sendWelcomeEmail = async (user) => {
  try {
    await transporter.sendMail({
      from: `"Hanz Nails Salon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '💅 Welcome to Hanz Nails Salon!',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center; font-size: 32px;">HANZ NAILS</h1>
          <p style="text-align: center; color: #c9a96e; font-style: italic;">The Art of Timeless Polish</p>
          <hr style="border-color: #d4af37; margin: 20px 0;">
          <h2 style="color: #fff;">Welcome, ${user.name}! 🎉</h2>
          <p style="color: #ccc;">We're thrilled to have you as part of the Hanz Nails family. We can't wait to pamper you!</p>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37;">
            <h3 style="color: #d4af37;">What awaits you:</h3>
            <ul style="color: #ccc; line-height: 2;">
              <li>✨ Professional nail & lash services</li>
              <li>☕ Free coffee, iced coffee & matcha</li>
              <li>🎂 Special 50% birthday discount</li>
              <li>👑 Only certified professional technicians</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/booking" style="background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Book Your Appointment</a>
          </div>
          <hr style="border-color: #333; margin: 20px 0;">
          <p style="color: #888; text-align: center; font-size: 14px;">
            📍 19 Ali Amer, Nasr City, Cairo<br>
            📞 +20 10 2056 4047 | +20 10 1366 6610<br>
            📧 hanznailssalon@gmail.com
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Welcome email error:', error.message);
  }
};

// Birthday discount email
const sendBirthdayEmail = async (user, code) => {
  try {
    await transporter.sendMail({
      from: `"Hanz Nails Salon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🎂 Happy Birthday! Your 50% Off Gift from Hanz Nails 💅',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center; font-size: 32px;">🎂 Happy Birthday!</h1>
          <h2 style="color: #fff; text-align: center;">${user.name}</h2>
          <p style="text-align: center; color: #ccc;">From all of us at Hanz Nails, we wish you a wonderful birthday!</p>
          <div style="background: #2a2a2a; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #d4af37;">
            <p style="color: #d4af37; font-size: 18px; margin: 0;">Your Birthday Gift</p>
            <h1 style="color: #fff; font-size: 48px; margin: 10px 0;">50% OFF</h1>
            <p style="color: #ccc;">on your next service</p>
            <div style="background: #d4af37; color: #000; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; display: inline-block; letter-spacing: 4px; margin-top: 15px;">
              ${code}
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 15px;">Valid for 30 days from your birthday</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/booking" style="background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Redeem Your Gift</a>
          </div>
          <p style="color: #888; text-align: center; font-size: 14px;">
            📍 19 Ali Amer, Nasr City, Cairo<br>
            📞 +20 10 2056 4047
          </p>
        </div>
      `
    });
    console.log(`🎂 Birthday email sent to ${user.email}`);
  } catch (error) {
    console.error('Birthday email error:', error.message);
  }
};

// Booking confirmation email
const sendBookingConfirmation = async (user, booking) => {
  try {
    await transporter.sendMail({
      from: `"Hanz Nails Salon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '✅ Booking Confirmed - Hanz Nails Salon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">Booking Confirmed!</h1>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #d4af37;">Service:</strong> ${booking.service}</p>
            <p><strong style="color: #d4af37;">Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong style="color: #d4af37;">Time:</strong> ${booking.time}</p>
            ${booking.discountPercent > 0 ? `<p><strong style="color: #d4af37;">Discount Applied:</strong> ${booking.discountPercent}% off</p>` : ''}
            ${booking.finalPrice > 0 ? `<p><strong style="color: #d4af37;">Total:</strong> ${booking.finalPrice} EGP</p>` : ''}
          </div>
          <p style="color: #ccc;">We look forward to seeing you! If you need to reschedule, please contact us at least 24 hours in advance.</p>
          <p style="color: #888; text-align: center; font-size: 14px;">📞 +20 10 2056 4047 | 19 Ali Amer, Nasr City, Cairo</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Booking confirmation email error:', error.message);
  }
};

module.exports = {
  sendAdminNotification,
  sendWelcomeEmail,
  sendBirthdayEmail,
  sendBookingConfirmation
};
