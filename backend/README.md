# Backend Lambda - Plateforme de Livestream

Backend serverless pour la plateforme de livestream payante utilisant AWS Lambda, API Gateway et DynamoDB.

## Structure du Projet

```
backend/
├── src/
│   ├── handlers/          # Fonctions Lambda
│   │   ├── auth/          # Authentification
│   │   ├── concerts/      # Gestion des concerts
│   │   ├── payment/       # Paiements Stripe
│   │   └── stream/        # Accès aux streams
│   ├── types/             # Types TypeScript
│   └── utils/             # Utilitaires partagés
├── template.yaml          # Configuration AWS SAM
├── tsconfig.json          # Configuration TypeScript
└── package.json           # Dépendances
```

## Prérequis

- Node.js 18+
- AWS CLI configuré (pour le déploiement)
- AWS SAM CLI installé (voir [INSTALL_SAM.md](./INSTALL_SAM.md))
- Docker Desktop installé et démarré
- Compte Stripe avec clés API

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

Cela compile le TypeScript vers JavaScript dans le dossier `dist/`.

## Développement Local

Deux options disponibles :

### Option 1 : AWS SAM (Recommandé pour production AWS)

Voir le guide complet dans [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md).

**Démarrage rapide SAM** :
```bash
npm install
cp env.json.example env.json
# Éditer env.json avec vos valeurs
npm run dev
```

### Option 2 : Serverless Framework (Recommandé pour développement)

Voir le guide complet dans [SERVERLESS_LOCAL.md](./SERVERLESS_LOCAL.md).

**Démarrage rapide Serverless** :
```bash
npm install
# Créer un fichier .env avec vos variables
npm run build
npm run sls:offline:dynamodb
```

L'API sera disponible sur `http://localhost:3000/dev` (notez le préfixe `/dev`).

## Déploiement

### 1. Configuration

Éditez `samconfig.toml` et remplacez les valeurs `CHANGE_ME`:
- `JWTSecret`: Secret pour signer les tokens JWT (générer avec `openssl rand -base64 32`)
- `StripeSecretKey`: Clé secrète Stripe (commence par `sk_`)
- `StripeWebhookSecret`: Secret du webhook Stripe (commence par `whsec_`)

### 2. Build et Déploiement

```bash
# Build
sam build

# Déploiement guidé (première fois)
sam deploy --guided

# Déploiement suivant
sam deploy
```

### 3. Configuration du Webhook Stripe

Après le déploiement, récupérez l'URL de l'API depuis les outputs:
```bash
aws cloudformation describe-stacks --stack-name livestream-backend --query "Stacks[0].Outputs"
```

Configurez le webhook Stripe:
1. Allez dans Stripe Dashboard > Webhooks
2. Ajoutez un endpoint: `https://<api-id>.execute-api.<region>.amazonaws.com/prod/payment/webhook`
3. Sélectionnez l'événement: `checkout.session.completed`
4. Copiez le secret du webhook et mettez à jour `samconfig.toml`

## Endpoints API

### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Rafraîchir le token
- `GET /auth/verify` - Vérifier le token

### Concerts
- `GET /concerts` - Liste des concerts
- `GET /concerts/{concertId}` - Détails d'un concert
- `POST /concerts` - Créer un concert (admin)

### Paiement
- `POST /payment/create-checkout` - Créer une session Stripe
- `POST /payment/webhook` - Webhook Stripe
- `POST /payment/verify` - Vérifier le statut de paiement

### Stream
- `POST /stream/access` - Obtenir un token d'accès
- `GET /stream/embed-url?token=...` - Obtenir l'URL d'embed
- `GET /stream/validate?token=...` - Valider un token

## Variables d'Environnement

Les variables d'environnement sont configurées dans `template.yaml`:
- `JWT_SECRET`: Secret pour JWT
- `JWT_EXPIRES_IN`: Expiration JWT (défaut: 24h)
- `STREAM_TOKEN_EXPIRES_IN`: Expiration token stream (défaut: 2h)
- `STRIPE_SECRET_KEY`: Clé secrète Stripe
- `STRIPE_WEBHOOK_SECRET`: Secret webhook Stripe
- `FRONTEND_URL`: URL du frontend
- `CORS_ORIGIN`: Origine CORS
- Tables DynamoDB: `USERS_TABLE`, `CONCERTS_TABLE`, `PURCHASES_TABLE`, `STREAM_TOKENS_TABLE`

## Développement Local

Pour tester localement avec SAM:

```bash
sam local start-api
```

Cela démarre un serveur API local sur `http://localhost:3000`.

## Tests

```bash
npm test
```

## Structure des Tables DynamoDB

### Users
- PK: `userId` (String)

### Concerts
- PK: `concertId` (String)
- GSI: `status-date-index` (status, scheduledDate)

### Purchases
- PK: `purchaseId` (String)
- GSI: `user-concerts-index` (userId, purchaseDate)
- GSI: `concert-purchases-index` (concertId, purchaseDate)

### StreamTokens
- PK: `tokenId` (String)
- TTL: `expiresAt` (Unix timestamp)

## Notes de Sécurité

- Les secrets ne doivent jamais être commités
- Utilisez AWS Secrets Manager en production
- Activez le chiffrement au repos pour DynamoDB
- Configurez WAF sur API Gateway en production
- Limitez les permissions IAM au strict nécessaire

