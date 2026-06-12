const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  amount:   { type: Number, required: true },
  reason:   { type: String, default: '' },
  month:    { type: String, required: true }, // "YYYY-MM"
  date:     { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
