const User = require('../models/User');
const { sendBirthdayEmail } = require('./emailService');
const { v4: uuidv4 } = require('uuid');

const sendBirthdayDiscounts = async () => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    const currentYear = today.getFullYear();

    // Find users with birthday today who haven't received code this year
    const users = await User.find({
      birthday: { $exists: true, $ne: null },
      $expr: {
        $and: [
          { $eq: [{ $month: '$birthday' }, todayMonth] },
          { $eq: [{ $dayOfMonth: '$birthday' }, todayDay] }
        ]
      },
      $or: [
        { birthdayDiscountYear: { $ne: currentYear } },
        { birthdayDiscountYear: null }
      ]
    });

    console.log(`🎂 Found ${users.length} birthday users today`);

    for (const user of users) {
      // Generate unique 50% discount code
      const code = `BDAY50-${uuidv4().substring(0, 8).toUpperCase()}`;
      
      // Expiry: 30 days from today
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Add discount code to user
      user.discountCodes.push({
        code,
        discount: 50,
        used: false,
        expiresAt
      });
      user.birthdayDiscountYear = currentYear;
      await user.save();

      // Send birthday email with code
      await sendBirthdayEmail(user, code);
    }

    console.log(`✅ Birthday discounts sent to ${users.length} users`);
  } catch (error) {
    console.error('Birthday cron error:', error);
  }
};

module.exports = { sendBirthdayDiscounts };
