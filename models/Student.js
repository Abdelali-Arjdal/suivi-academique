const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  cne: { type: String, required: true, unique: true },
  nom: String,
  prenom: String,
  filiere: String,
  niveau: String,
  groupe: String
}, { collection: 'students' });

module.exports = mongoose.model('Student', studentSchema);