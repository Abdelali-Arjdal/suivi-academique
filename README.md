# Suivi Academique (MongoDB)

Academic tracking system for students, subjects, grades, and statistics. Built with React, Express, and MongoDB, and ready for Vercel.

## Features
- CRUD endpoints for students, subjects, and grades
- Role-based UI (admin, teacher, student) with a demo login
- Charts and KPI dashboards for academic stats
- MongoDB initialization scripts for sample data

## Tech Stack
- React, React Router, Bootstrap, Chart.js
- Node.js, Express, Mongoose
- MongoDB (local or Atlas)
- Vercel deployment

## Quick Start
1) Install dependencies
```bash
npm install
```

2) Create your environment file
```bash
copy .env.example .env
```

3) Initialize the database (optional sample data)
```bash
npm run init-db
```

4) Run the app (API + React)
```bash
npm run dev
```

Frontend: http://localhost:3000
API: http://localhost:5000

## Scripts
- `npm run dev`: start React + API with a single command
- `npm run server`: start only the API (Express)
- `npm start`: start only the React app
- `npm run build`: production build for React
- `npm run init-db`: seed the database with sample data
- `npm run test-connection`: verify MongoDB connection and list collections

## Demo Login
The app uses a simple, demo-only login. Your role is inferred from the email:
- `admin` in email -> admin
- `teacher` or `enseignant` in email -> teacher
- anything else -> student

## Project Structure
```
api/                 Serverless entry for Vercel
backend/             Express API for local dev
  config/            Mongo connection
  models/            Mongoose schemas
  routes/            REST endpoints
  server.js          Local API server
  
db/                  Mongo shell seed script
queries/             MongoDB aggregation examples
scripts/             Node-based DB helpers
public/              React static assets
src/                 React application
vercel.json          Vercel config
```

## API Endpoints
- `GET /api/health`
- `GET /api/students`
- `GET /api/students/:id`
- `POST /api/students`
- `GET /api/subjects`
- `GET /api/subjects/:id`
- `POST /api/subjects`
- `GET /api/grades`
- `GET /api/grades/:id`
- `GET /api/grades/student/:studentId`
- `POST /api/grades`
- `GET /api/stats/subjects`
- `GET /api/stats/students`
- `GET /api/stats/rankings`
- `GET /api/stats/kpi`

## Deployment
See `DEPLOYMENT.md` for Vercel setup and Atlas configuration.

## Contributing
See `CONTRIBUTING.md` for workflow and guidelines.

## License
MIT. See `LICENSE`.
