# Guide de déploiement sur Vercel

Ce guide vous explique comment déployer l'application Suivi Académique sur Vercel.

## Prérequis

1. Un compte GitHub (le code doit être sur GitHub)
2. Un compte Vercel (gratuit)
3. Un cluster MongoDB Atlas (recommandé pour la production) ou une base MongoDB locale

## Étape 1 : Préparation du code

Assurez-vous que votre code est sur GitHub et que toutes les modifications sont committées :

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## Étape 2 : Créer un projet MongoDB Atlas (recommandé)

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit
3. Créez un cluster gratuit (M0)
4. Configurez un utilisateur de base de données
5. Ajoutez votre IP à la liste blanche (ou utilisez 0.0.0.0/0 pour le développement)
6. Obtenez votre chaîne de connexion (Connection String)

## Étape 3 : Déployer sur Vercel

### Option A : Via l'interface web Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "Add New Project"
4. Importez votre dépôt GitHub `suivi-academique`
5. Vercel détectera automatiquement les paramètres
6. Configurez les variables d'environnement :
   - `MONGO_URI` : Votre chaîne de connexion MongoDB Atlas
     - Exemple : `mongodb+srv://username:password@cluster.mongodb.net/suivi_academique?retryWrites=true&w=majority`
   - `REACT_APP_API_URL` : `/api` (par défaut, laissez vide pour utiliser `/api`)
7. Cliquez sur "Deploy"

### Option B : Via la CLI Vercel

1. Installez la CLI Vercel :
```bash
npm install -g vercel
```

2. Connectez-vous :
```bash
vercel login
```

3. Dans le dossier du projet, déployez :
```bash
cd suivi-academique
vercel
```

4. Suivez les instructions et ajoutez les variables d'environnement quand demandé

5. Pour la production :
```bash
vercel --prod
```

## Étape 4 : Configurer les variables d'environnement

Dans le tableau de bord Vercel :

1. Allez dans votre projet
2. Settings → Environment Variables
3. Ajoutez :
   - `MONGO_URI` : Votre chaîne de connexion MongoDB
   - (Optionnel) `REACT_APP_API_URL` : `/api`

## Étape 5 : Initialiser la base de données

Une fois déployé, vous devez initialiser la base de données :

1. Connectez-vous à MongoDB Atlas
2. Utilisez MongoDB Compass ou le shell MongoDB
3. Exécutez le script `db/database_init.js` :
   ```bash
   mongosh "your-connection-string" db/database_init.js
   ```

Ou importez les données manuellement via MongoDB Compass.

## Étape 6 : Tester l'application

1. Vercel vous fournira une URL (ex: `https://suivi-academique.vercel.app`)
2. Visitez l'URL
3. Testez les fonctionnalités :
   - Connexion (utilisez n'importe quel email, le système est en mode démo)
   - Consultation des données
   - Statistiques

## Structure de déploiement Vercel

- **Frontend React** : Build statique servi depuis le CDN Vercel
- **API Express** : Serverless function dans `/api/index.js`
- **Routes** :
  - `/api/*` → Express serverless function
  - `/*` → React app (SPA)

## Dépannage

### L'API ne fonctionne pas
- Vérifiez que `MONGO_URI` est correctement configuré
- Vérifiez les logs dans Vercel (Functions → Logs)
- Assurez-vous que MongoDB Atlas autorise les connexions depuis Vercel

### Le frontend ne charge pas
- Vérifiez que le build s'est terminé sans erreur
- Vérifiez les logs de build dans Vercel
- Assurez-vous que `vercel.json` est correct

### Erreurs CORS
- CORS est déjà configuré dans l'API
- Si vous avez des problèmes, vérifiez la configuration CORS dans `api/index.js`

### Base de données vide
- Exécutez le script d'initialisation `db/database_init.js`
- Vérifiez que vous êtes connecté à la bonne base de données

## Mise à jour du déploiement

Pour mettre à jour l'application :

1. Faites vos modifications
2. Committez et poussez sur GitHub :
   ```bash
   git add .
   git commit -m "Update"
   git push
   ```
3. Vercel déploiera automatiquement (si vous avez activé les déploiements automatiques)
4. Ou déployez manuellement : `vercel --prod`

## Support

Pour plus d'aide :
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)

