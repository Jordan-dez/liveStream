# Guide de Démarrage Rapide

Ce guide vous aide à démarrer rapidement le projet.

## Structure du Projet

```
livestream/
├── backend/          # Backend Lambda (Node.js + TypeScript)
├── frontend/         # Frontend React (TypeScript + Tailwind)
├── ARCHITECTURE.md   # Documentation architecture
├── USER_FLOW.md      # Flux utilisateur
└── SECURITY.md       # Considérations de sécurité
```

## Prérequis

- **Node.js 18+** installé
- **Docker Desktop** installé et démarré
- **Homebrew** (macOS) - voir [INSTALL_HOMEBREW.md](./INSTALL_HOMEBREW.md)
- **AWS SAM CLI** ou **Serverless Framework** - voir [backend/INSTALL_SAM.md](./backend/INSTALL_SAM.md)

## Démarrage Rapide

### 1. Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Compiler le TypeScript
npm run build

# Démarrer en local (choisir une option)
```

**Option A : Avec Serverless Framework (Recommandé pour développement)**

```bash
# Créer un fichier .env avec vos variables
# Voir backend/SERVERLESS_LOCAL.md pour les détails

# Démarrer avec DynamoDB Local
npm run sls:offline:dynamodb
```

**Option B : Avec AWS SAM**

```bash
# Créer le fichier env.json
cp env.json.example env.json
# Éditer env.json avec vos valeurs

# Démarrer
npm run dev
```

L'API sera disponible sur `http://localhost:3000` (SAM) ou `http://localhost:3000/dev` (Serverless).

### 2. Frontend

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# Éditer .env avec :
# VITE_API_URL=http://localhost:3000 (ou http://localhost:3000/dev pour Serverless)
# VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_stripe

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000` (ou un autre port si 3000 est occupé).

## Commandes Importantes

### Backend

```bash
cd backend

# Installation
npm install

# Build
npm run build

# Build en mode watch (rechargement automatique)
npm run build:watch

# Démarrage local
npm run sls:offline:dynamodb  # Serverless Framework
# ou
npm run dev                   # AWS SAM
```

### Frontend

```bash
cd frontend

# Installation
npm install

# Développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## Configuration

### Backend - Variables d'environnement

Créez un fichier `.env` dans `backend/` :

```env
JWT_SECRET=votre-secret-jwt-super-securise
JWT_EXPIRES_IN=24h
STREAM_TOKEN_EXPIRES_IN=2h
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=*
```

### Frontend - Variables d'environnement

Créez un fichier `.env` dans `frontend/` :

```env
VITE_API_URL=http://localhost:3000/dev
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
```

**Note** : Utilisez `/dev` si vous utilisez Serverless Framework, pas de préfixe pour SAM.

## Dépannage

### Erreur : "Could not read package.json"

Vous êtes dans le mauvais dossier. Assurez-vous d'être dans `backend/` ou `frontend/` :

```bash
# Vérifier où vous êtes
pwd

# Aller dans backend
cd backend

# ou aller dans frontend
cd frontend
```

### Erreur : "Docker is not running"

Démarrez Docker Desktop avant de lancer le backend.

### Erreur : "Port 3000 already in use"

Changez le port dans la configuration ou arrêtez l'autre processus.

### Erreur : "Module not found"

Réinstallez les dépendances :

```bash
rm -rf node_modules package-lock.json
npm install
```

## Documentation Complète

- **Architecture** : [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Flux utilisateur** : [USER_FLOW.md](./USER_FLOW.md)
- **Sécurité** : [SECURITY.md](./SECURITY.md)
- **Backend SAM** : [backend/LOCAL_DEVELOPMENT.md](./backend/LOCAL_DEVELOPMENT.md)
- **Backend Serverless** : [backend/SERVERLESS_LOCAL.md](./backend/SERVERLESS_LOCAL.md)
- **Frontend** : [frontend/README.md](./frontend/README.md)

## Prochaines Étapes

1. ✅ Installer les prérequis (Node.js, Docker, SAM/Serverless)
2. ✅ Configurer les variables d'environnement
3. ✅ Démarrer le backend
4. ✅ Démarrer le frontend
5. ✅ Tester l'application

Bon développement ! 🚀

