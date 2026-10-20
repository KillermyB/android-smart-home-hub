# Vérification du 20 octobre 2026

## Contrôles locaux réussis

- `npm run check` : syntaxe JavaScript et serveur.
- `npm test` : 2 tests du serveur, incluant protection des fichiers privés, origine des écritures, Host, retours OAuth invalides, polices et refus d’une écoute LAN sans code d’association.
- Navigateur intégré : accueil 1280 × 800 sans défilement vertical ni débordement horizontal ; les trois tâches restent à l’intérieur de leur carte.
- Petit format 320 × 740 : navigation et météo sans débordement horizontal ; fenêtre de réglages sans débordement interne.
- Agenda : jour, semaine et grille de 42 jours ; filtre Travail retirant puis rétablissant l’événement attendu.
- Tâches : ajout, validation et suppression de la seule tâche de contrôle créée pour l’essai.
- Cuisine : passage de 2 à 3 portions, recalcul de 180 à 270 g de riz ; passage d’étape ; minuteur conservé lors du retour à Maison puis arrêté manuellement.
- Recherche : « citron » retourne la seule recette correspondante.
- Carnet : saisie d’une recette personnelle, sauvegarde, rechargement et présence confirmée dans le carnet de ce navigateur.
- Thèmes : contrôles clair/sombre utilisables ; fondus et interactions courtes implémentés ; le mode sans mouvement suit la préférence système.

## Ce que cela ne valide pas

- Fluidité, CPU, mémoire, touches physiques et démarrage sur l’A33.
- Autorisation et lecture réelles des comptes Microsoft et Google, clé Todoist, règles de l’organisation professionnelle.
- Alarme sonore système, veille Android, certificats du cadre ou reprise après coupure électrique.
- Parcours d’authentification et usage permanent du kiosk.

La liste des étapes suivantes reste dans `RESTANT.md`. Les captures de QA locales se trouvent dans `artifacts/`, exclu du dépôt.


## v0.2.0 — 20 octobre 2026

- 4 tests passent : sécurité serveur, refus écoute LAN sans secret, traitement GitHub des dates UTC/résultats partiels, pagination/limites API. Syntaxe app, catalogue, client GitHub et serveur contrôlée.
- UI 1280 × 800 : dashboard graphite, nouvelle tuile GitHub et bibliothèque. Mobile 320 px : accueil et recherche/catégories sans débordement horizontal.
- Favori ajouté puis retrouvé après rechargement, retiré en fin de test. Recherche « tahini » et catégorie Dessert vérifiées.
- Curry passé de 2 à 3 portions ; pois chiches cochés avant ajout ; six autres ingrédients ajoutés aux courses. Double appui n’ajoute pas de doublons. Liste conservée après rechargement ; articles de test cochés et retirés ensuite.
- API GitHub réelle : compte killermyb trouvé, 0 commit public sur 28 jours. Tests synthétiques couvrent les résultats non vides et paginés. Aucun accès aux dépôts privés.
- La validation physique sur le cadre et les connexions Outlook/Google/Todoist restent à faire.


## v0.2.1 — Identité organique

- Logo et lettrage vectoriels contrôlés en mode sombre à 1280 × 800 et clair dans la bibliothèque.
- En-tête à 320 px : largeur du document 320 px, pas de débordement.
- Navigation au clavier : focus visible, contour iris de 3 px. Nom accessible du bouton : « Smart Hub — Accueil ».
- Aucun ajout de dépendance ni animation permanente. Favicon SVG et signature téléchargeable assortis.
