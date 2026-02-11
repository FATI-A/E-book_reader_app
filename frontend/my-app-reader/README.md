
# Guide de démarrage E-book Reader App

Ce guide explique comment lancer le backend (Java Spring Boot) et le frontend (React + Vite) de l'application E-book Reader.

---

## 1. Prérequis

- **Java 17** ou supérieur
- **Node.js** (v18 ou supérieur recommandé) & **npm**
- **Docker** (pour la base de données Postgres)

---

## 2. Lancer le Backend (Spring Boot)

### a) Démarrer la base de données Postgres

Dans le dossier `backend/`, exécutez :

```bash
cd backend
docker-compose up -d
```

- Postgres sera accessible sur le port **5435** (voir `docker-compose.yml`).
- pgAdmin sera accessible sur le port **8080** (login: admin@projet.com / admin).

### b) Restaurer la base de données avec un dump SQL (optionnel)

Si vous avez un fichier `dump.sql` à restaurer :

```bash
# Copier le dump dans le conteneur Postgres
docker cp ./dump.sql postgres_gutenberg:/
# Entrer dans le conteneur
docker exec -it postgres_gutenberg bash
# Restaurer la base
psql -U user_admin -d bibliotheque_db -f dump.sql
```

### c) Lancer l'API Java Spring Boot

Toujours dans le dossier `backend/` :

```bash
# Pour Windows :
mvnw.cmd clean package
mvnw.cmd spring-boot:run
# Pour Linux/Mac :
./mvnw clean package
./mvnw spring-boot:run
```

- L'API sera accessible sur le port **8081** (voir `application.properties`).

---

## 3. Lancer le Frontend (React + Vite)


Dans le dossier `frontend/my-app-reader/` :

```bash
npm install
npm run dev
```

- L'application sera accessible sur le port **5173** (par défaut, voir la console).

---

## 4. Commandes Résumées

### Backend
- Démarrer la base de données : `docker-compose up -d` (dans `backend/`)
- Restaurer la base : voir section 2.b
- Lancer l'API : `mvnw.cmd spring-boot:run` (Windows) ou `./mvnw spring-boot:run` (Linux/Mac)

### Frontend
- Installer les dépendances : `npm install` (dans `frontend/my-app-reader/`)
- Lancer le front : `npm run dev`

---

## 5. Arrêter les services

- Arrêter la base de données : `docker-compose down` (dans `backend/`)
- Arrêter le backend : `Ctrl+C` dans le terminal Spring Boot
- Arrêter le frontend : `Ctrl+C` dans le terminal Vite

---

## 6. Accès

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8081
- **pgAdmin** : http://localhost:8080 (admin@projet.com / admin)

---

## 7. Notes

- Vérifiez que les ports ne sont pas déjà utilisés.
- Les identifiants de la base sont configurés dans `backend/src/main/resources/application.properties`.
- Pour toute erreur, consultez les logs des terminaux ou de Docker.
