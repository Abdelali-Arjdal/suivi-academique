const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  nom: String,
  semester: Number,
  coefficient: Number
}, { collection: 'subjects' });

module.exports = mongoose.model('Subject', subjectSchema);