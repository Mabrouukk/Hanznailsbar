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
      subject: 'New Customer Registration - Hanz Nails',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 30px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">New Customer Registered</h1>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #d4af37;">Name:</strong> ${user.name}</p>
            <p><strong style="color: #d4af37;">Email:</strong> ${user.email}</p>
            <p><strong style="color: #d4af37;">Phone:</strong> ${user.phone}</p>
            <p><strong style="color: #d4af37;">Birthday:</strong> ${user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not provided'}</p>
            <p><strong style="color: #d4af37;">Registered:</strong> ${new Date().toLocaleString()}</p>
          </div>
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
      subject: 'Welcome to Hanz Nails Salon!',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center; font-size: 32px;">HANZ NAILS</h1>
          <hr style="border-color: #d4af37; margin: 20px 0;">
          <h2 style="color: #fff;">Welcome, ${user.name}!</h2>
          <p style="color: #ccc;">We are thrilled to have you as part of the Hanz Nails family!</p>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37;">
            <ul style="color: #ccc; line-height: 2;">
              <li>Professional nail services</li>
              <li>Free coffee, iced coffee and matcha</li>
              <li>Special 50% birthday discount</li>
              <li>Only certified professional technicians</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/booking" style="background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Book Your Appointment</a>
          </div>
          <p style="color: #888; text-align: center; font-size: 14px;">
            19 Ali Amer, Nasr City, Cairo — +20 10 2056 4047
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
      subject: 'Happy Birthday! Your 50% Off Gift from Hanz Nails',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">Happy Birthday ${user.name}!</h1>
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
      subject: 'Booking Received - Hanz Nails Salon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">Booking Received!</h1>
          <p style="color: #ccc; text-align: center;">We will confirm your appointment shortly.</p>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #d4af37;">Service:</strong> ${booking.service}</p>
            <p><strong style="color: #d4af37;">Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong style="color: #d4af37;">Time:</strong> ${booking.time}</p>
            ${booking.finalPrice > 0 ? `<p><strong style="color: #d4af37;">Total:</strong> ${booking.finalPrice} EGP</p>` : ''}
          </div>
          <p style="color: #888; text-align: center; font-size: 14px;">+20 10 2056 4047 | 19 Ali Amer, Nasr City, Cairo</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Booking confirmation email error:', error.message);
  }
};

const sendBookingStatusEmail = async (booking) => {
  try {
    const userEmail = booking.userEmail || (booking.user && booking.user.email);
    const userName = booking.userName || (booking.user && booking.user.name);
    const isConfirmed = booking.status === 'confirmed';

    await transporter.sendMail({
      from: `"Hanz Nails Salon" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: isConfirmed
        ? 'Your Appointment is Confirmed - Hanz Nails'
        : 'Your Appointment has been Cancelled - Hanz Nails',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">HANZ NAILS</h1>
          <hr style="border-color: #d4af37; margin: 20px 0;">
          <h2 style="text-align: center; color: ${isConfirmed ? '#4CAF50' : '#f44336'};">
            ${isConfirmed ? 'Appointment Confirmed!' : 'Appointment Cancelled'}
          </h2>
          <p style="color: #ccc; text-align: center;">
            ${isConfirmed
              ? `Hi ${userName}, your appointment has been confirmed. We look forward to seeing you!`
              : `Hi ${userName}, your appointment has been cancelled. Please contact us to reschedule.`
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
            <p style="color: #ccc;">Free coffee, iced coffee and matcha awaits you!</p>
          </div>
          ` : `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.CLIENT_URL}/booking" style="background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Book Again</a>
          </div>
          `}
          <p style="color: #888; text-align: center; font-size: 14px;">
            19 Ali Amer, Nasr City, Cairo — +20 10 2056 4047
          </p>
        </div>
      `
    });
    console.log(`Email sent to ${userEmail} - ${booking.status}`);
  } catch (error) {
    console.error('Status email error:', error.message);
  }
};

const sendGuestBookingConfirmation = async (booking) => {
  try {
    await transporter.sendMail({
      from: `"Hanz Nails Salon" <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: 'Booking Request Received - Hanz Nails Salon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center;">HANZ NAILS</h1>
          <hr style="border-color: #d4af37; margin: 20px 0;">
          <h2 style="color: #fff;">Hi ${booking.userName}!</h2>
          <p style="color: #ccc;">We received your booking request and will confirm shortly!</p>
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong style="color: #d4af37;">Service:</strong> ${booking.service}</p>
            <p><strong style="color: #d4af37;">Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong style="color: #d4af37;">Time:</strong> ${booking.time}</p>
            ${booking.finalPrice > 0 ? `<p><strong style="color: #d4af37;">Price:</strong> ${booking.finalPrice} EGP</p>` : ''}
          </div>
          <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; border-left: 4px solid #d4af37;">
            <p style="color: #ccc; margin: 0;">Register for a free account to get birthday discounts and booking history!</p>
            <a href="${process.env.CLIENT_URL}/register" style="color: #d4af37;">Register here</a>
          </div>
          <p style="color: #888; text-align: center; font-size: 14px; margin-top: 20px;">
            19 Ali Amer, Nasr City, Cairo — +20 10 2056 4047
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Guest booking email error:', error.message);
  }
};

module.exports = {
  sendAdminNotification,
  sendWelcomeEmail,
  sendBirthdayEmail,
  sendBookingConfirmation,
  sendBookingStatusEmail,
  sendGuestBookingConfirmation
};