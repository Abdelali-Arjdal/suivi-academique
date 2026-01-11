const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  note: Number,
  type: String,
  date: Date
}, { collection: 'grades' });

module.exports = mongoose.model('Grade', gradeSchema);
