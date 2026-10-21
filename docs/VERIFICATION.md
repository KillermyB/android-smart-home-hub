# Vérification

## v0.15.2 — Titres Todoist longs

- La vérification de la vraie liste du cadre a révélé un titre Markdown avec URL longue qui recouvrait une autre ligne. Les aperçus gardent le texte du lien et deux lignes maximum ; une action séparée ouvre le texte complet sans cocher la tâche.
- 82 tests réussis, dont texte Markdown, échappement HTML et refus de lien JavaScript. Sur l’origine de contrôle : texte limité à 42 px dans une ligne de 48 px ; détail lisible avec lien HTTP(S), fermeture et retrait de la seule tâche locale ajoutée pour ce cas.
- v0.15.2 installée par Wi-Fi après contrôle d’identité, avec empreintes et contenu HTTP vérifiés. Les comptes et données sont conservés ; aucun appel de modification de tâche Todoist n’a été envoyé pendant les contrôles.


## v0.15.1 — Hauteurs réduites et polices du cadre

- 81 tests et contrôles syntaxiques conservés. Le contrôle physique de v0.15.0 a révélé un débordement météo à 744 px de haut lorsque Firefox affiche sa barre. La grille et la météo sont compactées dans ce cas, sans masquer les prévisions. À 1280 × 744 : prévisions à y=202–230 dans la tuile y=96–242 ; document 1280 × 744, défilement limité au contenu plus haut que le viewport.
- Repas prévu au titre long testé par l’interface sur l’origine isolée : deux lignes, temps / portions lisibles et clic conservé. Les décorations dépassant la carte sont coupées intentionnellement.
- Les graisses Inter 400/500/600/700 sont désormais statiques et locales ; leurs quatre ressources répondent HTTP 200. Aucune police externe chargée à l’usage.
- v0.15.1 installée par Wi-Fi avec identité, empreintes et HTTP vérifiés. Accueil constaté sur le cadre avec météo contenue et graisses Inter corrigées. La vraie liste Todoist a révélé un titre contenant un long lien Markdown ; le traitement de ce cas est corrigé dans v0.15.2.


## v0.15.0 — Interface épurée et météo détaillée

- `npm run check`, 81 tests et `git diff --check` réussis. Police Inter variable locale et sa licence incluses ; nouvelle marque Spotify vectorielle blanche servie localement. Tous les nouveaux modules / ressources répondent HTTP 200 avec le serveur Node optionnel.
- Accueil clair/sombre à 1280 × 800 : navigation orange, Domotique dans les cinq entrées avec robot, veille avec écran/lune distinct du minuteur ; date en haut, horloge épurée et deux textes liés à six plages horaires Zurich. Contributions GitHub en nuances orange, repas / musique inactifs modernisés.
- 18 tâches synthétiques sur l’origine de vérification distincte : toutes visibles à 1280 × 800 en deux colonnes ; à 320 px, document 320 × 800 sans débordement, défilement uniquement dans la liste. Le panneau décoratif est retiré. Aucune tâche de vérification créée dans Todoist ou sur le cadre.
- Cuisine à 320 px avec minuteur actif : pas de débordement horizontal ou du document ; minuterie dans l’en-tête et boutons cuisine accessibles dans le contenu défilant. Minuteur de contrôle arrêté ensuite.
- Météo : clic sur le corps de la tuile ouvre les détails réels, sept jours / 24 heures reçus auprès d’Open-Meteo. Données manquantes affichées indisponibles, repli sur le relevé précédent en cas d’échec. Vue complète à 1280 × 800 sans défilement vertical ; bande horaire défilante horizontalement. Aucune erreur console constatée sur les vues contrôlées.
- 240 citations uniques et sourcées, dont 40 supplémentaires de Vauvenargues et Pascal sur éditions anciennes Wikisource. Cycle sans répétition, alternance d’auteurs lorsque possible, précédent/suivant et historique récent local testés.
- v0.15.0 copiée sur le cadre via SSH Wi-Fi après contrôle d’identité, empreintes et contenu HTTP vérifiés. Rendu constaté avec le nouveau menu, les tuiles et 505 contributions orange ; Todoist et Spotify conservés. Le débordement de la météo en fenêtre réduite est corrigé dans v0.15.1.


## v0.14.0 — Widgets et configuration directe

- `npm run check`, 78 tests et `git diff --check` réussis. Les nouveaux modules et leur CSS sont servis en HTTP 200 par le serveur Node optionnel.
- Accueil contrôlé dans le navigateur à 1280 × 800 et 320 px : aucun débordement global, grande pochette, nom de sortie, pistes calendrier et horaires visibles. Sur une recette, minuteur en haut à 44 px de hauteur, bouton La suite distinct et accessible ; minuteur arrêté après le contrôle.
- Remplacement réel d’un ICS synthétique sur une origine de test : ancien nom conservé, rendez-vous remplacés sans doublon ; aucun fichier de test importé dans les comptes réels ou sur le cadre. SDK Google officiel chargé dans le navigateur, formulaire prêt ; pagination, dates Zurich, fins exclusives et refus/expiration testés synthétiquement. Aucun Client ID utilisateur ni consentement Google configuré.
- Qualité de l’air réellement reçue depuis Open-Meteo pour la ville configurée, indice européen et UV séparés. Cache propre à la ville, indépendant de la météo. Home Assistant media_player : droits de commande et bornes du volume testés avec protocole simulé ; aucune instance ni enceinte réelle connectée.
- Identité du cadre et accès SSH recontrôlés. v0.14.0 installée par Wi-Fi, empreintes et contenu HTTP vérifiés, onglet Firefox unique actualisé. Accueil réel constaté avec Domotique, qualité de l’air, grande pochette et nouvelles tuiles ; tâches Todoist et relevé GitHub 505 conservés, Spotify reste associé mais aucun morceau actif lors du contrôle. Les cinq imports calendriers sont conservés ; aucun rendez-vous dans les prochaines 24 h à ce moment.


## v0.13.0 — Calendrier lisible et vue 3 jours

- Filtre commun Perso & Travail orange, Myrak bleu conservé, sans fusionner ni modifier les calendriers d’origine.
- Vues Jour et 3 jours sur grille horaire, dates fixes, journées entières séparées, chevauchements en colonnes et commandes tactiles ; fiche de rendez-vous accessible par toute la carte. Vues semaine/mois conservées.
- `npm run check`, 74 tests et `git diff --check` réussis. Contrôles navigateur : 1280 × 800 clair/sombre, 320 px sans débordement global (défilement limité à la grille), filtre orange masquant les rendez-vous concernés, déplacement de trois jours, détail et retour du focus à la carte d’origine.
- Les rendez-vous des captures de contrôle sont synthétiques et vivent sur une origine de test distincte ; ils n’ont pas été importés sur le cadre ni dans les comptes réels.
- v0.13.0 copiée par Wi-Fi sur le cadre avec empreintes et HTTP vérifiés. Onglet unique actualisé ; filtre commun orange et bouton 3 jours constatés sur le vrai 1280 × 800. Les connexions existantes restent dans son navigateur. Fichiers de transfert, code et exports temporaires supprimés après l’association, y compris l’entrée Téléchargements Android.


## v0.12.0 — Agendas importés et Todoist direct

- `npm run check` et 71 tests réussis : séparation achats/tâches (projet choisi, projets course/courses et sous-projets), pagination API, récurrences/exclusions/exceptions, DST, journées entières et événements de nuit, déchiffrement, expiration et altération des transferts.
- Aperçu réel à 1280 × 800 et contrôle géométrique à 320 px : formulaires, connexion et liste des cinq agendas sans débordement horizontal. API Todoist réelle : projet « course » créé, rayons créés, liste des courses vide et 18 tâches du jour/en retard dans À faire ; aucun élément utilisateur ajouté comme test.
- Exports réels récupérés depuis Google Agenda Myrak et le lien Outlook complet préexistant, plus les trois liens iCloud fournis. Aucun partage modifié. Les sources iCloud comptaient 127, 0 et 5 VEVENT ; Google 1 et Outlook 5. Dans la fenêtre locale −60/+365 jours : 11, 0, 2, 1 et 4 occurrences. Ce sont des imports datés, pas une synchronisation automatique.
- GitHub authentifié confirme des contributions privées absentes de la recherche publique. Un relevé de 28 jours UTC a été importé avec le libellé « contributions » ; aucun jeton GitHub ni nom de dépôt privé transféré. Le relevé reste explicitement manuel.
- Consentement explicite reçu pour mémoriser Todoist sur le Mac et le cadre ; association réalisée sur les deux. Transfert AES-256-GCM, code séparé et expiration 30 minutes ; fichiers privés hors dépôt. Contrôle exact des liens privés et du jeton Todoist : aucune occurrence dans les fichiers du projet.
- Identité physique recontrôlée : sun8i, Android 6.0.1, ARMv7, 1280 × 800. v0.12.0 installée par Wi-Fi avec empreintes et HTTP vérifiés ; onglet existant actualisé, Spotify réel conservé. Après une coupure, USB retrouvé sur l’autre serveur ADB local ; clé hôte conservée, filtre adapté à la nouvelle IP du même Mac et services repris. Association réelle du cadre réussie : 18 tâches Todoist, agendas importés et relevé GitHub 505 retrouvés après force-stop/réouverture de Firefox. Spotify reste connecté. Ce contrôle ne valide pas le démarrage automatique Android.
- Le serveur Node optionnel sert désormais aussi les modules Spotify/teintes/import et leur bibliothèque ; ses tâches excluent également les projets de courses. Le cadre reste servi localement sans dépendre de Node sur le Mac.


## v0.11.1 — Validation sur le cadre

- v0.11.0 transférée par Wi-Fi, empreintes et HTTP vérifiés, unique onglet actualisé puis plein écran restauré. Météo compacte, flèches retirées et contour blanc Spotify constatés sur le vrai 1280 × 800.
- Ouverture depuis le corps de la tuile Spotify : vraie pochette conservée, paroles synchronisées en dessous, bouton Home, volume et fond adapté à la pochette constatés. Aucune nouvelle connexion Spotify nécessaire. La progression du contour a été observée entre deux relevés sur le site.
- La barre de lecture native Firefox était bleue ; v0.11.1 lui donne la même couleur blanche que dans Chromium. Les couleurs de fond ont été vérifiées depuis le style réellement appliqué dans Chrome.
- Le son de la sono et son réglage physique restent à confirmer avec l’utilisateur. Les calendriers ne sont pas encore connectés : aucun rendez-vous personnel n’a été présenté comme chargé.

## v0.11.0 — Accueil, veille et fond adaptatif

- Syntaxe et 64 tests réussis : sélection du prochain rendez-vous en respectant les filtres, absence de faux événement, contour représentant le temps restant et palettes distinctes avec repli neutre.
- Clics réels en navigateur sur la température, le message des priorités, le texte de l’agenda, le titre musical, l’auteur et le compteur GitHub : destinations attendues ouvertes sans flèche visible. Les boutons internes restent indépendants.
- Veille 1280 × 800 : citation sur 1120 px, météo réduite à icône/température, rendez-vous à côté, jour avec majuscule. Rendez-vous visuel contrôlé avec les exemples locaux puis exemples désactivés ; les comptes calendrier réels restent à autoriser. Vue 320 × 700 sans débordement horizontal.
- La pochette publique utilisée annonce les autorisations CORS nécessaires. L’extraction ne traite que 24 × 24 pixels et son cache reste en mémoire, limité à huit images ; aucun service de palette ni traitement de flou permanent.

## v0.10.0 — Focus musique allégé

- Syntaxe et 60 tests réussis, dont ciblage explicite de la sono, refus d’un appareil restreint, volume borné, reprise sans métadonnées et renouvellement du jeton.
- Le lecteur retire la navigation et les notices techniques ; la pochette reste en place et les paroles sont rendues dans une région distincte en dessous. Aucun texte de chanson n’est embarqué dans le dépôt.
- Vue locale 1280 × 800 et 320 × 700 contrôlée ; sortie vers Maison et absence de débordement horizontal vérifiées. Les données et le son réels de Home restent une validation séparée.

## v0.9.1 — Lisibilité du code d’association

- Association réelle Mac → cadre effectuée après accord explicite, avec fichier chiffré et code séparé. Le fichier a été enregistré comme téléchargement Android pour être sélectionnable. Après fermeture forcée et réouverture de Firefox, Hub a retrouvé le vrai morceau et la commande pause sans nouvel OAuth ; un seul onglet est resté ouvert. Les fichiers et l’entrée temporaire ont été retirés.
- La pause via l’API a été constatée dans l’application Spotify, sans erreur de décodage. La lecture a été rétablie ensuite.
- Le code d’association reste masqué au départ ; une commande explicite permet de l’afficher puis de le masquer sans refaire l’export ni changer de code. Le code n’est pas mémorisé dans les réglages.

## v0.9.0 — Connexion mémorisée et association Spotify

- Syntaxe vérifiée, 57 tests réussis. Le client retrouve son jeton depuis un stockage persistant même avec un nouveau stockage de session, renouvelle l’accès et supprime les deux copies lors d’une déconnexion. Un échec d’écriture ne retire pas la session active.
- Le fichier d’association ne contient aucun jeton ni code en clair : AES-256-GCM, IV aléatoire de 96 bits, contexte authentifié et clé aléatoire de 256 bits conservée à part. Expiration à 10 minutes contrôlée après déchiffrement. Code erroné, altération et expiration testés ; aucun jeton réel dans les tests ou le dépôt.
- Formulaires réels de configuration/import vérifiés en navigateur à 1280 × 800 et 320 × 700 ; aucune largeur débordante. La transmission réelle vers le cadre et la persistance ont ensuite été vérifiées séparément : voir v0.9.1.
- Aucun travail de portage Android natif : l’utilisateur a choisi de conserver l’application web. Le dépôt communautaire cite à la fois des dashboards web et Mado, qui utilise Kotlin/Canvas avec un serveur Rust distinct.

## v0.8.1 — Veille, tuiles et activation des services

- Syntaxe vérifiée et 53 tests réussis : migration hors démonstration avec conservation des données, clic sur les tuiles sans déclencher une navigation depuis leurs commandes, auteur/source de citation séparés, données différées rendues au réveil, accusés de commande Spotify sans analyse JSON et erreurs sans contenu brut du fournisseur.
- Navigateur 1280 × 800 : clic sur le texte de la météo, le corps de Spotify et le message de l’agenda ; destinations attendues ouvertes. Citation, auteur et œuvre lisibles en veille. Vue 320 × 700 : aucune largeur débordante, citation et source visibles, réveil accessible.
- Moudon identifiée par le géocodage officiel Open-Meteo ; prévisions réelles reçues sur le Mac puis le cadre. Aucune géolocalisation de l’utilisateur ni clé météo nécessaire.
- Spotify : application existante retrouvée dans la session Chrome de l’utilisateur. Deux adresses de retour ajoutées et enregistrées après autorisation explicite, sans changement du secret. Consentement lecture/contrôle approuvé, retour OAuth PKCE réussi, lecture active depuis un iPhone et paroles synchronisées LRCLIB constatées. Aucun jeton, texte de chanson ou relevé personnel n’est ajouté aux fichiers du projet.
- Une réponse réussie non JSON lors du contrôle Spotify a révélé un défaut du client ; les commandes n’essaient plus de décoder leurs accusés en JSON. Le retour de veille reconstruit uniquement la page devenue obsolète pendant l’inactivité. Les tests couvrent ces deux régressions.
- Cadre : identité SSH relue avant écriture, fichiers v0.8.1 et empreintes vérifiés. Le déploiement n’a pas ajouté d’onglet. Trois anciens onglets Hub fermés après contrôle des titres, puis unique onglet actualisé ; Moudon et les états réels « à connecter » affichés. Aucun effacement de données Firefox. Les vérifications injectées ne remplacent pas un nouveau test tactile humain.
- Authentification Spotify du cadre, Todoist, calendriers et appareils Home Assistant restent des validations distinctes. Voir CONFIGURATION.md ; la connexion sur Chrome ne connecte pas Firefox à distance.

## v0.7.1 — Réactivité des interactions

- `npm run check` : réussi. `npm test` : 47 tests réussis, dont cinq nouveaux contrôles de régression sur la réutilisation du rendu, le focus, les filtres et les dates autour de minuit à Zurich. Les tests HTTP locaux nécessitent l’autorisation d’ouvrir leur port de test.
- Navigateur local : recherche « citron » sans perte du focus ni du curseur, favori ajouté puis retiré sur place, fenêtre Réglages fermée avec Échap et retour du focus, navigation semaine/mois. Pas de débordement horizontal à 320 px ; composition 1280 × 800 conservée. Les animations respectent le clavier et la préférence de mouvement réduit.
- Comparatif dans Firefox 143.0.4 sur le cadre Android réel : ancienne source au commit `815d71f` et source v0.7.1, même navigateur, données d’exemple isolées, API et synchronisations désactivées. Médianes du temps JavaScript et des mutations DOM, mesurées avec `performance.now()` ; six actions pour l’agenda, huit pour les autres. Deux rafraîchissements d’affichage séparent les actions. Ce sont des mesures ponctuelles de traitement, pas une mesure INP, des images par seconde ou du délai physique entre le doigt et l’écran.

| Action | Avant | Après |
| --- | ---: | ---: |
| Navigation agenda | 383 ms | 51 ms |
| Fermeture des réglages | 212 ms | 166 ms |
| Ajouter/retirer un favori | 179 ms | 6 ms |
| Filtrer les recettes | 393 ms | 107 ms |

- Le test confirme aussi que l’en-tête reste le même nœud lors des interactions et que le champ de recherche reste en place. Le maximum observé de fermeture après modification était de 298 ms : le coût de mise en page d’une fenêtre et de son focus reste variable sur ce matériel.
- v0.7.1 transférée en Wi-Fi dans une nouvelle version statique, avec vérification des empreintes et du manifeste HTTP. Firefox affiche la copie locale du cadre ; aucune donnée personnelle ni connexion de compte modifiée. Les tailles tactiles de v0.7.0 sont conservées.

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

- Symbole à arcs réguliers, lettrage géométrique gras et ligatures S–M, M–A et H–U en tracés vectoriels contrôlés en mode sombre à 1280 × 800 et clair dans la bibliothèque.
- En-tête à 320 px : largeur du document 320 px, pas de débordement.
- Navigation au clavier : focus visible, contour iris de 3 px. Nom accessible du bouton : « Hub. — Accueil ».
- Aucun ajout de dépendance ni animation permanente. Favicon SVG et signature téléchargeable assortis.


## v0.2.2 — Typographie et Lucide

- Lettrage fondé sur Outfit 850, fourni par le dépôt officiel Google Fonts, converti en tracés SVG avec ligatures personnalisées. Favicon et symbole conservés.
- 24 SVG officiels de lucide-static 1.60.0 intégrés localement ; seules les icônes utilisées sont conservées. Source : https://lucide.dev/guide/static. Licences jointes.
- En-tête et pictogrammes vérifiés à 1280 × 800, puis à 320 px. Le bouton Réglages ouvre la fenêtre, le bouton de fermeture ramène à l’accueil.
- Contrôles de syntaxe et quatre tests existants réussis.

## v0.3.0 — Hub. et bibliothèque de pensées

- Renommage visible Hub., SVG vectoriels autonomes, point iris et favicon H. Pas de changement de clés du stockage local.
- 200 citations distinctes, 7 auteurs, longueur maximale de 200 caractères et sources HTTPS : contrôles automatiques. Chargement différé après `data.js`, avant `app.js`.
- Sources principales : Épictète, Manuel (Guyau, 1875) ; Marc Aurèle, Pensées pour moi-même (Barthélemy-Saint-Hilaire, 1876) ; Vauvenargues, Réflexions et Maximes (Gilbert, 1857) ; La Rochefoucauld, Maximes (Hachette, 1868). Passages repris directement des textes, blancs et ponctuation nettoyés ; extraits indiqués pour les passages des stoïciens. Référence complète attachée à chaque entrée dans `dist/quotes.js`.
- Recherche « courage » filtrée sur Vauvenargues : une citation correspondante, source accessible ; aucun rendu de plus de 12 résultats à la fois.
- La rotation de veille utilise le réveil d’horloge existant, sans boucle d’animation ni minuteur supplémentaire ; suspendue lorsque le document est masqué.
- Le profil GitHub public KillermyB est confirmé ; aucun accès aux dépôts privés n’est revendiqué.
- Contrôle visuel du logo à 1280 × 800 et de l’en-tête à 320 px ; bibliothèque sur mobile sans débordement horizontal. Recherche, filtre auteur, pagination, citation suivante et lien GitHub contrôlés dans le navigateur.
- `npm run check`, `npm test` (5 tests) et `git diff --check` réussis. La rotation temporisée en veille reste à mesurer sur le vrai cadre.

## v0.3.1 — Lettrage Geist

- Syne remplacée par Geist SemiBold, depuis le paquet officiel `geist` 1.8.1. Tracés locaux, sans chargement de police à l’exécution ; point iris conservé. Licence jointe dans `dist/licenses/geist.txt`.
- Logo autonome et en-tête contrôlés dans le navigateur, en clair et en sombre.

## v0.4.0 — Outils quotidiens et recettes

- 9 tests : cinq existants et quatre nouveaux couvrant prochain rendez-vous/priorités, minuteur absolu/pause, validation des transferts et catalogue de 20 recettes supplémentaires. Syntaxe des deux nouveaux scripts contrôlée.
- Cuisine en navigateur : ajout favori, filtre, retrait, rechargement, présence dans « Plats retirés », restauration et favori conservé. Favori de contrôle retiré ensuite. Les plats retirés sont exclus du repas du brief et de la suggestion d’accueil.
- 20 nouvelles recettes visibles dans le filtre petit budget/sans porc ; source individuelle accessible dans la recette. Les ajouts personnels existants sont conservés.
- Brief : repas choisi retrouvé après rechargement ; suggestion d’accueil liée au repas prévu. Les données de calendrier et météo d’exemple restent indiquées.
- Minuteur : durée libre de trois secondes et signal de fin contrôlés ; pause de cinq minutes retrouvée après navigation/rechargement, puis minuteur arrêté. Le bouton Pause est masqué à la fin ; alerte visuelle, aucune sonnerie garantie.
- Compagnon : note enregistrée, recette importée par sélecteur de fichier puis ajoutée au carnet, photo PNG de contrôle convertie et enregistrée ; présence après rechargement. Export JSON téléchargé puis réimporté : « Ces contenus sont déjà présents », sans doublon. Données de démonstration uniquement, dans le navigateur localhost.
- Présentation : brief sombre 1280 × 800, compagnon et carnet à 320 × 740 ; largeur du document égale à celle de l’écran, filtres défilants dans leur conteneur. Police calculée des citations : DM Sans / Arial / sans-serif.
- Aucun serveur de synchronisation ajouté, aucune validation matérielle ni connexion OAuth réelle revendiquée. Le transfert sur téléphone/cadre, les onglets et l’installation du navigateur Android restent à tester sur ces appareils.

## v0.5.0 — Composition, courses et musique

- `npm run check` et 13 tests passent : neuf existants, quatre nouveaux sur la pagination Todoist, les opérations sur projet/section, les erreurs d’accès/limites et le flux Spotify PKCE (S256/état), plus absence de lecteur actif. Réponses simulées uniquement pour les API authentifiées.
- Accueil contrôlé à 1280 × 800 : document 1280 × 800, sans défilement vertical ni débordement horizontal. Horloge sur la moitié du haut, météo et agenda 24 h, quatre tuiles, citations et GitHub. Clair/sombre contrôlés ; pas de tuile verte en sombre.
- Formats 390 × 844 et 320 × 740 : accueil, courses, lecteur, réglages et citations sans débordement horizontal après correction des prévisions météo. La grille des courses passe sur une colonne ; les tuiles d’accueil sur deux, puis une à 320 px.
- Courses locales : ajout d’un article de contrôle, classement automatique, coche en bas, rétablissement, modification du libellé/rayon et présence après rechargement. Ajout des cinq ingrédients des pâtes au citron deux fois : seulement cinq articles ajoutés. Liste locale retrouvée après passage à Todoist non connecté puis retour local.
- Régression : favoris, retrait/restauration d’un plat, minuteur global traversant les pages, brief avec repas antérieur, trois contenus IndexedDB et deux recettes personnelles existantes toujours accessibles. Favori et retrait d’essai rétablis ; minuteur de contrôle arrêté. Les données de contrôle sont uniquement dans localhost, pas dans le site publié.
- Bibliothèque : 200 citations, police calculée DM Sans / Arial / sans-serif, focus initial sur Fermer dans les fenêtres. Transitions courtes et règles `prefers-reduced-motion` conservées ; pas de nouvel émulateur système de mouvement utilisé.
- Contrôles CORS non authentifiés de l’API Todoist : origine du site acceptée, autorisation des en-têtes Authorization et Content-Type. Aucun jeton réel fourni, aucune écriture distante réalisée.
- Spotify sans connexion affiche un état vide explicite et des commandes désactivées. Configuration avec adresse HTTPS/loopback vérifiée dans l’interface. La lecture, les comptes réels, le tactile et le démarrage sur le cadre restent à valider.

## v0.5.1 — Emplacements de l’accueil

- Courses retirées de l’accueil ; agenda 24 h dans la rangée du bas sur deux colonnes, priorités sous la météo à droite de l’horloge.
- Clair à 1280 × 800 : document de mêmes dimensions, trois tâches entièrement dans leur carte. Sombre à 320 × 740 : aucune tuile Courses, priorités et agenda à leurs emplacements attendus, document sans débordement horizontal.
- Accès Cuisine → Courses vérifié ; liste locale et ses six éléments de contrôle conservés. `npm run check`, les 13 tests existants et `git diff --check` passent.

## v0.5.2 — Météo en veille

- Pictogramme et température sous l’heure ; ville/conditions/heure du relevé reprises de la météo déjà enregistrée. Exemple explicitement signalé si activé ; message à configurer sans ville et sans exemples.
- Veille contrôlée à 1280 × 800 et 320 × 740 avec une citation longue : texte et météo visibles, aucun débordement horizontal. Sortie par bouton et Échap vérifiée. Réglage des exemples rétabli après l’essai.
- Syntaxe, 13 tests existants et diff vérifiés. Aucun nouvel appel météo ni intervalle ajouté ; les conditions réelles dépendent toujours de la ville configurée. Pas de validation physique sur le cadre.

## v0.5.3 — Dégradé de l’horloge

- Fond de la carte horloge remplacé par trois dégradés CSS légers bleu ciel, crème et abricot, en clair comme en sombre. Aucun fichier image ni mouvement permanent ajouté.
- Contrôle visuel sombre à 1280 × 800 et clair à 320 × 740 : texte foncé lisible, pas de débordement horizontal. Syntaxe, 13 tests existants et diff vérifiés.

## v0.6.0 — Agenda, paroles automatiques et Home Assistant

- Audit réparti entre trois agents : ergonomie/bugs, paroles et préparation du cadre, puis protocole et interface Home Assistant. Fonctions locales et stockage existants conservés.
- `npm run check`, 40 tests et `git diff --check` passent. Le test serveur utilise une écoute locale autorisée ; son nettoyage gère aussi un processus déjà terminé. Les nouveaux modules sont servis par la liste de fichiers autorisés.
- Accueil contrôlé à 1280 × 800 en clair et sombre : document sans débordement, espace de 12 px entre les rangées, trois priorités entièrement visibles. Orange renforcé et nuances de bleu plus profondes sur l’horloge.
- Agenda : départ et fin restent lisibles pour un événement de cinq minutes et deux rendez-vous simultanément affichés à 320 px, sans débordement horizontal. Un clic ouvre la bonne journée. Perso, Myrak (#0213ee, couleur de la capture) et Travail ont des repères distincts en jour/semaine/mois et dans la bande de l’accueil.
- Musique : commandes pause/reprise au clavier et focus conservé, changement de morceau, paroles automatiques sans clic, défilement interne de la ligne courante à 320 px, retour à la pochette et annulation couverts par tests et/ou navigateur. La progression et le suivi s’arrêtent hors lecture visible. Réponses et textes synthétiques uniquement ; aucun compte Spotify réel ni parole de chanson téléchargée pour les essais.
- Home Assistant : formulaire, refus d’authentification, connexion, lumière allumée, robot en nettoyage, appareil indisponible, jeton vidé du champ, focus clavier et déconnexion vérifiés en navigateur à 320 px et 1280 × 800 avec un client simulé. Les 13 tests du vrai module couvrent le protocole WebSocket, les courses snapshot/événements, les capacités, refus, délais et déconnexions. Aucun appareil physique commandé.
- Compagnon/météo : contrôles VM ciblés sur préservation des brouillons/photos, sauvegarde asynchrone, erreurs, cache daté et rafraîchissement visible à 30 minutes ; le dernier relevé reste disponible hors réseau. Aucune ville réelle choisie pendant cette vérification.
- Historique Git inspecté : 121 blobs texte historiques sans motif de credential fort ou identifiant MAC ; les fichiers privés et fixtures restent exclus. Cette recherche ne remplace pas les exclusions et la revue des chemins publiés.
- Restent distincts : connexion aux comptes réels, Home Assistant de l’utilisateur, clone sur la tour et installation/tactile/performance du cadre physique.


## v0.7.0 — Installation réelle et maintenance Wi-Fi

- USB/ADB root confirmé : sun8i, Android 6.0.1, ARMv7, build 20260529, 1280 × 800. Sauvegarde des données relue (332 entrées, packages.xml présent), tailles et SHA-256 de boot/bootloader comparées. Sauvegardes privées hors Git ; aucune sauvegarde complète de toutes les partitions revendiquée.
- Firefox 143.0.4 ARMv7 installé depuis Mozilla et SimpleSSHD 27 depuis F-Droid. WebView stock et AiMOR conservés ; aucun flash.
- Fuseau Europe/Zurich, auto_time=1, auto_time_zone=0 et stay_on_while_plugged_in=3 appliqués après accord explicite, puis relus sur le cadre.
- Clé SSH propre au Mac, clé hôte épinglée via USB, authentification et `uid=0(root)` vérifiés sur le vrai Wi-Fi. Source étrangère refusée par le shell ; redirections désactivées. Pare-feu en mémoire limité à ce Mac/boucle locale et IPv6 bloqué sur 2222. La reprise après redémarrage reste distincte.
- Copie statique v0.7.0 transférée en Wi-Fi, empreintes relues sur le cadre, manifeste servi par HTTP identique au manifeste local. Service lié uniquement à 127.0.0.1:4173 ; relance manuelle `frame start` vérifiée.
- Affichage et plein écran contrôlés par capture de l’appareil. L’utilisateur confirme le vrai tactile Cuisine → recette → Maison. Les polices variables affichaient des graisses trop fines : versions statiques dérivées des mêmes sources, licences conservées, puis rendu physique corrigé vérifié.
- Agrandissement demandé après l’essai réel : navigation 15 px, priorités 15 px, heures d’agenda 24 px, icônes/commandes plus grandes et horloge renforcée. Contrôle 1280 × 800 : document 1280 × 800, trois priorités dans leur carte et prévisions dans la météo. Les exemples restent signalés.
- Réglages/plein écran et retour vérifiés aussi en navigateur, format 320 px sans débordement. Tests des fichiers statiques (empreintes, refus des fichiers cachés/liens symboliques) et configuration SSH ajoutés. `npm run check`, 42 tests et `git diff --check` passent.
- À vérifier séparément : réglages Android par toucher physique, autostart après coupure, CPU/mémoire prolongés, vraie ville météo et comptes externes.

### Contrôle de redémarrage

- Après accord explicite supplémentaire, option SimpleSSHD au démarrage activée. Redémarrage Android réel effectué, USB retrouvé par le serveur local 5037 (5038 avant redémarrage), adresse Wi-Fi relue et clé hôte existante conservée.
- Europe/Zurich, auto_time=1, auto_time_zone=0 et stay_on_while_plugged_in=3 persistent. Les fichiers de Hub sont conservés.
- SSH n’a pas démarré seul : journal ciblé `BackgroundManagerService: prevent from boot complete broadcast: org.galexander.sshd`. Lecture de la politique constructeur : liste de boot issue des ressources du système, sans exception utilisateur ciblée identifiée. Aucun changement de framework, désactivation globale de la protection ou remplacement du launcher.
- Pare-feu restreint et SSH relancés par USB ; relance de Hub par Wi-Fi effectuée ensuite. La préférence activée ne constitue pas une preuve d’autostart. Une application kiosque déclarée HOME reste la prochaine étape, après test physique du retour aux réglages Android.

## 21 octobre 2026 — Démarrage automatique et diagnostic IP

- Identité USB réidentifiée : modèle logiciel AEEZO, sun8i, Android 6.0.1, build du 29 mai 2026. Sauvegardes privées boot/bootloader relues avec empreintes identiques ; archive des données relue, 332 entrées. Pas de sauvegarde complète de toutes les partitions revendiquée.
- Ajout asynchrone dans `/system/bin/install-recovery.sh` après accord explicite du propriétaire sur le fichier, le remontage et le risque. Les 589 octets d’origine sont conservés intégralement ; sauvegardes locale et sur le cadre. Le fichier final fait 879 octets, propriétaire/groupe root, mode 750 ; `/system` revenu en lecture seule. Aucun flash ni remplacement d’AiMOR/launcher.
- Le script privé dans `/data/local/hub/` attend la fin du boot avec délai borné, lance le serveur sur la boucle locale seulement, reconstruit les règles SSH pour le Mac autorisé et bloque IPv6 sur 2222, puis démarre SimpleSSHD et l’activité principale de Firefox. Aucun nouveau jeton ou droit de compte accordé.
- Premier redémarrage : serveur HTTP et SSH revenus seuls ; Firefox a retrouvé Hub dans un seul onglet après restauration de la session. Le deuxième essai d’un verrou par descripteur a échoué sur l’ancien shell Android, sans affecter le démarrage d’AiMOR. Correction par verrou fichier BusyBox, test manuel complet et contrôle que le serveur n’hérite pas du verrou.
- Dernier redémarrage, avec la version finale : changement de boot ID vérifié, `sys.boot_completed=1`, journal terminé, HTTP local valide, SSH en Wi-Fi authentifié par la clé déjà épinglée, règles IPv4/IPv6 présentes et verrou disponible. Aucune relance manuelle des services ou de Firefox après ce redémarrage. Le compte Todoist, les agendas importés et les données de l’accueil sont conservés. Un seul onglet Firefox constaté dans l’arbre UI ; capture physique de Hub effectuée avant interaction.
- Le plein écran HTML n’est pas automatique après redémarrage : activé ensuite par le bouton existant et capture physique de l’accueil 1280 × 800 vérifiée. Europe/Zurich et maintien allumé sur alimentation conservés. Une coupure électrique réelle reste non testée.
- IP et MAC changent encore à chaque reboot : DHCP maintenu, aucune IP statique choisie sans connaître le pool de la box. La configuration SSH privée a été actualisée depuis les lectures USB ; les nouvelles adresses présentent la clé hôte déjà épinglée. Aucun identifiant réseau privé ajouté au dépôt.
- La box est accessible à sa passerelle locale, mais son interface HTTPS s’arrête sur un avertissement de certificat. Étape remise au propriétaire, sans contournement. Réservation DHCP et stabilisation de l’identité réseau restent à faire.
- Contrôles locaux : syntaxe des deux scripts vérifiée sur le Mac et du lanceur sur Android ; `npm run check`, 82 tests avec écoute localhost autorisée et `git diff --check` passent. Le premier essai des tests dans le bac à sable avait uniquement bloqué l’écoute du test serveur.
- Fichiers web `dist/` inchangés : Hub reste v0.15.2 sur le cadre et le site privé. Cette livraison concerne la configuration du cadre et sa documentation, sans nouvelle publication du site.

## v0.16.0 — Interface épurée et tâches étendues

- Pied de page retiré ; cartes Spotify et Cuisine simplifiées, dégradé de l’horloge clair avec orange discret en haut et bleu en bas. Le lecteur au repos conserve la même disposition compacte qu’en lecture.
- GitHub : niveaux bleu clair/bleu/orange selon le nombre quotidien. Un import mettait à jour le panneau mais pas immédiatement la tuile : correction et contrôle navigateur du passage de 129 à 130 sur un relevé synthétique local uniquement.
- Todoist : Toutes inclut les tâches futures et sans date ; Aujourd’hui et les priorités de l’accueil gardent le filtre du jour/en retard. Courses et sous-projets exclus. Test de 101 tâches sur deux pages API synthétiques ; navigateur avec 36 tâches locales, trois colonnes et 27 tâches visibles à 1280 × 800, suite défilable. Aucun ajout de tâche de contrôle au compte réel.
- Icônes météo Meteocons 0.1.0 fill statiques, licence MIT conservée, marge SVG réduite. Fichiers locaux uniquement, sans animation permanente ; accueil, détail et veille utilisent le même jeu. Jour/nuit viennent des données Open-Meteo quand disponibles.
- Navigateur : clair/sombre à 1280 × 800 ; document 1280 × 800, prévisions à l’intérieur de la carte, aucune icône manquante. À 320 × 740 : aucune sortie horizontale pour accueil, tâches et météo ; température et qualité de l’air sans chevauchement. Les sections longues défilent dans leur conteneur.
- `npm run check`, 85 tests et vérification du diff réussis. Publication de fichiers statiques uniquement, sans données personnelles, secrets ni fixtures navigateur.
- Cadre : déploiement v0.16.0 et contrôle des empreintes via SSH Wi-Fi ; actualisation de l’onglet existant par Wi-Fi. Capture réelle de l’accueil avec le vrai morceau Spotify en cours, la pochette, l’appareil iPhone et les nouvelles cartes. Les comptes, agendas et 505 contributions importées sont conservés. L’USB n’a pas été nécessaire pour ce transfert ni ces contrôles.

## v0.17.2 · Maison connectée et carte musicale

- 89 tests réussis et vérification syntaxique. Couverture : mémorisation HA explicite, effacement limité à sa clé, import AES-GCM validé, reconnexion avec temporisation/suspension en arrière-plan sans répétition de commande, scènes jamais activées acceptant leur état horodaté `unknown`.
- Carte musicale : pochette réelle intégrée à droite, appareil au-dessus du titre, pause pleine et progression blanche sur le périmètre. Retrait de 3 px et rayon intérieur de 22 px pour éviter le découpage par les coins de 25 px. Contrôle visuel à 48/59/72/99/100 % ; accueil sans débordement horizontal à 320 px et composition contrôlée à 1280 × 800.
- Jeton HA dédié créé avec l’accord explicite de l’utilisateur ; mémorisé sur le Mac et le cadre, hors Git. Saisie au cadre via SSH chiffré ; les fichiers temporaires d’association sont supprimés après vérification.
- Lecture réelle des états et reconnexion au rechargement vérifiées sur le Mac et le cadre. Le cadre affiche les vrais appareils et la Sonos en lecture ; aucun allumage, changement de volume, lancement de scène ou commande de robot n’a été effectué pour ces tests.
- Smart Life/Tuya associé après validation du QR par l’utilisateur : 11 appareils et 30 entités. Lumières, prises et neuf scènes visibles. Plusieurs lumières sont signalées indisponibles par HA ; l’intégration ne prouve pas qu’elles sont alimentées ou en ligne.
- Vue Maison créée dans Home Assistant avec cartes natives, Sonos, lumières regroupées par pièce, télévisions, raccourcis existants et scènes. ScreenK et ses scripts sont conservés ; copie locale privée de sa configuration avant modification.
- La copie HTTPS de Hub ne peut pas joindre cette instance HA en HTTP ; la connexion locale du cadre reste la solution installée. Aucun port Internet, certificat ou relais distant ajouté.

## v0.18.0 · Domotique compacte

- 92 tests passent et syntaxe vérifiée : regroupement des prises d’éclairage sans inclure les réglages Sonos, ordre scènes/lampes/médias, ciblage du vrai domaine `switch`, états distincts et commandes de puissance TV uniquement selon les capacités Home Assistant. Aucun appareil réel n’a été allumé, éteint ou modifié pendant les tests.
- Contrôle avec la connexion réelle mémorisée dans Chrome : 9 scènes, 11 lampes/prises et 3 lecteurs. À 1280 × 800, tuiles d’éclairage de 78 px de haut et six colonnes ; les identifiants techniques et le bouton Accueil ne sont plus affichés. Couleur ambrée pour les trois éclairages allumés, gris distinct pour les indisponibles.
- À 320 × 740 : deux colonnes d’éclairage, tuiles de 80 px, barre de connexion de 52 px et absence de débordement horizontal. Mode sombre contrôlé ; préférence de mouvement réduit conservée. Les réglages avancés restent repliables et leur ouverture survit aux mises à jour d’état.
- Diagnostic Tuya : un rechargement de l’intégration a été confirmé par Home Assistant. Il n’a pas changé les sept lampes indisponibles ; Fado et les deux prises restent en ligne. Le bref délai de connexion de Smart Life au démarrage ne suffit donc pas à expliquer la disponibilité durablement différente de ces entités.
- L’utilisateur confirme des ampoules ANTELA 9 W. La liste HA identifie Bureau/Couloir en ANTELA-9W-RGB+CCT et les autres avec des modèles génériques. Compatibilité Tuya Local non prouvée, aucune installation HACS/custom component ni réassociation d’ampoule effectuée.


## v0.19.2 — audit de fluidité et contours

Trois agents indépendants ont examiné performances, mouvements et non-régression. Les correctifs ciblent les reconstructions de DOM, la géométrie du contour musical, la stabilité des connexions et du focus. Aucun changement de protocole Home Assistant, de compte, de calendrier ou d’appareil n’est inclus.

`npm run check` et les 113 tests passent. Les nouveaux cas couvrent les réponses Spotify tardives après déconnexion/import/PKCE, les relevés identiques et les pages sans rapport, les brouillons et la soumission de tâches, l’horodatage des courses, le vrai lecteur musique, les événements HA sans effet affiché et la légende.

Sur navigateur isolé à 1280 × 800 puis 320 px : navigation accueil/lecteur/agenda (quatre vues)/tâches/cuisine/minuteur/domotique/météo/veille/réglages, titre long et recherche, ajout par Entrée, focus de modale et champs de détails fermés, mouvement réduit. Pas d’exception JavaScript. Les API sont remplacées par des réponses synthétiques dans ce profil privé de test, sans vraies commandes. Après un cycle de relevé Spotify identique, musique/horloge/priorités gardent leurs nœuds. Les quatre écarts entre l’extérieur du tracé musical et le bord SVG valent 0 px dans ce contrôle ; 60 mises à jour de progression n’ajoutent aucune lecture de géométrie/style ni écriture des chemins. Cela ne mesure ni le tactile physique ni les FPS Android.

## v0.19.3 — bord du contour musical

Le contrôle géométrique précédent ne détectait pas le liseré sombre produit par le lissage de deux arrondis superposés. Le trait déborde désormais de 1 px sous le découpage unique de la carte ; sa largeur visible reste de 3 px. Le SVG n’applique plus de second arrondi. Orange en clair et blanc en sombre sont conservés.

Comparaison avant/après dans un navigateur isolé à densité 2, dimensions et positions fractionnaires, puis gros plan de l’arrondi supérieur droit : liseré sombre visible avant et absent après. Les 113 tests, la vérification syntaxique et le diff passent. Installation v0.19.3 vérifiée par les empreintes et le serveur local du cadre ; aucun compte ni appareil connecté modifié.

## v0.20.0 — minuteurs, musique et maintenance

- 124 tests réussis : trois décomptes indépendants et migration, reprise après pause, extension/retrait, alarme bornée, statistiques GitHub, commandes HA confirmées/non confirmées/déconnectées sans répétition, icônes embarquées et endpoint natif limité aux durées.
- Navigateur isolé avec réponses synthétiques : 1280/768/320 px sans débordement, trois minuteurs sans collision dans le header, reprise après rechargement, échéance d’une seconde, symboles chargés et détail de 28 jours. Après une minute réelle, la citation change et le même nœud musique reste en place. Changement de morceau et arrêt/reprise détectés en veille. Aucune commande aux appareils réels.
- Sur le cadre, serveur local et SSH arrêtés : relance du lanceur déjà autorisé. Images Spotify et prévision de 14 h absentes reproduites physiquement. Symboles maintenant intégrés ; surveillance du serveur local toutes les 30 secondes.
- Installation v0.20.0 avec empreintes vérifiées. Aides natives dans `/data/local/hub` uniquement, ancien lanceur sauvegardé. Endpoint de report protégé par boucle locale, origine/référent et clé native ; aucune commande shell provenant de la page.
- Premier essai plein écran corrigé : Firefox expose le libellé dans `text`, pas `content-desc`. Contrôle du resource-id, du libellé exact et des bornes ; toucher natif réussi, capture réelle sans barre du navigateur.
- Logique nocturne 4 h 30–5 h 29, marqueur journalier, seuil d’uptime et report des minuteurs testés sans changer l’heure. Le passage nocturne réel et l’audibilité par une personne restent à confirmer.
- Redémarrage Android réel effectué : boot ID changé, démarrage terminé, serveur local, SSH et processus de surveillance nocturne revenus sans relance manuelle. Capture réelle de Hub en plein écran, sans barre Firefox ; seule l’adresse DHCP a changé, retrouvée puis validée avec la clé hôte épinglée. L’USB n’est pas revenu dans ce contrôle, mais l’accès Wi-Fi a permis les vérifications. Aucune modification de la box ou IP statique.

## v0.20.1 — musique en veille

Carte centrée de 360 px, réduite à 272 px sur un écran de 320 px. Contour blanc utilisant le même chemin fermé et le même cache de géométrie que l’accueil ; progression une fois par seconde uniquement pendant une lecture visible. Le lecteur garde son nœud lors de ces mises à jour. Reprise de l’observation du contour de l’accueil au réveil.

126 tests passent. Navigateur synthétique : blanc réel dans le style calculé, progression croissante après deux secondes, même carte conservée, étapes 0/48/99/100 %, redimensionnement, mouvement réduit, arrêt/reprise et retour à l’accueil, sans exception ni commande domotique. Le propriétaire confirme aussi avoir entendu l’alarme du minuteur sur le cadre.

## v0.21.1 — Quotidien, trajets et maison

- Syntaxe et 152 tests réussis, dont persistance des portions et notes, erreurs partielles Je pars sans répétition, file Spotify avec confirmation, changement de carte robot et réponses de trajet tardives.
- API transports suisse vérifiée en lecture : HTTP 200, CORS autorisé, horaires Moudon interprétés. Arrêt initial demandé : Moudon, gare (bus), distinct de la gare ferroviaire Moudon.
- Identité du cadre relue : root, sun8i, Android 6.0.1, ARMv7, 1280 × 800. v0.21.0 installée avec empreintes et HTTP vérifiés ; chargement réel de l’accueil et de Quotidien en plein écran contrôlé, connexions et données conservées. Les six prochains départs de Moudon, gare ont été reçus et affichés sur le vrai cadre.
- Contrôle étroit 320 px du nouveau module non réalisé : l’infrastructure de contrôle du navigateur est indisponible dans cette session. CSS adaptative présente ; ne pas confondre avec une validation visuelle à cette taille.
- Aucune extinction d’appareil, aucun nettoyage ni changement de morceau réels envoyés pendant les tests. Sélection des appareils Je pars, pièces/scripts de chaque robot et trajets privés à configurer par l’utilisateur.
- Contrôle Gitleaks du répertoire sans secret détecté. Les captures et données privées de QA restent hors Git.


## v0.22.0 — Brief fusionné et trajets routiers

- Syntaxe et 163 tests réussis. Fusion sans planificateur ni carte Je pars dans la vue Aujourd’hui ; conservation des notes et connexions.
- Navigateur Chrome natif, origine de test isolée localhost:4179 : brief clair/sombre au format 1280 × 800, empilement des cartes à 375 × 667, panneau Position et explication du partage avant permission. Pas de demande réelle de localisation. Console du contexte de test sans message ; le compteur général de DevTools préexistant n’est pas utilisé comme preuve.
- Les deux requêtes publiques OSRM depuis le centre de Moudon ont répondu : 27 min / 23,4 km vers Saint-François et 73 min / 88,8 km vers Bel-Air au moment du contrôle, sans trafic en direct. Le navigateur a reçu et affiché ces résultats et les prochains départs de Moudon, gare.
- GPS validé par client simulé : refus, timeout, données invalides et absence de persistance. La localisation effective du vrai cadre n’est pas prouvée. Aucun compte ni appareil commandé pendant ces tests.


## v0.23.1 — Télécommande locale

- Vérification native : français Suisse `fr_CH` et touches QWERTZ vues sur capture ; anciens réglages sauvegardés en privé.
- 169 tests, budget de transmission linéaire, syntaxe et analyse de secrets sans détection ; commandes limitées à note/minuteur/lampe/tâche, TTL, origine/hôte/sous-réseau, double identifiant, file FIFO, accusés, taille Unicode, quota et séparation des courses vérifiés.
- Protocole CGI testé sur le vrai BusyBox Android dans une file fictive isolée : publication, verrou, prise unique, résultat et état. Aucune action aux lampes ou tâches réelles pendant ces contrôles.
- Navigateur à 375 × 667 : clair/sombre, vues notes/lumières/minuteurs/tâches, lampe/minuteur/tâche simulés et confirmation. Aucun compte réel utilisé dans la prévisualisation.
- GitHub `v0.23.1` : `968e9103e741e994b62a8fb65985a2d4197eb0a5`, identique au code publié sur Sites. Fichiers de cette version vérifiés sur le cadre et affichage réel en plein écran contrôlé.
- Activation réseau persistante refusée par validation automatique faute d’accord explicite ; question d’autorisation en attente, port 4180 non activé. Le test HTTP réel depuis le Wi-Fi et l’association du téléphone restent à faire après cet accord.


## v0.23.2 — Minuteurs en un appui

- 169 tests et syntaxe réussis, analyse de secrets sans détection.
- Session isolée : un appui sur Pâtes lance 10 minutes avec le tag Cuisine ; aucune saisie ni confirmation. Télécommande à 375 × 667 : Thé lance 3 minutes avec retour confirmé simulé.
- Cadre : v0.23.2 copiée et empreintes vérifiées par Wi-Fi ; connexions et minuteurs existants conservés. La télécommande Wi-Fi reste désactivée en attente de son autorisation précédente.


## v0.24.0 — Domotique globale dans la télécommande

- 173 tests, syntaxe et analyse de secrets réussis. Fichiers v0.24.0 installés et empreintes vérifiées sur le cadre par Wi-Fi.

- Contrôles simulés des scènes, prises, robots, Sonos et télévisions : capacités réévaluées au moment d’exécution, volume 0–100 %, fonctions arbitraires refusées et état confirmé distingué d’une simple acceptation.
- Vue réelle générée testée avec scènes, prise, robot, Sonos et TV limitée au marche/arrêt ; contenu échappé et boutons désactivés hors ligne.
- Session changée au rechargement, après interruption ou retour du navigateur : commandes de l’ancienne session refusées sans exécution, avec accusé d’échec. Aucune commande aux appareils réels pendant ces tests.
- Contrôle visuel navigateur indisponible cette fois : Computer Use renvoie `cgWindowNotFound` et son inventaire de navigateurs échoue. Les tests de rendu ne constituent pas une vérification visuelle sur téléphone physique.
- L’écoute Wi-Fi reste désactivée en attente de l’accord explicite précédent.


## v0.25.0 — Citations relues et télécommande activée

- Syntaxe et 173 tests réussis, dont corpus unique, diversité des auteurs, cycle/historique et refus des provenances invalides.
- Les 240 anciennes phrases ont été lues ; les cas douteux et dix-huit ajouts ont été comparés aux sources primaires liées. Douze extraits sans contexte retirés, huit maximes remplacées, références Camus/Montaigne/Descartes/Épictète corrigées. Total : 246 citations de 16 auteurs. Il ne s’agit pas d’une collation exhaustive de 240 fac-similés.
- Activation persistante de la télécommande avec accord explicite : page HTTP 200, requête d’état avec clé valide HTTP 200 et copie présente ; clé invalide et provenance absente/étrangère HTTP 403. Aucune commande à un appareil ni tâche cochée.
- Correction de deux incompatibilités BusyBox 1.20 observées sur le cadre : règle réseau basée sur l’adresse du sous-réseau, et repli strict sur Referer lorsque Origin n’est pas exporté au CGI.
- Navigateur du Mac indisponible via le contrôle graphique ; vérification du téléphone physique toujours en attente.

- v0.25.0 installée en Wi-Fi, empreintes des fichiers vérifiées ; onglet existant actualisé et affichage réel en plein écran confirmé. Télécommande toujours active avec un état récent après actualisation.


## v0.25.1 — Veille plus aérée

- Espacement vertical augmenté entre date, heure, météo et citation. Lecteur compact indépendant en bas à droite, contour blanc de progression conservé ; son apparition ne réduit plus l’horloge.
- 173 tests et syntaxe réussis, analyse de secrets sans détection. Contrôles avec lecture simulée à 1280 × 800, sans musique, avec citation longue, 1280 × 600, 375 × 667 et 320 × 740 : absence de chevauchement et de débordement horizontal ; mouvement réduit conservé. Sur petit écran, lecteur après la citation dans la zone défilante.

- v0.25.1 installée sur le cadre en Wi-Fi, empreintes vérifiées ; onglet existant actualisé, plein écran et veille réelle contrôlés. Lecture musicale testée en simulation uniquement, aucun morceau lancé sur les appareils.


## v0.26.0 — Télécommande, catégories et commandes

- Syntaxe, 179 tests et analyse de secrets sans détection. Nouvelles vérifications : durées 3900/6900 secondes, filtres réels projet/priorité, identité des minuteurs après réutilisation d’un numéro, transfert de capture tactile, état publié avant le résultat mobile et lecture HA précoce avec repli conservé.
- Navigateur isolé 375 × 812 / 320 × 740 : Domotique initiale, Notes en dernier, filtres, minuteurs actifs en tête, glissement et corbeille puis lancement Sèche-linge confirmés sur un service simulé ; aucun appareil réel commandé. Icône Apple exportée et contrôlée visuellement.
- Veille avec musique simulée, citation longue ou absence de musique à 1280 × 800, 1280 × 600, 375 × 667 et 320 × 740 : lecteur en haut à gauche, citation dessous, aucune erreur JS ni débordement horizontal, mouvement réduit conservé.
- Ancienne adresse SSH du cadre indisponible lors du contrôle ; aucune installation matérielle de cette version encore attestée. Les délais physiques des lampes et l’installation de l’icône sur iPhone restent à confirmer.


## v0.26.1 — Carillon de notification

- Syntaxe et 179 tests réussis : reprise du contexte audio, volume renforcé, durée bornée, libération des nœuds, absence de superposition et nouvelle alerte ultérieure.
- Son réellement rendu par OfflineAudioContext dans Chrome isolé : crête 0,516 / 1, fin à 1,87 s. Aucun son joué sur les appareils pour ce contrôle ; le volume perçu dépend du haut-parleur et du volume système.
- SSH du cadre encore refusé : aucun déploiement matériel ni changement de volume Android attesté pour cette version.

### Installation physique de v0.26.1

- Cadre retrouvé par le serveur ADB USB existant ; identité root/sun8i/Android 6.0.1/ARMv7/build 20260529/1280 × 800 vérifiée. Nouvelle adresse Wi-Fi reliée à la même clé SSH préalablement approuvée ; configuration privée actualisée hors Git.
- Déploiement v0.26.1 terminé : empreintes de tous les fichiers et manifeste HTTP validés. Onglet Firefox existant actualisé, unique onglet constaté ; accueil réellement revenu à 1280 × 800 en plein écran après le test.
- Volume média Android relevé à 5 sur 8, réglé explicitement à 6 et relu à 6. Canal de notification conservé à son niveau initial. Bouton Tester le son activé, message « Alerte sonore en cours. » constaté ; écoute perçue en attente du retour utilisateur. Aucun minuteur existant supprimé ou relancé.
- Télécommande accessible en HTTP 200 après installation. Aucun redémarrage ni changement des identifiants de compte.
