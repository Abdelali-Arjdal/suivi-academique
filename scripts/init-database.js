/**
 * Database Initialization Script for MongoDB Atlas
 * 
 * This script initializes the database with sample data.
 * Run this after setting up MongoDB Atlas connection in .env
 * 
 * Usage: node scripts/init-database.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../backend/models/Student');
const Subject = require('../backend/models/Subject');
const Grade = require('../backend/models/Grade');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

async function initializeDatabase() {
  try {
    await connectDB();

    console.log('\n🗑️  Clearing existing data...');
    await Student.deleteMany({});
    await Subject.deleteMany({});
    await Grade.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Insert Subjects
    console.log('📚 Inserting subjects...');
    const subjects = await Subject.insertMany([
      { code: "BDN", nom: "Base de Données NoSQL", semester: 5, coefficient: 2 },
      { code: "JAVA", nom: "Programmation Java", semester: 5, coefficient: 2 },
      { code: "WEB", nom: "Développement Web", semester: 5, coefficient: 2 },
      { code: "RESEAU", nom: "Réseaux", semester: 5, coefficient: 2 },
      { code: "SECU", nom: "Sécurité Informatique", semester: 5, coefficient: 2 },
      { code: "AI", nom: "Intelligence Artificielle", semester: 5, coefficient: 2 },
      { code: "ML", nom: "Machine Learning", semester: 5, coefficient: 2 },
      { code: "UML", nom: "Modélisation UML", semester: 5, coefficient: 1 },
      { code: "GEST", nom: "Gestion de Projet", semester: 5, coefficient: 1 },
      { code: "ANG", nom: "Anglais", semester: 5, coefficient: 1 }
    ]);
    console.log(`✅ ${subjects.length} subjects inserted\n`);

    // Insert Students
    console.log('👨‍🎓 Inserting students...');
    const firstNames = [
      "Youssef","Ahmed","Hamza","Omar","Ayoub","Mehdi","Anas","Said","Ilyas","Rachid",
      "Amine","Zakaria","Soufiane","Hicham","Karim","Imane","Salma","Aya","Sara","Ikram",
      "Khadija","Nour","Meryem","Hajar","Fatima","Asmae","Nadia","Houda","Wafae","Chaimae"
    ];
    
    const lastNames = [
      "El Amrani","Bennani","El Idrissi","Alaoui","Tazi","Chraibi","Berrada","Ouazzani",
      "El Fassi","Rifi","Benjelloun","Kabbaj","Skalli","Lahlou","Zerouali","Belkadi"
    ];
    
    const filieres = ["GI","ID","GSTR","GE","GC"];
    const niveaux = ["2A","3A"];
    const groupes = ["G1","G2","G3"];
    
    function pad(num, size) {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    }
    
    const students = [];
    for (let i = 1; i <= 100; i++) {
      students.push({
        cne: "R" + pad(i, 9),
        nom: lastNames[Math.floor(Math.random() * lastNames.length)],
        prenom: firstNames[Math.floor(Math.random() * firstNames.length)],
        filiere: filieres[Math.floor(Math.random() * filieres.length)],
        niveau: niveaux[Math.floor(Math.random() * niveaux.length)],
        groupe: groupes[Math.floor(Math.random() * groupes.length)]
      });
    }
    
    const insertedStudents = await Student.insertMany(students);
    console.log(`✅ ${insertedStudents.length} students inserted\n`);

    // Insert Grades
    console.log('📝 Inserting grades...');
    const studentIds = insertedStudents.map(s => s._id);
    const subjectIds = subjects.map(s => s._id);
    
    function clamp(x, min, max) {
      return Math.max(min, Math.min(max, x));
    }
    
    function randomGrade(mean, std) {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    
    const grades = [];
    const now = new Date();
    
    for (const studentId of studentIds) {
      for (const subjectId of subjectIds) {
        // Control grade
        grades.push({
          studentId,
          subjectId,
          note: Math.round(clamp(randomGrade(12, 3), 0, 20) * 10) / 10,
          type: "control",
          date: new Date(now.getTime() - Math.random() * 60 * 86400000)
        });
        
        // Exam grade
        grades.push({
          studentId,
          subjectId,
          note: Math.round(clamp(randomGrade(11, 3.5), 0, 20) * 10) / 10,
          type: "exam",
          date: new Date(now.getTime() - Math.random() * 60 * 86400000)
        });
      }
    }
    
    // Insert in batches to avoid memory issues
    const batchSize = 500;
    let insertedCount = 0;
    for (let i = 0; i < grades.length; i += batchSize) {
      const batch = grades.slice(i, i + batchSize);
      await Grade.insertMany(batch);
      insertedCount += batch.length;
      process.stdout.write(`\r⏳ Inserted ${insertedCount}/${grades.length} grades...`);
    }
    console.log(`\n✅ ${grades.length} grades inserted\n`);

    // Final statistics
    const studentCount = await Student.countDocuments();
    const subjectCount = await Subject.countDocuments();
    const gradeCount = await Grade.countDocuments();
    
    console.log('📊 Database initialized successfully!');
    console.log(`   Students: ${studentCount}`);
    console.log(`   Subjects: ${subjectCount}`);
    console.log(`   Grades: ${gradeCount}`);
    console.log('\n✅ You can now refresh your application!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();


