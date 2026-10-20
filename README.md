# Smart Hub

Un tableau de bord tactile pour le cadre AiMOR PF1007/PF1007L : heure, météo, calendriers, tâches, recettes et veille avec citations.

**État : v0.1.0, aperçu fonctionnel en navigateur. L’installation et les performances sur le cadre physique restent à valider.** Les données d’exemple sont signalées dans l’interface. Aucun compte externe n’est connecté par défaut.

## Lancer sur la tour Windows

1. Installer [Node.js](https://nodejs.org/) **22.9 ou plus récent**, et Git si nécessaire.
2. Récupérer le futur dépôt GitHub puis ouvrir un terminal dans ce dossier, celui qui contient `package.json`.
3. Exécuter :

```powershell
Copy-Item .env.example .env
npm start
```

Ouvrir [http://localhost:4173](http://localhost:4173). Aucun `npm install` n’est nécessaire : le serveur utilise les modules intégrés de Node. Sur macOS/Linux, copier avec `cp .env.example .env`.

## Ce qui fonctionne

- Maison : horloge Europe/Zurich, aperçu du jour, météo, tâches et accès aux recettes.
- Agenda : jour, semaine, mois, navigation et filtres des trois sources.
- À faire : ajout, validation et suppression des tâches locales ; lecture, ajout et validation Todoist après configuration.
- Cuisine : trois recettes originales, recherche, filtres, portions, ingrédients cochables, étapes et minuteur persistant.
- Carnet : saisie d’une recette copiée depuis un site/livre ; import JSON-LD `schema.org/Recipe` ou fichier JSON.
- Veille automatique réglable, grande heure, citations sourcées par catégorie ; un toucher ou Échap pour revenir.
- Thèmes clair/sombre avec fondu natif si disponible, transition de couleurs sur WebView 106 ; mouvements désactivés si `prefers-reduced-motion` est actif.
- Polices locales avec licences OFL ; aucun CDN nécessaire pour l’interface.

Les tâches locales, recettes, thème, météo choisie et minuteur sont enregistrés **dans le navigateur utilisé**. GitHub ne transfère pas ces données. Le serveur conserve séparément les autorisations des calendriers dans `.data`, chiffrées avec une clé locale. Ne publier ni `.env`, ni `.data`, ni les sauvegardes du cadre. La clé de chiffrement et les jetons se trouvent sur la même machine : cela protège le fichier isolé, pas une machine compromise.

## Connecter les services

Voir [docs/CONNEXIONS.md](docs/CONNEXIONS.md). Outlook personnel et travail utilisent deux autorisations séparées ; le compte Gmail est raccordé via **Google Agenda**, sans lecture des e-mails. Les calendriers sont en lecture seule.

La configuration est écrite et contrôlée localement ; les flux OAuth et appels aux services devront encore être validés avec les vrais comptes. Une clé présente dans `.env` n’est pas une preuve de connexion réussie.

## Préparer le cadre

Voir [docs/CADRE-WINDOWS.md](docs/CADRE-WINDOWS.md). Ne flasher aucun firmware pour afficher cet aperçu. La première étape sur la tour est de vérifier USB/ADB, puis de lire l’identité réelle du matériel et de sauvegarder avant toute installation.

Le cadre a été joignable en Wi-Fi pendant la session du 20 octobre 2026, mais **aucun accès ADB n’a été obtenu**. Son adresse IP et son adresse MAC changent au redémarrage : les retrouver avant chaque intervention. Le test de `IS OPEN` n’a pas suffi à produire une connexion USB sur le Mac utilisé.

## Vérifications

```powershell
npm run check
npm test
```

Les tests du serveur contrôlent notamment l’absence de publication des secrets, le refus des écritures provenant d’un autre site, les états OAuth invalides et la protection obligatoire d’une écoute LAN. La vérification visuelle est distincte des tests de syntaxe et du serveur.

## Suite

La liste de reprise est dans [docs/RESTANT.md](docs/RESTANT.md). Le dépôt GitHub sera créé après revue de cette première interface, conformément à la demande.
