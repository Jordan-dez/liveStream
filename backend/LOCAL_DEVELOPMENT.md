# Guide de Développement Local - Backend

Ce guide explique comment démarrer et tester le backend Lambda en local.

## Prérequis

1. **Node.js 18+** installé
2. **AWS SAM CLI** installé
   ```bash
   # macOS
   brew install aws-sam-cli
   
   # Linux
   pip install aws-sam-cli
   
   # Windows
   # Télécharger depuis https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
   ```

3. **Docker Desktop** installé et démarré
   - SAM utilise Docker pour simuler l'environnement Lambda localement

4. **AWS CLI** configuré (optionnel, pour les tests avec de vraies ressources AWS)

## Installation

```bash
cd backend
npm install
```

## Configuration

### 1. Variables d'environnement locales

Créez un fichier `env.json` à la racine du dossier `backend` :

```json
{
  "Parameters": {
    "JWTSecret": "votre-secret-jwt-super-securise-changez-moi",
    "StripeSecretKey": "sk_test_votre_cle_stripe_test",
    "StripeWebhookSecret": "whsec_votre_webhook_secret",
    "FrontendUrl": "http://localhost:3000",
    "CorsOrigin": "*"
  }
}
```

**Important** : Utilisez des clés Stripe en mode test pour le développement local.

### 2. Configuration DynamoDB Local (Optionnel)

Pour tester avec DynamoDB local, vous pouvez utiliser DynamoDB Local :

```bash
# Installer DynamoDB Local
docker run -p 8000:8000 amazon/dynamodb-local

# Dans un autre terminal, créer les tables
aws dynamodb create-table \
  --endpoint-url http://localhost:8000 \
  --table-name Users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

Ou utilisez directement les tables DynamoDB dans AWS (recommandé pour MVP).

## Démarrage en Local

### 1. Compiler le TypeScript

```bash
npm run build
```

Cela compile le code TypeScript vers JavaScript dans le dossier `dist/`.

### 2. Démarrer l'API locale

```bash
sam build
sam local start-api --env-vars env.json
```

Cela démarre un serveur API Gateway local sur `http://localhost:3000`.

**Note** : Le port peut être différent. Vérifiez la sortie de la commande.

### 3. Alternative : Démarrer avec hot-reload

Pour le développement avec rechargement automatique :

```bash
# Terminal 1 : Watch TypeScript
npm run build -- --watch

# Terminal 2 : SAM avec rechargement
sam build --use-container
sam local start-api --env-vars env.json --warm-containers EAGER
```

## Structure des Endpoints Locaux

Une fois démarré, les endpoints seront disponibles sur :

- `http://localhost:3000/auth/login` (POST)
- `http://localhost:3000/auth/register` (POST)
- `http://localhost:3000/auth/refresh` (POST)
- `http://localhost:3000/auth/verify` (GET)
- `http://localhost:3000/concerts` (GET)
- `http://localhost:3000/concerts/{concertId}` (GET)
- `http://localhost:3000/concerts` (POST - admin)
- `http://localhost:3000/payment/create-checkout` (POST)
- `http://localhost:3000/payment/webhook` (POST)
- `http://localhost:3000/payment/verify` (POST)
- `http://localhost:3000/stream/access` (POST)
- `http://localhost:3000/stream/embed-url` (GET)
- `http://localhost:3000/stream/validate` (GET)

## Tests avec cURL

### Inscription

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

Sauvegardez le token retourné pour les requêtes suivantes.

### Liste des concerts

```bash
curl http://localhost:3000/concerts
```

### Créer un concert (admin)

```bash
curl -X POST http://localhost:3000/concerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "title": "Concert Test",
    "description": "Description du concert",
    "artist": "Artiste Test",
    "scheduledDate": "2024-12-31T20:00:00Z",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "price": 1999,
    "status": "upcoming"
  }'
```

## Configuration Frontend pour Local

Dans le fichier `.env` du frontend :

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
```

## Dépannage

### Erreur : "Docker is not running"

Démarrez Docker Desktop avant de lancer `sam local`.

### Erreur : "Table not found"

Assurez-vous que les tables DynamoDB existent dans votre région AWS configurée, ou utilisez DynamoDB Local.

### Erreur : "JWT_SECRET not set"

Vérifiez que le fichier `env.json` contient bien toutes les variables nécessaires.

### Port déjà utilisé

Changez le port avec :

```bash
sam local start-api --port 3001 --env-vars env.json
```

Puis mettez à jour `VITE_API_URL` dans le frontend.

### Logs détaillés

Pour voir les logs détaillés :

```bash
sam local start-api --env-vars env.json --debug
```

## Workflow de Développement Recommandé

1. **Développement** :
   ```bash
   # Terminal 1
   npm run build -- --watch
   
   # Terminal 2
   sam build
   sam local start-api --env-vars env.json
   ```

2. **Tests** :
   - Utilisez Postman ou Insomnia pour tester les endpoints
   - Ou utilisez les commandes cURL ci-dessus

3. **Déploiement** :
   ```bash
   sam build
   sam deploy
   ```

## Variables d'Environnement Disponibles

- `JWT_SECRET` : Secret pour signer les tokens JWT
- `JWT_EXPIRES_IN` : Durée de validité JWT (défaut: 24h)
- `STREAM_TOKEN_EXPIRES_IN` : Durée de validité stream token (défaut: 2h)
- `STRIPE_SECRET_KEY` : Clé secrète Stripe
- `STRIPE_WEBHOOK_SECRET` : Secret webhook Stripe
- `FRONTEND_URL` : URL du frontend pour les redirections
- `CORS_ORIGIN` : Origine CORS autorisée
- `USERS_TABLE` : Nom de la table Users (défaut: Users)
- `CONCERTS_TABLE` : Nom de la table Concerts (défaut: Concerts)
- `PURCHASES_TABLE` : Nom de la table Purchases (défaut: Purchases)
- `STREAM_TOKENS_TABLE` : Nom de la table StreamTokens (défaut: StreamTokens)

## Notes Importantes

- Les fonctions Lambda locales utilisent Docker, donc elles peuvent être plus lentes que la production
- Pour tester les webhooks Stripe, utilisez [Stripe CLI](https://stripe.com/docs/stripe-cli) :
  ```bash
  stripe listen --forward-to localhost:3000/payment/webhook
  ```
- Les tables DynamoDB doivent exister dans AWS (ou utiliser DynamoDB Local)
- Les clés Stripe en mode test fonctionnent parfaitement en local

