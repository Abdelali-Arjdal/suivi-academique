# Suivi académique des étudiants – MongoDB

Projet réalisé dans le cadre du module **Base de Données NoSQL (MongoDB)**.

---

## 🎯 Objectif du projet
Mettre en place une base de données MongoDB permettant de gérer :
- les étudiants
- les matières
- les notes

et de produire des statistiques académiques telles que :
- moyenne par étudiant
- moyenne par matière
- note minimale et maximale
- classement des étudiants
- taux de réussite

---

## 🗂️ Structure du projet

```
suivi-academique/
│
├── api/
│   ├── index.js              # Express app pour Vercel serverless
│   └── stats.routes.js       # Routes de statistiques
│
├── backend/
│   ├── config/
│   │   └── db.js            # Configuration MongoDB
│   ├── models/              # Modèles Mongoose
│   │   ├── Student.js
│   │   ├── Subject.js
│   │   └── Grade.js
│   └── routes/              # Routes API
│       ├── student.routes.js
│       ├── subject.routes.js
│       └── grade.routes.js
│
├── db/
│   └── database_init.js      # Script mongosh : création + insertion des données
│
├── queries/
│   └── Queries.js           # Requêtes MongoDB (statistiques)
│
├── public/                  # Fichiers statiques React
├── src/                     # Code source React
│   ├── components/
│   │   ├── Login.js
│   │   ├── StudentDashboard.js
│   │   ├── TeacherDashboard.js
│   │   └── AdminDashboard.js
│   ├── services/
│   │   └── api.js
│   └── App.js
│
├── vercel.json              # Configuration Vercel
├── package.json
└── README.md
```

---

## 🛠️ Technologies utilisées
- MongoDB
- Mongo Shell (mongosh)
- Node.js & Express
- React
- Chart.js
- Bootstrap
- Vercel (deployment)

---

## 🧩 Base de données

### Nom de la base
```
suivi_academique
```

### Collections
- `students`
- `subjects`
- `grades`

### Relations
- `grades.studentId` → `students._id`
- `grades.subjectId` → `subjects._id`

---

## 🚀 Installation locale

### 1️⃣ Prérequis
- Node.js (v14+)
- MongoDB (local ou Atlas)

### 2️⃣ Installation des dépendances
```bash
npm install
```

### 3️⃣ Configuration des variables d'environnement
Créez un fichier `.env` à la racine :
```env
MONGO_URI=mongodb://localhost:27017/suivi_academique
# Pour MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/suivi_academique
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

### 4️⃣ Initialiser la base de données
```bash
mongosh db/database_init.js
```

Ce script :
* crée la base de données
* crée les collections
* insère des données simulées
* crée les index nécessaires

### 5️⃣ Lancer l'application

**Mode développement (backend + frontend séparés):**
```bash
npm run dev
```

**Mode développement (frontend uniquement, si backend déjà lancé):**
```bash
npm start
```

Le frontend sera accessible sur http://localhost:3000
Le backend sera accessible sur http://localhost:5000

---

## 🚀 Déploiement sur Vercel

### 1️⃣ Prérequis
- Compte Vercel
- MongoDB Atlas (recommandé pour la production)

### 2️⃣ Configuration Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Configurez les variables d'environnement dans Vercel :
   - `MONGO_URI` : Votre chaîne de connexion MongoDB Atlas
   - `REACT_APP_API_URL` : `/api` (par défaut)

### 3️⃣ Déploiement
```bash
vercel
```

Ou utilisez l'interface Vercel pour déployer depuis GitHub.

### 4️⃣ Structure de déploiement
- **Frontend React** : Build statique déployé sur Vercel
- **API Express** : Serverless functions dans `/api`
- **Routes API** : Accessibles via `/api/*`

---

## 📡 API Endpoints

### Students
- `GET /api/students` - Liste tous les étudiants
- `GET /api/students/:id` - Détails d'un étudiant
- `POST /api/students` - Créer un étudiant

### Subjects
- `GET /api/subjects` - Liste toutes les matières
- `GET /api/subjects/:id` - Détails d'une matière
- `POST /api/subjects` - Créer une matière

### Grades
- `GET /api/grades` - Liste toutes les notes
- `GET /api/grades/:id` - Détails d'une note
- `GET /api/grades/student/:studentId` - Notes d'un étudiant
- `POST /api/grades` - Créer une note

### Statistics
- `GET /api/stats/subjects` - Statistiques par matière
- `GET /api/stats/students` - Moyennes par étudiant
- `GET /api/stats/rankings` - Classements par filière/niveau
- `GET /api/stats/kpi` - KPIs globaux

---

## 👥 Fonctionnalités

### Interface Étudiant
- Consultation des notes personnelles
- Visualisation de la moyenne générale
- Graphiques de progression

### Interface Enseignant
- Statistiques par matière
- Moyennes, min, max
- Taux de réussite

### Interface Administrateur
- Gestion des étudiants
- Gestion des matières
- Consultation des notes
- Statistiques globales

---

## 👨‍🎓 Auteurs

Projet réalisé par un groupe de 4 étudiants.

---

## 📌 Notes

- Le système d'authentification est simplifié pour la démo
- En production, implémentez une authentification complète (JWT, etc.)
- Utilisez MongoDB Atlas pour la production
- Configurez CORS selon vos besoins
