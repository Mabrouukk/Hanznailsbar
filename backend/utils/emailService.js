const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
  } catch (error) {
    console.error('Admin notification error:', error.message);
  }
};

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
          <p style="color: #ccc;">We're thrilled to have you as part of the Hanz Nails family!</p>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37;">
            <h3 style="color: #d4af37;">What awaits you:</h3>
            <ul style="color: #ccc; line-height: 2;">
              <li>✨ Professional nail services</li>
              <li>☕ Free coffee, iced coffee & matcha</li>
              <li>🎂 Special 50% birthday discount</li>
              <li>👑 Only certified professional technicians</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/booking" style="background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Book Your Appointment</a>
          </div>
          <p style="color: #888; text-align: center; font-size: 14px;">
            📍 19 Ali Amer, Nasr City, Cairo<br>
            📞 +20 10 2056 4047<br>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Welcome email error:', error.message);
  }
};

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
          <div style="background: #2a2a2a; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #d4af37;">
            <h1 style="color: #fff; font-size: 48px; margin: 10px 0;">50% OFF</h1>
            <div style="background: #d4af37; color: #000; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; display: inline-block; letter-spacing: 4px; margin-top: 15px;">
              ${code}
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 15px;">Valid for 30 days</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/booking" style="background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Redeem Your Gift</a>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Birthday email error:', error.message);
  }
};

const sendBookingConfirmation = async (user, booking) => {
  try {
    await transporter.sendMail({
      from: `"Hanz Nails Salon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '✅ Booking Received - Hanz Nails Salon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">Booking Received!</h1>
          <p style="color: #ccc; text-align: center;">We'll confirm your appointment shortly.</p>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #d4af37;">Service:</strong> ${booking.service}</p>
            <p><strong style="color: #d4af37;">Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong style="color: #d4af37;">Time:</strong> ${booking.time}</p>
            ${booking.finalPrice > 0 ? `<p><strong style="color: #d4af37;">Total:</strong> ${booking.finalPrice} EGP</p>` : ''}
          </div>
          <p style="color: #888; text-align: center; font-size: 14px;">📞 +20 10 2056 4047 | 19 Ali Amer, Nasr City, Cairo</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Booking confirmation email error:', error.message);
  }
};

// NEW: Send status update email when admin confirms or cancels
const sendBookingStatusEmail = async (booking) => {
  try {
    const user = booking.user;
    const isConfirmed = booking.status === 'confirmed';

    await transporter.sendMail({
      from: `"Hanz Nails Salon" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: isConfirmed
        ? '✅ Your Appointment is Confirmed - Hanz Nails'
        : '❌ Your Appointment has been Cancelled - Hanz Nails',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">HANZ NAILS</h1>
          <hr style="border-color: #d4af37; margin: 20px 0;">
          <h2 style="text-align: center; color: ${isConfirmed ? '#4CAF50' : '#f44336'};">
            ${isConfirmed ? '✅ Appointment Confirmed!' : '❌ Appointment Cancelled'}
          </h2>
          <p style="color: #ccc; text-align: center;">
            ${isConfirmed
              ? `Hi ${user.name}, your appointment has been confirmed. We look forward to seeing you!`
              : `Hi ${user.name}, unfortunately your appointment has been cancelled. Please contact us to reschedule.`
            }
          </p>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${isConfirmed ? '#4CAF50' : '#f44336'};">
            <p><strong style="color: #d4af37;">Service:</strong> ${booking.service}</p>
            <p><strong style="color: #d4af37;">Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong style="color: #d4af37;">Time:</strong> ${booking.time}</p>
            ${booking.finalPrice > 0 ? `<p><strong style="color: #d4af37;">Total:</strong> ${booking.finalPrice} EGP</p>` : ''}
          </div>
          ${isConfirmed ? `
          <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #d4af37;">Remember to bring:</h3>
            <ul style="color: #ccc;">
              <li>Nothing! Just yourself 😊</li>
              <li>We provide everything you need</li>
              <li>Free coffee, iced coffee & matcha awaits you</li>
            </ul>
          </div>
          ` : `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.CLIENT_URL}/booking" style="background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Book Again</a>
          </div>
          `}
          <p style="color: #888; text-align: center; font-size: 14px;">
            📍 19 Ali Amer, Nasr City, Cairo<br>
            📞 +20 10 2056 4047<br>
            💬 <a href="https://wa.me/201020564047" style="color: #d4af37;">WhatsApp Us</a>
          </p>
        </div>
      `
    });
    console.log(`📧 Status email sent to ${user.email} - ${booking.status}`);
  } catch (error) {
    console.error('Status email error:', error.message);
  }
};

module.exports = {
  sendBookingStatusEmail,
  sendAdminNotification,
  sendWelcomeEmail,
  sendBirthdayEmail,
  sendBookingConfirmation,
  sendBookingStatusEmail
};