# Guide Serverless Framework - Développement Local

Ce guide explique comment utiliser Serverless Framework pour développer et tester le backend en local.

## Prérequis

1. **Node.js 18+** installé
2. **Serverless Framework** installé globalement (optionnel) :
   ```bash
   npm install -g serverless
   ```
3. **Docker Desktop** installé et démarré (pour DynamoDB Local)

## Installation

```bash
cd backend
npm install
```

Cela installera automatiquement :
- `serverless` : Framework Serverless
- `serverless-offline` : Plugin pour exécuter les fonctions Lambda localement
- `serverless-dynamodb-local` : Plugin pour DynamoDB Local

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du dossier `backend` :

```env
JWT_SECRET=votre-secret-jwt-super-securise-changez-moi
JWT_EXPIRES_IN=24h
STREAM_TOKEN_EXPIRES_IN=2h
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe_test
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=*
```

**Alternative** : Utilisez `serverless.yml` avec des variables d'environnement système.

### 2. Configuration AWS (pour le déploiement)

Configurez vos credentials AWS :

```bash
aws configure
```

Ou utilisez des variables d'environnement :

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=eu-west-1
```

## Démarrage en Local

### Option 1 : Avec DynamoDB Local (Recommandé pour développement)

1. **Compiler le TypeScript** :
   ```bash
   npm run build
   ```

2. **Démarrer DynamoDB Local** (première fois) :
   ```bash
   serverless dynamodb install
   ```

3. **Démarrer le serveur avec DynamoDB Local** :
   ```bash
   npm run sls:offline:dynamodb
   ```

   Cela va :
   - Démarrer DynamoDB Local
   - Créer automatiquement les tables
   - Démarrer l'API sur `http://localhost:3000`

### Option 2 : Sans DynamoDB Local (utilise AWS DynamoDB)

1. **Compiler le TypeScript** :
   ```bash
   npm run build
   ```

2. **Démarrer le serveur** :
   ```bash
   npm run sls:offline
   ```

   L'API sera disponible sur `http://localhost:3000`

## Structure des Endpoints Locaux

Une fois démarré, les endpoints seront disponibles sur :

- `http://localhost:3000/dev/auth/login` (POST)
- `http://localhost:3000/dev/auth/register` (POST)
- `http://localhost:3000/dev/auth/refresh` (POST)
- `http://localhost:3000/dev/auth/verify` (GET)
- `http://localhost:3000/dev/concerts` (GET)
- `http://localhost:3000/dev/concerts/{concertId}` (GET)
- `http://localhost:3000/dev/concerts` (POST - admin)
- `http://localhost:3000/dev/payment/create-checkout` (POST)
- `http://localhost:3000/dev/payment/webhook` (POST)
- `http://localhost:3000/dev/payment/verify` (POST)
- `http://localhost:3000/dev/stream/access` (POST)
- `http://localhost:3000/dev/stream/embed-url` (GET)
- `http://localhost:3000/dev/stream/validate` (GET)

**Note** : Le préfixe `/dev` correspond au stage. Vous pouvez le changer dans `serverless.yml`.

## Tests avec cURL

### Inscription

```bash
curl -X POST http://localhost:3000/dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:3000/dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### Liste des concerts

```bash
curl http://localhost:3000/dev/concerts
```

## Configuration Frontend pour Local

Dans le fichier `.env` du frontend :

```env
VITE_API_URL=http://localhost:3000/dev
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
```

## Workflow de Développement

### Développement avec rechargement automatique

**Terminal 1** - Watch TypeScript :
```bash
npm run build:watch
```

**Terminal 2** - Serverless Offline :
```bash
npm run sls:offline:dynamodb
```

### Développement simple

```bash
# Build une fois
npm run build

# Démarrer
npm run sls:offline:dynamodb
```

## Commandes Serverless

### Développement Local

```bash
# Démarrer sans DynamoDB Local
npm run sls:offline

# Démarrer avec DynamoDB Local (crée les tables automatiquement)
npm run sls:offline:dynamodb
```

### Déploiement

```bash
# Déployer en production
npm run sls:deploy

# Déployer en staging/dev
npm run sls:deploy:dev
```

### Autres commandes

```bash
# Voir les logs en temps réel
serverless logs -f authLogin -t

# Supprimer le déploiement
npm run sls:remove

# Lister les fonctions
serverless info
```

## DynamoDB Local

### Accès à DynamoDB Local

Par défaut, DynamoDB Local est accessible sur `http://localhost:8000`.

### Utiliser AWS CLI avec DynamoDB Local

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

### Créer des données de test

```bash
aws dynamodb put-item \
  --endpoint-url http://localhost:8000 \
  --table-name livestream-backend-users-dev \
  --item '{
    "userId": {"S": "test-user-id"},
    "email": {"S": "test@example.com"},
    "passwordHash": {"S": "$2a$10$..."},
    "createdAt": {"S": "2024-01-01T00:00:00Z"},
    "role": {"S": "user"}
  }'
```

## Dépannage

### Erreur : "Docker is not running"

Démarrez Docker Desktop avant de lancer `serverless offline`.

### Erreur : "Table not found"

Si vous utilisez DynamoDB Local, assurez-vous d'utiliser `npm run sls:offline:dynamodb` qui crée automatiquement les tables.

### Erreur : "JWT_SECRET not set"

Vérifiez que le fichier `.env` existe et contient toutes les variables nécessaires, ou exportez-les dans votre shell.

### Port déjà utilisé

Changez le port dans `serverless.yml` :

```yaml
custom:
  serverless-offline:
    httpPort: 3001
```

### Logs détaillés

Pour voir les logs détaillés :

```bash
SLS_DEBUG=* npm run sls:offline
```

## Avantages de Serverless Framework vs SAM

- ✅ Plus simple à configurer
- ✅ Meilleure intégration avec DynamoDB Local
- ✅ Plugins disponibles (offline, dynamodb-local, etc.)
- ✅ Gestion des stages (dev, staging, prod)
- ✅ Déploiement plus rapide
- ✅ Meilleure gestion des variables d'environnement

## Comparaison avec SAM

| Fonctionnalité | Serverless Framework | AWS SAM |
|---------------|---------------------|---------|
| Configuration | `serverless.yml` | `template.yaml` |
| Local | `serverless offline` | `sam local start-api` |
| DynamoDB Local | Plugin intégré | Manuel |
| Déploiement | `serverless deploy` | `sam deploy` |
| Plugins | Nombreux | Limités |

## Prochaines Étapes

1. Développez vos fonctions localement
2. Testez avec DynamoDB Local
3. Déployez avec `serverless deploy`
4. Configurez les webhooks Stripe en production

