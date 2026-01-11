// 2.1. Moyenne Générale par Étudiant

db.grades.aggregate([
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
      "studentInfo.cne": 1,
      "studentInfo.nom": 1,
      "studentInfo.prenom": 1,
      "studentInfo.filiere": 1,
      "studentInfo.niveau": 1,
      "studentInfo.groupe": 1,
      "moyenneGenerale": { $round: ["$moyenneGenerale", 2] }
    }
  },
  {
    $sort: { "moyenneGenerale": -1 }
  }
])

2.2. Classement par Filière et Niveau  :
db.grades.aggregate([
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
      classement: {
        $sortArray: {
          input: "$students",
          sortBy: { moyenne: -1 }
        }
      }
    }
  },
  {
    $sort: { filiere: 1, niveau: 1, groupe: 1 }
  }
])

//  Statistiques par Matière : 

db.grades.aggregate([
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
      ecartType: { $stdDevPop: "$note" },
      nbEtudiants: { $count: {} },
      nbReussites: { 
        $sum: { 
          $cond: [{ $gte: ["$note", 10] }, 1, 0] 
        } 
      }
    }
  },
  {
    $project: {
      nomMatiere: 1,
      codeMatiere: 1,
      coefficient: 1,
      moyenne: { $round: ["$moyenne", 2] },
      min: 1,
      max: 1,
      ecartType: { $round: ["$ecartType", 2] },
      nbEtudiants: 1,
      nbReussites: 1,
      tauxReussite: { 
        $round: [
          { 
            $multiply: [
              { $divide: ["$nbReussites", "$nbEtudiants"] }, 
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
])
// 2.4. Évolution des Notes par Type d'Évaluation : 
db.grades.aggregate([
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
      _id: {
        type: "$type",
        semester: "$subject.semester"
      },
      moyenne: { $avg: "$note" },
      min: { $min: "$note" },
      max: { $max: "$note" },
      nbEvaluations: { $count: {} }
    }
  },
  {
    $project: {
      typeEvaluation: "$_id.type",
      semestre: "$_id.semester",
      moyenne: { $round: ["$moyenne", 2] },
      min: 1,
      max: 1,
      nbEvaluations: 1
    }
  },
  {
    $sort: { semestre: 1, typeEvaluation: 1 }
  }
])

// 3.1. KPI de Performance Globale : 
db.grades.aggregate([
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
      totalNotes: { $count: {} },
      reussites: {
        $sum: { $cond: [{ $gte: ["$note", 10] }, 1, 0] }
      }
    }
  },
  {
    $project: {
      moyenneGlobale: { $round: [{ $divide: ["$totalPoints", "$totalCoefficients"] }, 2] },
      tauxReussiteGlobal: { $round: [{ $multiply: [{ $divide: ["$reussites", "$totalNotes"] }, 100] }, 2] },
      nbTotalEvaluations: "$totalNotes"
    }
  }
])
// 3.2. KPI par Filière : 
db.grades.aggregate([
  {
    $lookup: {
      from: "students",
      localField: "studentId",
      foreignField: "_id",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
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
      _id: "$student.filiere",
      totalPoints: { $sum: { $multiply: ["$note", "$subject.coefficient"] } },
      totalCoefficients: { $sum: "$subject.coefficient" },
      reussites: {
        $sum: { $cond: [{ $gte: ["$note", 10] }, 1, 0] }
      },
      totalNotes: { $count: {} },
      nbEtudiants: { $addToSet: "$student._id" }
    }
  },
  {
    $project: {
      filiere: "$_id",
      moyenneFiliere: { $round: [{ $divide: ["$totalPoints", "$totalCoefficients"] }, 2] },
      tauxReussite: { $round: [{ $multiply: [{ $divide: ["$reussites", "$totalNotes"] }, 100] }, 2] },
      nbEtudiants: { $size: "$nbEtudiants" }
    }
  },
  {
    $sort: { moyenneFiliere: -1 }
  }
])
// 3.3. KPI de Progression par Semestre : 
db.grades.aggregate([
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
      _id: "$subject.semester",
      moyenne: { $avg: "$note" },
      min: { $min: "$note" },
      max: { $max: "$note" },
      ecartType: { $stdDevPop: "$note" },
      nbNotes: { $count: {} }
    }
  },
  {
    $project: {
      semestre: "$_id",
      moyenne: { $round: ["$moyenne", 2] },
      min: 1,
      max: 1,
      ecartType: { $round: ["$ecartType", 2] },
      nbNotes: 1,
      progression: {
        $cond: [
          { $eq: ["$_id", 5] }, // Assuming semester 5 is the current one
          "reference",
          { $concat: ["semester ", { $toString: "$_id" }] }
        ]
      }
    }
  },
  {
    $sort: { semestre: 1 }
  }
])
// 4. Analyses Avancées : 
// 4.1. Détection des Performances Exceptionnelles :
db.grades.aggregate([
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
      _id: {
        studentId: "$studentId",
        subjectId: "$subjectId"
      },
      moyenneMatiere: { $avg: "$note" },
      ecartTypeMatiere: { $stdDevPop: "$note" },
      nbEvaluations: { $count: {} }
    }
  },
  {
    $match: {
      $or: [
        { moyenneMatiere: { $gte: 16 } },    // Excellente performance
        { moyenneMatiere: { $lte: 6 } },     // Performance faible nécessitant suivi
        { ecartTypeMatiere: { $gte: 4 } }    // Forte variabilité dans les notes
      ]
    }
  },
  {
    $lookup: {
      from: "students",
      localField: "_id.studentId",
      foreignField: "_id",
      as: "student"
    }
  },
  {
    $unwind: "$student"
  },
  {
    $lookup: {
      from: "subjects",
      localField: "_id.subjectId",
      foreignField: "_id",
      as: "subject"
    }
  },
  {
    $unwind: "$subject"
  },
  {
    $project: {
      "student.cne": 1,
      "student.nom": 1,
      "student.prenom": 1,
      "subject.nom": 1,
      "subject.code": 1,
      "moyenneMatiere": { $round: ["$moyenneMatiere", 2] },
      "ecartTypeMatiere": { $round: ["$ecartTypeMatiere", 2] },
      "typeAlerte": {
        $switch: {
          branches: [
            { case: { $gte: ["$moyenneMatiere", 16] }, then: "Excellence" },
            { case: { $lte: ["$moyenneMatiere", 6] }, then: "Suivi nécessaire" },
            { case: { $gte: ["$ecartTypeMatiere", 4] }, then: "Variabilité élevée" }
          ],
          default: "Normal"
        }
      }
    }
  },
  {
    $sort: { "typeAlerte": 1, "moyenneMatiere": -1 }
  }
])
// 4.2. Corrélations entre Matières : 
db.grades.aggregate([
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
      _id: {
        studentId: "$studentId",
        subjectCode: "$subject.code"
      },
      moyenneMatiere: { $avg: "$note" }
    }
  },
  {
    $group: {
      _id: "$_id.studentId",
      performances: {
        $push: {
          matiere: "$_id.subjectCode",
          moyenne: "$moyenneMatiere"
        }
      }
    }
  },
  {
    $match: {
      $expr: { $gt: [{ $size: "$performances" }, 1] } // Correction ici
    }
  },
  {
    $project: {
      _id: 1,
      performances: 1,
      pairsCorrelation: {
        $map: {
          input: { $range: [0, { $subtract: [{ $size: "$performances" }, 1] }] },
          as: "i",
          in: {
            $map: {
              input: { $range: [{ $add: ["$$i", 1] }, { $size: "$performances" }] },
              as: "j",
              in: {
                studentId: "$_id",
                matiere1: { $arrayElemAt: ["$performances.matiere", "$$i"] },
                matiere2: { $arrayElemAt: ["$performances.matiere", "$$j"] },
                note1: { $arrayElemAt: ["$performances.moyenne", "$$i"] },
                note2: { $arrayElemAt: ["$performances.moyenne", "$$j"] }
              }
            }
          }
        }
      }
    }
  },
  {
    $unwind: "$pairsCorrelation"
  },
  {
    $unwind: "$pairsCorrelation"
  },
  {
    $group: {
      _id: {
        matiere1: "$pairsCorrelation.matiere1",
        matiere2: "$pairsCorrelation.matiere2"
      },
      sommeX: { $sum: "$pairsCorrelation.note1" },
      sommeY: { $sum: "$pairsCorrelation.note2" },
      sommeXY: { $sum: { $multiply: ["$pairsCorrelation.note1", "$pairsCorrelation.note2"] } },
      sommeX2: { $sum: { $multiply: ["$pairsCorrelation.note1", "$pairsCorrelation.note1"] } },
      sommeY2: { $sum: { $multiply: ["$pairsCorrelation.note2", "$pairsCorrelation.note2"] } },
      nbPairs: { $count: {} }
    }
  },
  {
    $project: {
      matiere1: "$_id.matiere1",
      matiere2: "$_id.matiere2",
      correlation: {
        $let: {
          vars: {
            n: "$nbPairs",
            sumX: "$sommeX",
            sumY: "$sommeY",
            sumXY: "$sommeXY",
            sumX2: "$sommeX2",
            sumY2: "$sommeY2"
          },
          in: {
            $cond: [
              { 
                $or: [
                  { $eq: ["$$n", 0] },
                  { $eq: [{ $sqrt: { $multiply: [
                    { $subtract: [{ $multiply: ["$$n", "$$sumX2"] }, { $multiply: ["$$sumX", "$$sumX"] }] },
                    { $subtract: [{ $multiply: ["$$n", "$$sumY2"] }, { $multiply: ["$$sumY", "$$sumY"] }] }
                  ] } }, 0] }
                ]
              },
              0, // Éviter la division par zéro
              {
                $divide: [
                  { $subtract: [{ $multiply: ["$$n", "$$sumXY"] }, { $multiply: ["$$sumX", "$$sumY"] }] },
                  {
                    $sqrt: {
                      $multiply: [
                        { $subtract: [{ $multiply: ["$$n", "$$sumX2"] }, { $multiply: ["$$sumX", "$$sumX"] }] },
                        { $subtract: [{ $multiply: ["$$n", "$$sumY2"] }, { $multiply: ["$$sumY", "$$sumY"] }] }
                      ]
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    }
  },
  {
    $project: {
      matiere1: 1,
      matiere2: 1,
      correlation: { $round: ["$correlation", 3] },
      forceCorrelation: {
        $switch: {
          branches: [
            { case: { $gte: [{ $abs: "$correlation" }, 0.7] }, then: "Forte" },
            { case: { $gte: [{ $abs: "$correlation" }, 0.3] }, then: "Modérée" },
            { case: { $gte: [{ $abs: "$correlation" }, 0.1] }, then: "Faible" }
          ],
          default: "Nulle"
        }
      },
      typeCorrelation: {
        $cond: [{ $gte: ["$correlation", 0] }, "Positive", "Négative"]
      }
    }
  },
  {
    $sort: { correlation: -1 }
  }
])