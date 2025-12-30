# Installation Homebrew sur macOS

Homebrew est un gestionnaire de paquets pour macOS qui facilite l'installation de logiciels.

## Installation

Ouvrez le Terminal (Applications > Utilitaires > Terminal) et exécutez :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Cette commande va :
1. Télécharger le script d'installation
2. Vous demander votre mot de passe administrateur
3. Installer Homebrew dans `/opt/homebrew` (Apple Silicon) ou `/usr/local` (Intel)

## Vérification

Après l'installation, vérifiez que Homebrew fonctionne :

```bash
brew --version
```

## Configuration du PATH (si nécessaire)

Si vous avez un Mac avec puce Apple Silicon (M1, M2, M3, etc.), vous devrez peut-être ajouter Homebrew à votre PATH :

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Pour les Mac Intel :

```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

## Mise à jour

Mettez à jour Homebrew et les formules :

```bash
brew update
```

## Installation de logiciels avec Homebrew

Une fois Homebrew installé, vous pouvez installer :

### AWS SAM CLI

```bash
brew install aws-sam-cli
```

### Docker Desktop

```bash
brew install --cask docker
```

Puis démarrez Docker Desktop depuis Applications.

### AWS CLI

```bash
brew install awscli
```

### Node.js

```bash
brew install node
```

### Autres outils utiles

```bash
# Git (si pas déjà installé)
brew install git

# Python
brew install python

# wget
brew install wget
```

## Commandes utiles

```bash
# Rechercher un paquet
brew search nom-du-paquet

# Voir les informations d'un paquet
brew info nom-du-paquet

# Lister les paquets installés
brew list

# Mettre à jour tous les paquets
brew upgrade

# Désinstaller un paquet
brew uninstall nom-du-paquet

# Nettoyer les anciennes versions
brew cleanup
```

## Dépannage

### Erreur : "command not found: brew"

Vérifiez que Homebrew est dans votre PATH :

```bash
echo $PATH
```

Si `/opt/homebrew/bin` (Apple Silicon) ou `/usr/local/bin` (Intel) n'est pas dans le PATH, ajoutez-le (voir section "Configuration du PATH" ci-dessus).

### Erreur : "Permission denied"

Homebrew peut nécessiter des permissions administrateur. Utilisez `sudo` si nécessaire, mais généralement ce n'est pas recommandé.

### Erreur : "Xcode Command Line Tools not found"

Installez les outils de ligne de commande Xcode :

```bash
xcode-select --install
```

### Mise à jour de Homebrew

```bash
brew update
brew upgrade
```

## Désinstallation (si nécessaire)

Si vous souhaitez désinstaller Homebrew :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
```

## Prochaines étapes

Une fois Homebrew installé, vous pouvez installer les outils nécessaires pour le projet :

```bash
# AWS SAM CLI
brew install aws-sam-cli

# Docker Desktop
brew install --cask docker

# AWS CLI
brew install awscli

# Node.js (si pas déjà installé)
brew install node
```

Puis suivez les guides d'installation :
- [INSTALL_SAM.md](./backend/INSTALL_SAM.md) pour AWS SAM CLI
- [LOCAL_DEVELOPMENT.md](./backend/LOCAL_DEVELOPMENT.md) pour démarrer le backend

