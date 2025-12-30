# Installation AWS SAM CLI

Guide d'installation d'AWS SAM CLI pour différentes plateformes.

## macOS

### Option 1 : Homebrew (Recommandé)

```bash
brew install aws-sam-cli
```

### Option 2 : Installation manuelle

```bash
# Télécharger le fichier d'installation
curl -L https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-macos-arm64.zip -o aws-sam-cli.zip

# Décompresser
unzip aws-sam-cli.zip -d sam-installer

# Installer
sudo ./sam-installer/install
```

### Vérification

```bash
sam --version
```

## Linux

### Option 1 : pip (Python requis)

```bash
pip install aws-sam-cli
```

### Option 2 : Installation manuelle

```bash
# Télécharger le fichier d'installation
wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip

# Décompresser
unzip aws-sam-cli-linux-x86_64.zip -d sam-installer

# Installer
sudo ./sam-installer/install
```

### Vérification

```bash
sam --version
```

## Windows

### Option 1 : MSI Installer (Recommandé)

1. Téléchargez le fichier MSI depuis :
   https://github.com/aws/aws-sam-cli/releases/latest

2. Exécutez le fichier `.msi` et suivez les instructions

### Option 2 : pip (Python requis)

```bash
pip install aws-sam-cli
```

### Vérification

```bash
sam --version
```

## Prérequis

### Docker Desktop

SAM CLI utilise Docker pour exécuter les fonctions Lambda localement. Vous devez installer Docker Desktop :

- **macOS/Windows** : https://www.docker.com/products/docker-desktop
- **Linux** : Suivez les instructions pour votre distribution

Vérifiez que Docker fonctionne :

```bash
docker --version
docker ps
```

### AWS CLI (Optionnel, pour le déploiement)

Pour déployer sur AWS, vous devez installer et configurer AWS CLI :

```bash
# macOS
brew install awscli

# Linux
pip install awscli

# Windows
# Télécharger depuis https://aws.amazon.com/cli/
```

Configuration :

```bash
aws configure
```

Vous aurez besoin de :
- AWS Access Key ID
- AWS Secret Access Key
- Default region (ex: `eu-west-1`)
- Default output format (ex: `json`)

## Vérification de l'installation complète

```bash
# Vérifier SAM
sam --version

# Vérifier Docker
docker --version

# Vérifier AWS CLI (optionnel)
aws --version
```

## Dépannage

### Erreur : "sam: command not found"

**macOS/Linux** : Vérifiez que le chemin est dans votre PATH :
```bash
echo $PATH
# Le chemin devrait contenir /usr/local/bin ou similaire
```

**Windows** : Vérifiez que SAM est dans les variables d'environnement PATH.

### Erreur : "Docker is not running"

Démarrez Docker Desktop avant d'utiliser SAM.

### Erreur : "No module named 'samcli'"

Si vous avez installé via pip, essayez :
```bash
pip install --upgrade aws-sam-cli
```

### Mise à jour de SAM

**Homebrew (macOS)** :
```bash
brew upgrade aws-sam-cli
```

**pip** :
```bash
pip install --upgrade aws-sam-cli
```

## Prochaines étapes

Une fois SAM installé, vous pouvez :

1. **Tester l'installation** :
   ```bash
   sam --version
   ```

2. **Démarrer le backend en local** :
   ```bash
   cd backend
   npm run build
   sam build
   sam local start-api --env-vars env.json
   ```

3. **Consulter la documentation** :
   - Guide local : [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)
   - Documentation officielle : https://docs.aws.amazon.com/serverless-application-model/

## Alternatives

Si vous préférez ne pas utiliser SAM, vous pouvez utiliser **Serverless Framework** :

```bash
npm install -g serverless
```

Voir le guide : [SERVERLESS_LOCAL.md](./SERVERLESS_LOCAL.md)

