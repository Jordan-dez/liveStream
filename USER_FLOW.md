# Flux Utilisateur - Plateforme de Livestream

## 1. Découverte et Inscription

### 1.1 Visiteur Non Authentifié
```
1. Utilisateur arrive sur la page d'accueil
2. Parcourt la liste des concerts disponibles
3. Clique sur un concert pour voir les détails
4. Voit le prix et la date/heure du concert
5. Doit s'inscrire ou se connecter pour acheter
```

### 1.2 Inscription
```
1. Utilisateur clique sur "S'inscrire"
2. Remplit le formulaire (email, mot de passe)
3. Frontend → POST /auth/register
4. Backend crée un compte dans DynamoDB (Users)
5. Retourne un JWT token
6. Frontend stocke le token (localStorage ou cookie httpOnly)
7. Redirection vers la page du concert
```

### 1.3 Connexion
```
1. Utilisateur clique sur "Se connecter"
2. Saisit email et mot de passe
3. Frontend → POST /auth/login
4. Backend vérifie les credentials
5. Retourne un JWT token
6. Frontend stocke le token
7. Redirection vers la page d'accueil ou le concert
```

## 2. Achat d'Accès à un Concert

### 2.1 Sélection d'un Concert
```
1. Utilisateur authentifié consulte un concert
2. Voit les détails: titre, artiste, date, prix, description
3. Clique sur "Acheter l'accès"
```

### 2.2 Création de la Session de Paiement
```
1. Frontend → POST /payment/create-checkout
   Headers: Authorization: Bearer <JWT>
   Body: { concertId, userId }
   
2. Backend Lambda:
   a. Vérifie le JWT token
   b. Vérifie que le concert existe et est disponible
   c. Vérifie que l'utilisateur n'a pas déjà acheté ce concert
   d. Crée une session Stripe Checkout
   e. Retourne { checkoutSessionId, url }
   
3. Frontend redirige vers l'URL Stripe Checkout
```

### 2.3 Paiement Stripe
```
1. Utilisateur complète le paiement sur Stripe Checkout
2. Stripe redirige vers success_url avec session_id
3. Frontend reçoit le session_id
```

### 2.4 Confirmation du Paiement
```
1. Frontend → POST /payment/verify
   Body: { sessionId }
   
2. Backend Lambda:
   a. Vérifie le JWT token
   b. Vérifie la session Stripe
   c. Si paiement réussi:
      - Crée un enregistrement dans Purchases (DynamoDB)
      - Retourne { success: true, concertId }
   d. Si échec: retourne erreur
   
3. Frontend affiche confirmation et bouton "Accéder au concert"
```

### 2.5 Webhook Stripe (Backend)
```
1. Stripe envoie un webhook → POST /payment/webhook
   (événement: checkout.session.completed)
   
2. Backend Lambda:
   a. Vérifie la signature du webhook (STRIPE_WEBHOOK_SECRET)
   b. Extrait userId et concertId de la session
   c. Met à jour le statut dans Purchases
   d. Log l'événement
```

## 3. Accès au Stream

### 3.1 Demande d'Accès
```
1. Utilisateur clique sur "Accéder au concert"
2. Frontend → POST /stream/access
   Headers: Authorization: Bearer <JWT>
   Body: { concertId }
   
3. Backend Lambda:
   a. Vérifie le JWT token
   b. Vérifie dans Purchases que l'utilisateur a acheté ce concert
   c. Vérifie que le concert n'a pas expiré
   d. Génère un token d'accès temporaire (StreamToken)
   e. Stocke le token dans DynamoDB avec TTL
   f. Retourne { streamToken, expiresAt }
```

### 3.2 Génération de l'URL d'Embed
```
1. Frontend → GET /stream/embed-url?token=<streamToken>
   (sans JWT, le streamToken suffit)
   
2. Backend Lambda:
   a. Valide le streamToken (vérifie expiration et existence)
   b. Récupère le youtubeVideoId depuis Concerts
   c. Construit l'URL d'embed YouTube sécurisée
   d. Retourne { embedUrl, expiresAt }
   
3. Frontend charge l'iframe YouTube avec l'embedUrl
   (L'URL YouTube brute n'est jamais exposée)
```

### 3.3 Lecture du Stream
```
1. Frontend affiche le lecteur vidéo (iframe YouTube)
2. L'utilisateur regarde le concert en direct
3. Le token d'accès expire après X heures (configurable)
4. Si expiration pendant la lecture:
   - Frontend détecte l'expiration
   - Redemande un nouveau token si le concert est toujours actif
   - Sinon, affiche un message d'expiration
```

## 4. Gestion de Session

### 4.1 Rafraîchissement du Token JWT
```
1. Frontend détecte que le JWT expire bientôt
2. Frontend → POST /auth/refresh
   Headers: Authorization: Bearer <JWT>
   
3. Backend vérifie le token et retourne un nouveau JWT
4. Frontend met à jour le token stocké
```

### 4.2 Expiration de l'Accès Stream
```
1. StreamToken expire (TTL DynamoDB)
2. Si utilisateur essaie d'accéder après expiration:
   - Backend retourne erreur 403
   - Frontend affiche message "Accès expiré"
   - Utilisateur peut racheter si le concert est toujours disponible
```

## 5. Cas d'Erreur

### 5.1 Paiement Échoué
```
1. Stripe retourne une erreur
2. Frontend affiche message d'erreur
3. Utilisateur peut réessayer le paiement
```

### 5.2 Concert Déjà Acheté
```
1. Backend détecte un achat existant dans Purchases
2. Retourne erreur ou redirige directement vers le stream
```

### 5.3 Concert Non Disponible
```
1. Concert annulé ou terminé
2. Backend retourne erreur 404 ou 403
3. Frontend affiche message approprié
```

### 5.4 Token Expiré
```
1. JWT expiré → Redirection vers login
2. StreamToken expiré → Message d'expiration, possibilité de racheter
```

## 6. Expérience Utilisateur Optimale

### Points Clés:
- **Pas de lien YouTube visible**: L'utilisateur ne voit jamais l'URL YouTube brute
- **Accès temporaire**: Les tokens expirent automatiquement
- **Sécurité**: Vérification à chaque étape (JWT + StreamToken)
- **UX fluide**: Redirections automatiques après paiement
- **Gestion d'erreurs**: Messages clairs pour chaque cas d'échec

