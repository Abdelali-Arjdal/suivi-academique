/************************************************************
 * MongoDB Initialization Script
 * Project: Suivi académique des étudiants
 *
 * How to run:
 *   mongosh db/database_init.js
 *
 * This script will:
 *  - Create the database
 *  - Create collections
 *  - Insert sample data
 *  - Create indexes
 *
 * ⚠️ DO NOT MODIFY STRUCTURE WITHOUT TEAM AGREEMENT
 ************************************************************/

/* =========================
   1) USE / CREATE DATABASE
   ========================= */
db = db.getSiblingDB("suivi_academique");


/* =========================
   2) CLEAN START (OPTIONAL)
   Drop collections if they exist
   ========================= */
db.students.drop();
db.subjects.drop();
db.grades.drop();


/* =========================
   3) CREATE COLLECTIONS
   ========================= */
db.createCollection("students");
db.createCollection("subjects");
db.createCollection("grades");


/* =========================
   4) CREATE INDEXES
   ========================= */

/* Unique identifiers */
db.students.createIndex({ cne: 1 }, { unique: true });
db.subjects.createIndex({ code: 1 }, { unique: true });

/* Performance indexes */
db.grades.createIndex({ studentId: 1 });
db.grades.createIndex({ subjectId: 1 });
db.grades.createIndex({ studentId: 1, subjectId: 1 });


/* =========================
   5) INSERT SUBJECTS
   ========================= */
db.subjects.insertMany([
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


/* =========================
   6) INSERT STUDENTS
   ========================= */

/* Sample Moroccan names */
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

/* Utility function to pad numbers */
function pad(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

/* Generate students */
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

db.students.insertMany(students);


/* =========================
   7) INSERT GRADES
   ========================= */

/* Get IDs */
const studentIds = db.students.find({}, { _id: 1 }).toArray().map(s => s._id);
const subjectIds = db.subjects.find({}, { _id: 1 }).toArray().map(s => s._id);

/* Helper functions */
function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

/* Normal distribution for realistic grades */
function randomGrade(mean, std) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* Generate grades */
const grades = [];
const now = new Date();

studentIds.forEach(studentId => {
  subjectIds.forEach(subjectId => {
    grades.push({
      studentId,
      subjectId,
      note: Math.round(clamp(randomGrade(12, 3), 0, 20) * 10) / 10,
      type: "control",
      date: new Date(now.getTime() - Math.random() * 60 * 86400000)
    });

    grades.push({
      studentId,
      subjectId,
      note: Math.round(clamp(randomGrade(11, 3.5), 0, 20) * 10) / 10,
      type: "exam",
      date: new Date(now.getTime() - Math.random() * 60 * 86400000)
    });
  });
});

db.grades.insertMany(grades);


/* =========================
   8) FINAL CHECK
   ========================= */
print("Database initialization completed successfully.");
print("Students:", db.students.countDocuments());
print("Subjects:", db.subjects.countDocuments());
print("Grades:", db.grades.countDocuments());
