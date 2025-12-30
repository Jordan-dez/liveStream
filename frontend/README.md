# Frontend React - Plateforme de Livestream

Frontend React avec TypeScript et Tailwind CSS pour la plateforme de livestream payante.

## Structure du Projet

```
frontend/
├── src/
│   ├── components/      # Composants UI réutilisables
│   ├── contexts/        # Contextes React (Auth)
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   ├── types/          # Types TypeScript
│   └── config/         # Configuration
├── public/
└── package.json
```

## Prérequis

- Node.js 18+
- npm ou yarn

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Configurez les variables :
- `VITE_API_URL` : URL de l'API backend (ex: `https://your-api.execute-api.region.amazonaws.com/prod`)
- `VITE_STRIPE_PUBLIC_KEY` : Clé publique Stripe (commence par `pk_`)

## Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Build

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## Déploiement

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Déployer le dossier dist/
```

### S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

## Pages

- `/` - Page d'accueil avec les concerts à venir
- `/login` - Connexion
- `/register` - Inscription
- `/concerts` - Liste de tous les concerts
- `/concerts/:concertId` - Détails d'un concert et achat
- `/payment/success` - Page de succès après paiement
- `/stream/:concertId` - Lecteur vidéo du concert

## Fonctionnalités

- ✅ Authentification JWT
- ✅ Liste et détails des concerts
- ✅ Intégration Stripe Checkout
- ✅ Lecteur vidéo YouTube (iframe masquée)
- ✅ Gestion des tokens d'accès temporaires
- ✅ Interface responsive avec Tailwind CSS
- ✅ Gestion d'état avec Context API

## Notes

- Les URLs YouTube ne sont jamais exposées directement
- Les tokens d'accès expirent automatiquement
- Le token JWT est stocké dans localStorage
- Les erreurs d'authentification redirigent vers la page de connexion

