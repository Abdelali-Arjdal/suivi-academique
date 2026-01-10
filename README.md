```md
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
├── db/
│   └── database_init.js      # Script mongosh : création + insertion des données
│
├── backend/                  # API (PHP / Node.js / Python)
│
├── frontend/                 # Interface utilisateur
│
├── queries/
│   └── aggregations.js       # Requêtes MongoDB (statistiques)
│
└── README.md

```

---

## 🛠️ Technologies utilisées
- MongoDB
- Mongo Shell (mongosh)
- Git & GitHub
- Backend : PHP / Node.js / Python
- Frontend : React / Angular / HTML-CSS-JS

---

## 🧩 Base de données

### Nom de la base
```

suivi_academique

````

### Collections
- `students`
- `subjects`
- `grades`

### Relations
- `grades.studentId` → `students._id`
- `grades.subjectId` → `subjects._id`

⚠️ Les noms des collections et des champs ne doivent pas être modifiés sans accord du groupe.

---

## 🚀 Installation rapide (local)

### 1️⃣ Lancer MongoDB
Assurez-vous que MongoDB est démarré (local ou Atlas).

### 2️⃣ Initialiser la base de données
```bash
mongosh db/database_init.js
````

Ce script :

* crée la base de données
* crée les collections
* insère des données simulées
* crée les index nécessaires

---

## 👥 Travail en équipe

* Chaque membre travaille dans son dossier uniquement :

  * Base de données → `db/`
  * Backend → `backend/`
  * Frontend → `frontend/`
  * Requêtes → `queries/`
* Toujours exécuter :

```bash
git pull
```

avant de commencer à travailler.

* Les modifications de la structure MongoDB passent obligatoirement par le responsable base de données.

---

## 👨‍🎓 Auteurs

Projet réalisé par un groupe de 4 étudiants.

---

## 📌 Remarque

Ce projet respecte le cycle de vie classique d’un logiciel :

* analyse
* conception
* implémentation
* tests

```
```
 
