# Vercel Deployment Guide

This guide explains how to deploy the Suivi Academique app to Vercel.

## Prerequisites
- GitHub repo with this project
- Vercel account
- MongoDB Atlas cluster (recommended for production)

## Step 1: Configure MongoDB Atlas
1) Create a free MongoDB Atlas cluster
2) Create a database user
3) Add your IP or use 0.0.0.0/0 for development
4) Copy the connection string

## Step 2: Add Environment Variables on Vercel
Set these in your Vercel project:
- `MONGO_URI`: your MongoDB Atlas connection string
- `REACT_APP_API_URL`: `/api` (optional, default is `/api`)

## Step 3: Deploy
### Option A: Vercel UI
1) Import the GitHub repo
2) Click Deploy

### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

For production:
```bash
vercel --prod
```

## Step 4: Initialize the Database
Run the seed script from your machine:
```bash
mongosh "your-connection-string" db/database_init.js
```

Or seed via Node:
```bash
npm run init-db
```

## Troubleshooting
- API not working: verify `MONGO_URI` and check Vercel logs
- Frontend not loading: check build logs and `vercel.json`
- Empty DB: run the seed script

## Notes
- `api/index.js` is the Vercel serverless entry point
- `backend/server.js` is used for local development
