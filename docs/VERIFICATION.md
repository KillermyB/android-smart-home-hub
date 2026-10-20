# Vérification

## v0.12.0 — Agendas importés et Todoist direct

- `npm run check` et 71 tests réussis : séparation achats/tâches (projet choisi, projets course/courses et sous-projets), pagination API, récurrences/exclusions/exceptions, DST, journées entières et événements de nuit, déchiffrement, expiration et altération des transferts.
- Aperçu réel à 1280 × 800 et contrôle géométrique à 320 px : formulaires, connexion et liste des cinq agendas sans débordement horizontal. API Todoist réelle : projet « course » créé, rayons créés, liste des courses vide et 18 tâches du jour/en retard dans À faire ; aucun élément utilisateur ajouté comme test.
- Exports réels récupérés depuis Google Agenda Myrak et le lien Outlook complet préexistant, plus les trois liens iCloud fournis. Aucun partage modifié. Les sources iCloud comptaient 127, 0 et 5 VEVENT ; Google 1 et Outlook 5. Dans la fenêtre locale −60/+365 jours : 11, 0, 2, 1 et 4 occurrences. Ce sont des imports datés, pas une synchronisation automatique.
- GitHub authentifié confirme des contributions privées absentes de la recherche publique. Un relevé de 28 jours UTC a été importé avec le libellé « contributions » ; aucun jeton GitHub ni nom de dépôt privé transféré. Le relevé reste explicitement manuel.
- Consentement explicite reçu pour mémoriser Todoist sur le Mac et le cadre. Transfert AES-256-GCM, code séparé et expiration 30 minutes ; fichiers privés hors dépôt. Contrôle exact des liens privés et du jeton Todoist : aucune occurrence dans les fichiers du projet.
- Identité physique recontrôlée : sun8i, Android 6.0.1, ARMv7, 1280 × 800. v0.12.0 installée par Wi-Fi avec empreintes et HTTP vérifiés ; onglet existant actualisé, Spotify réel conservé. L’USB puis le SSH sont devenus indisponibles avant l’import sur le cadre : association matérielle en attente de reconnexion, distincte de l’installation des fichiers.
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
