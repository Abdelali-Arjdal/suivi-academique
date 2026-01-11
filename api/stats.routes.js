const express = require("express");
const router = express.Router();
const Grade = require("../backend/models/Grade");
const Student = require("../backend/models/Student");
const Subject = require("../backend/models/Subject");
const mongoose = require("mongoose");

// Statistics by subject (for teachers)
router.get("/subjects", async (req, res) => {
  try {
    const stats = await Grade.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $group: {
          _id: "$subjectId",
          nomMatiere: { $first: "$subject.nom" },
          codeMatiere: { $first: "$subject.code" },
          coefficient: { $first: "$subject.coefficient" },
          moyenne: { $avg: "$note" },
          min: { $min: "$note" },
          max: { $max: "$note" },
          nbEtudiants: { $addToSet: "$studentId" },
          nbReussites: {
            $sum: {
              $cond: [{ $gte: ["$note", 10] }, 1, 0]
            }
          },
          totalNotes: { $sum: 1 }
        }
      },
      {
        $project: {
          matiereId: "$_id",
          matiere: "$nomMatiere",
          code: "$codeMatiere",
          coefficient: 1,
          moyenne: { $round: ["$moyenne", 2] },
          min: 1,
          max: 1,
          nbEtudiants: { $size: "$nbEtudiants" },
          nbReussites: 1,
          tauxReussite: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$nbReussites", "$totalNotes"] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $sort: { moyenne: -1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student averages (general)
router.get("/students", async (req, res) => {
  try {
    const averages = await Grade.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $group: {
          _id: "$studentId",
          totalWeighted: { $sum: { $multiply: ["$note", "$subject.coefficient"] } },
          totalCoefficients: { $sum: "$subject.coefficient" }
        }
      },
      {
        $project: {
          moyenneGenerale: { $divide: ["$totalWeighted", "$totalCoefficients"] }
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      {
        $unwind: "$studentInfo"
      },
      {
        $project: {
          studentId: "$_id",
          cne: "$studentInfo.cne",
          nom: "$studentInfo.nom",
          prenom: "$studentInfo.prenom",
          filiere: "$studentInfo.filiere",
          niveau: "$studentInfo.niveau",
          groupe: "$studentInfo.groupe",
          moyenneGenerale: { $round: ["$moyenneGenerale", 2] }
        }
      },
      {
        $sort: { moyenneGenerale: -1 }
      }
    ]);

    res.json(averages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rankings by filière and niveau
router.get("/rankings", async (req, res) => {
  try {
    const rankings = await Grade.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $group: {
          _id: "$studentId",
          totalWeighted: { $sum: { $multiply: ["$note", "$subject.coefficient"] } },
          totalCoefficients: { $sum: "$subject.coefficient" }
        }
      },
      {
        $project: {
          moyenne: { $divide: ["$totalWeighted", "$totalCoefficients"] }
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      {
        $unwind: "$student"
      },
      {
        $group: {
          _id: {
            filiere: "$student.filiere",
            niveau: "$student.niveau",
            groupe: "$student.groupe"
          },
          students: {
            $push: {
              cne: "$student.cne",
              nom: "$student.nom",
              prenom: "$student.prenom",
              moyenne: { $round: ["$moyenne", 2] }
            }
          }
        }
      },
      {
        $project: {
          filiere: "$_id.filiere",
          niveau: "$_id.niveau",
          groupe: "$_id.groupe",
          students: 1
        }
      },
      {
        $sort: { filiere: 1, niveau: 1, groupe: 1 }
      }
    ]);

    // Sort students by moyenne in JavaScript (more compatible)
    const sortedRankings = rankings.map(group => ({
      ...group,
      classement: group.students.sort((a, b) => b.moyenne - a.moyenne)
    }));

    res.json(sortedRankings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Global KPIs
router.get("/kpi", async (req, res) => {
  try {
    const kpi = await Grade.aggregate([
      {
        $lookup: {
          from: "subjects",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: { $multiply: ["$note", "$subject.coefficient"] } },
          totalCoefficients: { $sum: "$subject.coefficient" },
          totalNotes: { $sum: 1 },
          reussites: {
            $sum: { $cond: [{ $gte: ["$note", 10] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          moyenneGlobale: {
            $round: [
              { $divide: ["$totalPoints", "$totalCoefficients"] },
              2
            ]
          },
          tauxReussiteGlobal: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$reussites", "$totalNotes"] },
                  100
                ]
              },
              2
            ]
          },
          nbTotalEvaluations: "$totalNotes"
        }
      }
    ]);

    res.json(kpi[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

