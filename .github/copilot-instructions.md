# Copilot Instructions for megastockmr

## Vue d'ensemble du projet
Ce dépôt contient une application statique pour la gestion de stock de véhicules et de factures, principalement basée sur HTML/CSS/JS. L'interface est en français et orientée vers la gestion de véhicules (stock, ventes, factures).

## Structure principale
- `DOCTYPE.html.txt` : Fichier principal HTML, structure l'interface utilisateur (onglets Stock et Factures, modale d'ajout/édition, tableaux dynamiques).
- `style.css` et `script.js` (présumés, à ajouter si absents) : Pour le style et la logique dynamique (chargement/édition des véhicules et factures).
- `.github/workflows/static.yml` : Déploiement automatique sur GitHub Pages à chaque push sur `main`.
- `README.md` : Présentation minimale du projet.

## Points clés pour les agents IA
- **Aucune logique backend** : Tout est statique, aucune API ou base de données n'est utilisée.
- **Ajout/édition dynamique** : Les boutons "Ajouter" ouvrent une modale pour saisir les données. Les tableaux sont mis à jour dynamiquement via JS.
- **Déploiement** : Le workflow GitHub Actions (`static.yml`) déploie tout le contenu du repo sur GitHub Pages. Aucun build n'est requis.
- **Conventions** :
  - Les noms de variables, fonctions et textes sont en français.
  - Les boutons d'action utilisent des emojis pour la clarté UX.
  - Les sections principales sont `stock` (véhicules) et `invoices` (factures).
- **Dépendances externes** :
  - FontAwesome (CDN) pour les icônes.
  - Aucun framework JS ou CSS, tout est "vanilla".

## Exemples de patterns à suivre
- Pour ajouter un véhicule, utiliser la structure du formulaire dans la modale (`#modal-form`).
- Pour manipuler les données, cibler les éléments par ID (`vehicles-table`, `invoices-table`, etc.).
- Pour ajouter de nouveaux onglets ou sections, suivre le modèle de navigation par boutons et sections masquées/affichées.

## Bonnes pratiques spécifiques
- Respecter la langue française pour l'UI et le code.
- Garder le code JS simple et lisible, sans dépendances additionnelles.
- Toute nouvelle fonctionnalité doit être accessible via l'interface existante (onglets, modale, tableaux).

## Fichiers clés à consulter
- `DOCTYPE.html.txt` : Pour toute modification structurelle ou ajout de fonctionnalité.
- `.github/workflows/static.yml` : Pour comprendre le déploiement.

## À compléter
- Ajouter `style.css` et `script.js` si absents, en suivant la structure HTML existante.
- Documenter toute convention supplémentaire dans ce fichier.

---

Pour toute question sur les conventions ou l'architecture, se référer à ce fichier et à la structure HTML principale.