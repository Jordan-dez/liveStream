# Plateforme de Livestream Payante - MVP

Plateforme permettant aux utilisateurs d'accéder à des concerts en direct via YouTube Live après paiement.

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture globale du système
- **[USER_FLOW.md](./USER_FLOW.md)** - Flux utilisateur détaillé
- **[SECURITY.md](./SECURITY.md)** - Considérations de sécurité pour le MVP

## Stack Technique

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: AWS Lambda (Node.js 18) + API Gateway
- **Base de données**: DynamoDB
- **Authentification**: JWT
- **Paiement**: Stripe Checkout

## Fonctionnalités Principales

1. **Authentification**: Inscription et connexion utilisateurs
2. **Catalogue de concerts**: Liste et détails des concerts disponibles
3. **Paiement sécurisé**: Intégration Stripe Checkout
4. **Stream sécurisé**: Accès temporaire aux concerts via YouTube Live (URL masquée)
5. **Gestion de session**: Tokens d'accès temporaires avec expiration automatique

## Prochaines Étapes

1. Configuration de l'infrastructure AWS (SAM/Serverless Framework)
2. Développement des Lambda Functions
3. Développement du frontend React
4. Configuration Stripe
5. Tests et déploiement

# liveStream
