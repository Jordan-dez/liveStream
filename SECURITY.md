# Considérations de Sécurité - MVP

## 1. Authentification et Autorisation

### 1.1 JWT (JSON Web Tokens)
- **Secret fort**: Utiliser un secret JWT d'au moins 32 caractères aléatoires
- **Expiration courte**: Tokens JWT expirent après 24h (configurable)
- **Refresh tokens**: Implémenter un mécanisme de rafraîchissement
- **Validation stricte**: Vérifier la signature et l'expiration à chaque requête
- **Stockage sécurisé**: 
  - Option 1: localStorage (moins sécurisé, accessible au JS)
  - Option 2: httpOnly cookies (recommandé, protection XSS)
  - Option 3: Memory storage (plus sécurisé mais perdu au refresh)

### 1.2 Mots de Passe
- **Hachage**: Utiliser bcrypt avec salt rounds ≥ 10
- **Validation**: Exiger mot de passe fort (min 8 caractères, majuscules, chiffres)
- **Jamais en clair**: Les mots de passe ne doivent jamais être loggés ou stockés en clair

### 1.3 Autorisation par Rôle
- **Rôles**: user, admin (pour la création de concerts)
- **Vérification**: Middleware Lambda pour vérifier les rôles avant les actions sensibles

## 2. Protection des URLs YouTube

### 2.1 Masquage des URLs
- **Principe**: L'URL YouTube brute n'est jamais envoyée au frontend
- **Token d'accès**: Utiliser des tokens temporaires uniques par session
- **Expiration**: Tokens expirent après la fin du concert + marge de sécurité (ex: 2h)
- **TTL DynamoDB**: Utiliser le TTL automatique pour supprimer les tokens expirés

### 2.2 Validation Stricte
- **Vérification double**: 
  1. Vérifier que le StreamToken existe et n'est pas expiré
  2. Vérifier que l'utilisateur a bien acheté le concert (dans Purchases)
- **Rate limiting**: Limiter les tentatives de génération de tokens

### 2.3 Paramètres YouTube Embed
- **Paramètres sécurisés**: Utiliser les paramètres YouTube pour limiter les actions
  - `modestbranding=1`: Réduire le branding YouTube
  - `rel=0`: Ne pas afficher de vidéos similaires
  - `controls=1`: Contrôles de lecture uniquement
- **Domain restriction**: Si possible, restreindre l'embed à votre domaine (via YouTube API)

## 3. Sécurité des Paiements

### 3.1 Stripe
- **Clés API**: 
  - Stocker les clés secrètes dans AWS Secrets Manager ou Variables d'environnement Lambda
  - Ne jamais exposer les clés secrètes au frontend
- **Webhooks**:
  - Vérifier la signature du webhook avec `STRIPE_WEBHOOK_SECRET`
  - Utiliser l'endpoint idempotent pour éviter les doubles traitements
- **Mode test**: Utiliser les clés de test en développement

### 3.2 Validation des Paiements
- **Double vérification**: 
  1. Vérifier côté frontend (session Stripe)
  2. Vérifier côté backend (webhook Stripe)
- **Statut de paiement**: Ne jamais faire confiance uniquement au frontend
- **Idempotence**: Utiliser `stripeSessionId` comme clé unique pour éviter les doublons

## 4. Sécurité API Gateway et Lambda

### 4.1 API Gateway
- **HTTPS uniquement**: Forcer HTTPS pour toutes les requêtes
- **CORS**: Configurer CORS strictement (domaine frontend uniquement)
- **Rate Limiting**: 
  - Limiter le nombre de requêtes par IP
  - Limiter le nombre de requêtes par utilisateur authentifié
- **API Keys**: Optionnel pour MVP, mais recommandé pour production

### 4.2 Lambda Functions
- **IAM Roles**: Utiliser des rôles IAM avec principe du moindre privilège
- **Variables d'environnement**: 
  - Ne jamais commiter les secrets dans le code
  - Utiliser AWS Secrets Manager ou Parameter Store
- **Timeouts**: Configurer des timeouts appropriés (ex: 30s)
- **Memory**: Allouer suffisamment de mémoire pour éviter les timeouts

### 4.3 Validation des Entrées
- **Input validation**: Valider tous les inputs (userId, concertId, etc.)
- **Sanitization**: Nettoyer les inputs pour éviter l'injection
- **Type checking**: Utiliser TypeScript pour la validation de types

## 5. Sécurité DynamoDB

### 5.1 Accès
- **IAM Policies**: Limiter l'accès DynamoDB aux Lambda Functions uniquement
- **Encryption**: Activer le chiffrement au repos (KMS)
- **Backup**: Configurer des backups réguliers (optionnel pour MVP)

### 5.2 Données Sensibles
- **Pas de données sensibles**: Ne pas stocker d'informations de paiement (Stripe gère cela)
- **PII**: Minimiser les données personnelles stockées
- **TTL**: Utiliser TTL pour supprimer automatiquement les données temporaires

## 6. Sécurité Frontend

### 6.1 Protection XSS
- **Sanitization**: Nettoyer tous les contenus utilisateur avant affichage
- **CSP**: Content Security Policy pour limiter les ressources chargées
- **httpOnly cookies**: Si possible, utiliser des cookies httpOnly pour les tokens

### 6.2 Protection CSRF
- **Tokens CSRF**: Implémenter des tokens CSRF pour les actions sensibles
- **SameSite cookies**: Utiliser SameSite=Strict pour les cookies

### 6.3 Variables d'Environnement
- **Public keys uniquement**: Seules les clés publiques (Stripe public key) dans le frontend
- **API URLs**: Utiliser des variables d'environnement pour les URLs d'API

## 7. Monitoring et Logging

### 7.1 Logging
- **Pas de secrets**: Ne jamais logger les tokens, mots de passe, ou clés API
- **Structured logging**: Utiliser des logs structurés (JSON)
- **Niveaux de log**: Utiliser les niveaux appropriés (error, warn, info)

### 7.2 Monitoring
- **CloudWatch Alarms**: Configurer des alertes pour les erreurs Lambda
- **Rate limiting alerts**: Alerter en cas de tentatives suspectes
- **Failed payments**: Monitorer les échecs de paiement

## 8. Sécurité des Sessions

### 8.1 Expiration
- **JWT expiration**: 24h pour les tokens d'authentification
- **StreamToken expiration**: Durée du concert + 2h de marge
- **Automatic cleanup**: TTL DynamoDB pour nettoyer automatiquement

### 8.2 Invalidation
- **Logout**: Invalider les tokens côté serveur (optionnel pour MVP)
- **Token blacklist**: Pour MVP, l'expiration naturelle suffit

## 9. Checklist de Sécurité MVP

### Obligatoire:
- [ ] JWT avec secret fort et expiration
- [ ] Mots de passe hashés avec bcrypt
- [ ] HTTPS forcé sur API Gateway
- [ ] Validation des webhooks Stripe
- [ ] Tokens d'accès temporaires pour les streams
- [ ] TTL DynamoDB pour les tokens expirés
- [ ] Validation des inputs côté backend
- [ ] CORS configuré strictement
- [ ] Secrets stockés dans AWS Secrets Manager ou Variables d'environnement

### Recommandé pour Production:
- [ ] Rate limiting sur API Gateway
- [ ] WAF (Web Application Firewall) sur API Gateway
- [ ] Monitoring et alertes CloudWatch
- [ ] Backup DynamoDB
- [ ] Chiffrement au repos DynamoDB (KMS)
- [ ] Logs d'audit pour les actions sensibles
- [ ] Tests de sécurité automatisés

## 10. Points d'Attention Spécifiques

### 10.1 Protection contre le Partage d'Accès
- **Limitation**: Un StreamToken est lié à un userId spécifique
- **Détection**: Logger les accès pour détecter les patterns suspects
- **Note**: Pour MVP, la limitation par token suffit. Pour production, considérer:
  - Limitation par IP
  - Limitation par device
  - Détection de partage d'écran (avancé)

### 10.2 Protection contre le Scraping
- **Rate limiting**: Limiter les requêtes par IP
- **User-Agent**: Vérifier les User-Agents suspects
- **Captcha**: Optionnel pour MVP, recommandé pour production

### 10.3 Gestion des Erreurs
- **Messages génériques**: Ne pas exposer les détails d'erreur aux utilisateurs
- **Logs détaillés**: Logger les erreurs détaillées côté serveur uniquement

