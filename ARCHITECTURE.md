# Architecture Globale - Plateforme de Livestream Payante

## Vue d'ensemble

Cette plateforme permet aux utilisateurs d'accéder à des concerts en direct via YouTube Live après paiement. L'accès est temporaire et sécurisé par session.

## Composants Principaux

### 1. Frontend (React + TypeScript + Tailwind)
- **Localisation**: Application web déployée (S3 + CloudFront ou Vercel/Netlify)
- **Responsabilités**:
  - Interface utilisateur pour la découverte de concerts
  - Intégration Stripe Checkout pour le paiement
  - Lecteur vidéo personnalisé (iframe YouTube masquée)
  - Gestion de l'authentification JWT
  - Gestion des sessions d'accès temporaires

### 2. Backend (AWS Lambda + API Gateway)
- **Architecture Serverless**:
  - API Gateway REST API comme point d'entrée
  - Lambda Functions (Node.js 18) pour la logique métier
  - DynamoDB pour le stockage des données

#### Fonctions Lambda Principales:

**Auth Service:**
- `auth/login` - Authentification utilisateur
- `auth/register` - Inscription
- `auth/refresh` - Rafraîchissement du token JWT
- `auth/verify` - Vérification du token

**Concert Service:**
- `concerts/list` - Liste des concerts disponibles
- `concerts/get` - Détails d'un concert
- `concerts/create` - Création d'un concert (admin)

**Payment Service:**
- `payment/create-checkout` - Création d'une session Stripe Checkout
- `payment/webhook` - Webhook Stripe pour confirmer le paiement
- `payment/verify` - Vérification du statut de paiement

**Stream Service:**
- `stream/access` - Génération d'un token d'accès temporaire pour un concert
- `stream/validate` - Validation du token d'accès
- `stream/embed-url` - Génération d'une URL d'embed sécurisée (sans révéler le lien YouTube)

### 3. Base de Données (DynamoDB)

#### Tables:

**Users**
- PK: `userId` (String)
- Attributes: email, passwordHash, createdAt, role

**Concerts**
- PK: `concertId` (String)
- Attributes: title, description, artist, scheduledDate, youtubeVideoId, price, status, createdAt
- GSI: `status-date-index` (status, scheduledDate) pour les requêtes de liste

**Purchases**
- PK: `purchaseId` (String)
- SK: `userId#concertId` (String) - Composite key
- Attributes: userId, concertId, stripeSessionId, status, purchaseDate, expiresAt
- GSI: `user-concerts-index` (userId, purchaseDate) pour les concerts achetés par un utilisateur
- GSI: `concert-purchases-index` (concertId, purchaseDate) pour les statistiques

**StreamTokens**
- PK: `tokenId` (String) - Token JWT court
- Attributes: userId, concertId, expiresAt, createdAt
- TTL: expiresAt (suppression automatique)

### 4. Services Externes

**Stripe**
- Checkout Session pour le paiement
- Webhooks pour les événements de paiement
- Mode: Production avec clés API sécurisées

**YouTube Live**
- Vidéos privées ou non listées
- API YouTube Data v3 pour la gestion (optionnel)
- Embed via iframe avec paramètres de sécurité

## Flux de Données

```
User → Frontend (React)
  ↓
Frontend → API Gateway
  ↓
API Gateway → Lambda Functions
  ↓
Lambda → DynamoDB (lecture/écriture)
  ↓
Lambda → Stripe (paiement)
  ↓
Lambda → Frontend (réponse)
  ↓
Frontend → YouTube Embed (lecture vidéo)
```

## Sécurité des URLs YouTube

- Les URLs YouTube brutes ne sont jamais exposées au frontend
- Le backend génère un token d'accès temporaire après vérification du paiement
- Le frontend utilise ce token pour obtenir une URL d'embed sécurisée
- L'URL d'embed est valide uniquement pendant la durée de la session
- Les tokens expirent automatiquement (TTL DynamoDB)

## Déploiement

### Frontend
- Build: `npm run build`
- Déploiement: S3 + CloudFront ou Vercel/Netlify
- Variables d'environnement: API Gateway URL, Stripe Public Key

### Backend
- Infrastructure: AWS SAM ou Serverless Framework
- Déploiement: `sam deploy` ou `serverless deploy`
- Variables d'environnement Lambda:
  - JWT_SECRET
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
  - DYNAMODB_TABLE_NAMES

## Monitoring & Logs

- CloudWatch Logs pour les Lambda Functions
- CloudWatch Metrics pour les performances API Gateway
- Stripe Dashboard pour les transactions
- DynamoDB CloudWatch Metrics pour les performances DB

