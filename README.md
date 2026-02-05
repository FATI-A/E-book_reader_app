# E-book_reader_app#  Moteur de Recherche de Bibliothèque Textuelle  
## Description du projet

Ce projet consiste à concevoir et développer une **application web/mobile de moteur de recherche de documents textuels** pour une bibliothèque numérique de livres.  
L’objectif principal est de permettre la **recherche, le classement et la suggestion de livres** à partir de mots-clés ou d’expressions régulières (RegEx), tout en prenant en compte des **critères de pertinence avancés** issus de la théorie des graphes.

L’application est développée en **JavaScript** avec **React** pour la couche client, et une couche serveur dédiée à l’indexation et à la recherche.

---

## Données (Couche Data)

- **Nombre minimum de livres** : 1664
-  **Taille minimale par livre** : 10 000 mots
- **Format** : documents textuels (`.txt`)
- Chaque livre est stocké et indexé dans une bibliothèque personnelle
- Construction d’une **table d’indexation** pour accélérer la recherche

---

## Fonctionnalités principales

### Recherche simple (mot-clé)
- L’utilisateur saisit un mot-clé `S`
- L’application retourne la liste des livres :
  - dont la table d’index contient la chaîne `S`
- Les résultats sont **classés par pertinence**

---

### Recherche avancée (RegEx)
- L’utilisateur saisit une expression régulière `RegEx`
- Deux modes possibles :
  1. Recherche dans la **table d’index**
  2. Recherche dans le **contenu textuel complet** (avec impact sur les performances)
- Retourne la liste des documents correspondant à l’expression régulière

---

### Classement des résultats (fonctionnalité implicite)

Les résultats de recherche sont triés selon un ou plusieurs critères de pertinence :

-  Nombre d’occurrences du mot-clé dans le document
- Analyse du **graphe de similarité de Jaccard**
-  Utilisation obligatoire d’au moins **un indice de centralité** :
  - Closeness
  - Betweenness
  - PageRank

L’indice de centralité utilisé est :
- défini formellement
- expliqué (calcul et interprétation)
- illustré sur des extraits de livres dans le rapport

## Architecture technique

### Frontend
- **React**
- JavaScript
- Interface responsive (desktop & mobile)
- Gestion des formulaires de recherche
- Affichage dynamique des résultats et suggestions

### Backend
- Java
- Indexation des documents textuels
- Implémentation des algorithmes de recherche
- Calcul des indices de centralité
- API REST pour la communication client–serveur

