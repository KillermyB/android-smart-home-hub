# Liste de reprise

## Titres Todoist v0.15.2

- [x] Liens Markdown affichés avec leur libellé ; titres limités à deux lignes pour éviter de recouvrir une autre tâche.
- [x] Bouton de détail pour les textes longs, contenu complet et liens HTTP(S) sécurisés ; aucune tâche réelle modifiée pendant les contrôles.
- [x] 82 tests, contrôle local du détail et conservation de la liste / position de défilement.

## Ajustements cadre v0.15.1

- [x] Météo contenue dans sa tuile avec la barre Firefox ouverte ; repas longs sur deux lignes sans masquer les détails.
- [x] Graisses Inter 400/500/600/700 statiques, auto-hébergées pour le rendu sur l’ancien Android.

## Interface et météo v0.15.0

- [x] Inter locale, surfaces sombres neutres et accents orange ; cinq entrées dans le menu, Domotique avec robot et icône veille distincte.
- [x] Horloge épurée, date en haut, salutation et phrase selon six plages horaires Zurich, mise à jour sans rechargement.
- [x] États inactifs musique / repas modernisés, marque Spotify blanche sur dégradé orange, contributions en nuances orange.
- [x] Tâches sur toute la largeur : 18 éléments courts visibles en deux colonnes à 1280 × 800 ; courses toujours exclues.
- [x] Défilement du document supprimé ; seuls le contenu débordant, les listes et les grilles dédiées défilent.
- [x] Détail météo réel : ressenti, vent, humidité, pluie, soleil, UV, sept jours et 24 heures, repli sur le relevé précédent en cas d’erreur.
- [x] 246 citations sourcées de 16 auteurs, cycle mélangé sans répétition, historique précédent/suivant et mémoire des dernières lectures.

## Widgets et configuration v0.14.0

- [x] Musique : appareil au-dessus de la grande pochette, titre de service retiré, barre blanche de progression écoulée.
- [x] Agenda compact : pistes orange Perso & Travail / bleu Myrak, horaires de début et fin lisibles, lien vers le calendrier complet.
- [x] Minuteur dans l’en-tête, également dans le lecteur focus, sans superposition sur les étapes cuisine.
- [x] Bouton Domotique visible et commandes media_player / Sonos selon les capacités annoncées.
- [x] Qualité de l’air européenne et UV via Open-Meteo / CAMS ENSEMBLE, cache indépendant de la météo.
- [x] GitHub : identité compacte, total, grille et jours actifs, sans titre de service redondant.
- [x] Imports ICS prioritaires, remplacement sans doublon ; option Google GIS directe, sélection et copie datée, aucun secret d’application.
- [ ] Autoriser Google avec le Client ID Web de l’utilisateur ; l’accès temporaire nécessite une nouvelle action après expiration.
- [ ] Connecter l’instance Home Assistant de l’utilisateur et tester ses vrais appareils.

## Calendrier v0.13.0

- [x] Un seul filtre orange Perso & Travail, Myrak bleu conservé ; sources originales gardées dans les détails.
- [x] Vues Jour et 3 jours sur grille horaire, journées entières séparées, chevauchements en colonnes et ligne de l’heure actuelle.
- [x] Cartes de rendez-vous cliquables, horaires lisibles, détails et accès à leur journée.
- [x] 74 tests et contrôles navigateur 1280 × 800 / 320 px, clair/sombre, filtre commun, détails et défilement interne sans débordement.

## Connexions autonomes v0.12.0

- [x] Import ICS local, récurrences/exceptions, fuseaux et journées entières ; liste des agendas et retrait de leur copie Hub.
- [x] Courses et tâches Todoist séparées, connexion directe mémorisable et transfert chiffré à durée limitée.
- [x] Diagnostic GitHub : recherche publique distincte des contributions privées ; relevé agrégé importable, sans clé ni noms de dépôts privés.
- [x] Corriger la liste des modules servis par Node, y compris les modules musique ajoutés aux versions précédentes.
- [ ] Mettre à jour manuellement les relevés calendriers/GitHub après modification à la source ; aucun serveur de synchronisation ajouté.


## Accueil et veille v0.11.0

- [x] Ville retirée de l’accueil, degrés agrandis et flèches des tuiles retirées ; actions natives conservées pour le clavier, clic sur chaque contenu vérifié.
- [x] Citations plus larges ; jour avec majuscule, météo compacte et prochain rendez-vous visible côte à côte, selon les calendriers et filtres réels.
- [x] Contour blanc du temps restant Spotify, actualisé sans reconstruire la tuile ; arrêt du suivi en veille ou onglet masqué.
- [x] Fond du lecteur dérivé d’une vignette de pochette de 24 × 24 pixels, une analyse par image et cache limité ; repli neutre sans image exploitable.
- [x] 64 tests réussis et vues 1280 × 800 / 320 px vérifiées.

## Focus musique v0.10.0

- [x] Focus allégé, pochette permanente et paroles disponibles en dessous ; détails de connexion déplacés vers les réglages.
- [x] Home : découverte Spotify Connect, choix réel de la sono et volume selon les capacités, sans sélection implicite d’un autre appareil.
- [x] 60 tests réussis ; focus et sortie vérifiés à 1280 × 800 et 320 px.
- [ ] Confirmer le son et le volume sur la sono physique de l’utilisateur ; le code et les réponses synthétiques ne prouvent pas ce retour matériel.

## Connexion Spotify durable v0.9.0

- [x] Mémorisation explicite dans le navigateur et renouvellement via l’API Spotify ; la déconnexion efface session et stockage persistant.
- [x] Association entre appareils par fichier AES-GCM et code séparé de 256 bits, limitée à 10 minutes ; aucune clé de déchiffrement dans le fichier.
- [x] 57 tests réussis, dont reprise avec un nouveau stockage de session, renouvellement, déconnexion, échec de stockage sans perte de session, chiffrement, code erroné, fichier modifié et expiration.
- [x] Écrans de mémorisation et d’association vérifiés à 1280 × 800 et 320 px, sans débordement.
- [x] Association réelle approuvée et effectuée ; connexion et vrai morceau retrouvés après fermeture/réouverture de Firefox, avec un seul onglet. Fichier chiffré et code temporaires supprimés.

Hub reste une application web ; le portage natif a été écarté à la demande de l’utilisateur. Aucun launcher ni firmware remplacé.

## Usage quotidien et configuration v0.8.1

- [x] Citations de veille en sans-sérif, largeur de lecture limitée, auteur et œuvre séparés, taille adaptée aux textes longs et aux écrans étroits.
- [x] Corps des tuiles cliquable, commandes internes indépendantes, détails secondaires agrandis et focus clavier conservé.
- [x] Migration hors démonstration sans suppression de données ; météo réelle de Moudon chargée sans clé.
- [x] Déploiements/reprises sans ouverture automatique d’onglets ; trois doublons fermés sur le cadre, un onglet conservé.
- [x] Retours Spotify ajoutés après autorisation, connexion réelle du site dans Chrome, morceau et paroles synchronisées reçus. Client ID public prérempli ; aucun secret dans Git.
- [x] Corriger le retour de veille avec données reçues pendant l’inactivité et les accusés de commande Spotify non JSON ; 53 tests réussis.
- [x] Associer Spotify au navigateur du cadre sans nouvelle saisie du mot de passe ; connexion conservée après reprise du navigateur.
- [x] Implémenter Todoist direct pour courses et tâches, avec exclusion du projet de courses et de ses sous-projets. Projet « course » créé et connexion réelle vérifiée sur le Mac ; association du cadre réalisée, 18 tâches retrouvées après fermeture/réouverture de Firefox.
- [x] Importer les exports Google Myrak, Outlook Perso et les trois agendas iCloud dans Hub sur le Mac et sur le cadre, sans serveur personnel.
- [ ] Synchronisation automatique des calendriers : les imports ICS sont des instantanés ; les fournisseurs testés ne permettent pas une lecture CORS directe. Aucune publication de nouveau lien ni proxy tiers.
- [ ] Connecter l’instance Home Assistant lorsqu’elle sera prête.

Procédure et limites : [CONFIGURATION.md](CONFIGURATION.md).

## Fluidité v0.7.1

- [x] Réutiliser l’en-tête et le conteneur principal ; fermeture des fenêtres sans reconstruction de la page, sauf données reçues en arrière-plan.
- [x] Mettre à jour les favoris sur place et filtrer uniquement les résultats des recettes, en conservant la saisie, son curseur et le clavier.
- [x] Réutiliser les formats de date et illustrations, limiter les animations aux petits éléments et éviter la peinture des recettes hors écran lorsque le navigateur le permet.
- [x] Vérifier la syntaxe, 47 tests, les vues 1280 × 800 et 320 px ; comparer le traitement JavaScript avant/après sur le vrai cadre, avec des données isolées et sans compte connecté.
- [x] Installer v0.7.1 par Wi-Fi avec vérification des empreintes ; conserver les données locales et les grandes commandes de v0.7.0.
- [ ] Mesurer la fluidité lors d’une utilisation prolongée avec les vrais comptes connectés ; le comparatif ponctuel ne mesure pas le délai tactile complet ni les images par seconde.

## Accès physique — 20 octobre 2026

- [x] USB et ADB root confirmés depuis le Mac : sun8i, ARMv7, Android 6.0.1, build 20260529, 1280 × 800.
- [x] WebView stock identifié : 44.0.2403.119.
- [x] Sauvegardes privées données/boot/bootloader vérifiées avant installation de Firefox 143.0.4 ARMv7 et SimpleSSHD 27 ; aucun flash système.
- [x] Hub v0.7.0 copié sur le cadre avec empreintes vérifiées et service local lié uniquement à 127.0.0.1:4173 ; affichage réel et plein écran contrôlés.
- [x] Tactile Cuisine → recette → Maison confirmé par l’utilisateur ; textes et commandes agrandis ensuite selon son retour.
- [x] Fuseau Europe/Zurich, heure automatique, fuseau manuel et maintien allumé sur alimentation appliqués avec accord explicite.
- [x] SSH root par clé sur 2222 testé en Wi-Fi depuis le Mac ; clé privée et clé hôte épinglée hors Git, redirections interdites, autre source refusée par le shell.
- [x] Redémarrage Android réel : USB/Wi-Fi, réglages heure/écran et fichiers persistants contrôlés ; SSH relancé par USB puis Hub par Wi-Fi.
- [x] Démarrage automatique SSH/Hub le 21 octobre : ajout réversible au script système existant après accord explicite, original sauvegardé, `/system` remis en lecture seule. Dernier redémarrage réel : serveur loopback, SSH par clé, pare-feu limité et Hub dans un seul onglet Firefox revenus sans relance manuelle. Voir `DEMARRAGE-RESEAU.md`.
- [ ] Plein écran HTML automatique et vraie coupure électrique : le plein écran est actuellement réactivé par son bouton après le démarrage ; les tests réalisés sont des redémarrages Android.
- [ ] IP stable : réservation DHCP du cadre à faire dans la box, après connexion du propriétaire et vérification de la stabilité de la MAC. Aucun changement réseau appliqué le 21 octobre.

## Livraison v0.6.0

- [x] Contrôles locaux et visuels consignés dans `VERIFICATION.md` : syntaxe, 40 tests et vues cadre/étroites.
- [x] Créer le dépôt privé [KillermyB/smart-hub](https://github.com/KillermyB/smart-hub).
- [x] Publier le code dans le dépôt privé, branche `main`, version `v0.6.0` ; vérifier le SHA distant lors de la livraison.
- [x] Contrôler les fichiers et l’historique à publier : aucun `.env`, jeton, `.data`, export personnel, diagnostic ou sauvegarde matérielle.
- [x] Préparer le guide Windows/cadre : `INSTALLATION-CADRE.md`, lancement sans dépendance et site HTTPS conseillé sans tour permanente.
- [ ] Vérifier le clone du dépôt privé depuis la tour une fois la publication confirmée.
- [x] Finaliser et vérifier les ajustements de dégradé, les heures des rendez-vous, les marges et les commandes du lecteur musical.
- [x] Finaliser et vérifier les trois repères de calendrier Perso/Myrak/Travail, avec le bleu Myrak choisi ; les comptes réels restent à connecter séparément.
- [x] Valider avec des réponses synthétiques les paroles LRCLIB automatiques en focus, leur option de désactivation et le retour à la pochette, avec les états synchronisé, texte simple, instrumental, introuvable et erreur. La licence MIT du logiciel LRCLIB ne couvre pas les paroles retournées ; aucun texte n’est embarqué dans le dépôt.

## Domotique v0.6.0

- [x] Préparer la page Maison connectée, accessible depuis Réglages sans changer les tuiles de l’accueil.
- [x] Connexion directe à l’API WebSocket Home Assistant : jeton en mémoire uniquement, URL seule mémorisable avec option explicite, déconnexion et erreurs signalées.
- [x] Afficher seulement les vraies entités lumières/interrupteurs/robots/scènes ; commandes selon capacités, états indisponibles désactivés, aucune mise à jour d’état optimiste.
- [x] Documenter les prérequis, HTTPS, limites et procédure dans `DOMOTIQUE.md`.
- [x] Vérifier les vues 320 px/1280 × 800 et les états formulaire/erreur/appareils/commandes/déconnexion avec client simulé ; pertes réseau couvertes par les tests du protocole. Le tactile physique reste à tester.
- [ ] Connecter l’instance Home Assistant de l’utilisateur ; vérifier les droits et états, puis une lumière et un robot réellement identifiés, avec retour physique.
- [ ] Vérifier les certificats, permissions réseau local et reconnexion sur le vrai cadre. Hub. n’installe pas de serveur Home Assistant.

Les recettes personnelles, favoris, plats retirés, courses, notes/photos, citations, brief, minuteur et GitHub doivent rester disponibles. Leur stockage local ne doit pas être réinitialisé par cette livraison.

## Carte horloge v0.5.3

- [x] Dégradé léger bleu ciel, crème et abricot inspiré de la référence ; carte claire conservée dans les deux thèmes, texte foncé lisible.

## Veille v0.5.2

- [x] Météo sous l’heure : pictogramme, température, ville et heure du relevé disponibles. Exemple signalé si activé ; état à configurer sinon. Citations et réveil conservés.

## Accueil v0.5.1

- [x] Tuile Courses retirée de l’accueil ; agenda 24 h élargi dans la rangée du bas, priorités sous la météo. Courses accessibles depuis la cuisine et les réglages.

## Composition et services v0.5.0

- [x] Nouvel accueil : horloge sur une moitié, météo et agenda 24 h à droite, Courses/Priorités/Repas/Spotify en bas ; GitHub, citations et outils existants accessibles.
- [x] Palette graphite/orange/bleu et dégradés discrets ; transitions courtes et préférence sans mouvement conservées.
- [x] Courses locales par rayons, modification et articles cochés en bas ; achats identiques actifs dédupliqués lors de l’ajout d’une recette.
- [x] Client Todoist direct : projets, sections, achats, modification, validation/réouverture et historique sept jours. Aucun envoi automatique de la liste locale.
- [x] Spotify direct PKCE : configuration Client ID, callback/état, renouvellement, lecture de l’état et commandes. Widget et page immersive avec états non connectés explicites.
- [ ] Autoriser et vérifier les vrais comptes Todoist/Spotify ; aucune authentification réelle n’a été réalisée.
- [ ] Tester les sessions et nouveaux contrôles sur le navigateur du vrai cadre.

## Outils quotidiens v0.4.0

- [x] Brief : prochain rendez-vous en cours/à venir, trois tâches prioritaires, météo et repas prévu ; ouverture matinale facultative.
- [x] Minuteur global : pause, reprise, +1 minute, persistance et signal visuel, sans sonnerie système garantie.
- [x] Compagnon sans serveur : notes, photos, liens et recettes dans IndexedDB ; export/import manuel par fichier, sans doublon ni écrasement.
- [x] Liens de recettes dans un nouvel onglet, avec adresse HTTP(S) validée. Firefox est désormais installé sur le cadre ; ouverture et retour des onglets restent à vérifier physiquement.
- [x] 20 recettes faciles à petit budget sans porc, portant le carnet initial à 32 ; liens des sources et versions simplifiées indiqués.
- [x] Cœur et retrait visibles sur les cartes ; favoris et plats retirés persistants, restauration possible. Accueil et sélection du repas excluent les plats retirés.
- [x] Citations en DM Sans, sans sérif.
- [ ] Vérifier le sélecteur de fichier, téléchargements et ouverture/retour des onglets sur le vrai cadre et le téléphone.

## En-tête v0.3.2

- [x] Nom et logo retirés de l’en-tête à la demande de l’utilisateur.

## Lettrage v0.3.1

- [x] Police du mot Hub. remplacée par Geist SemiBold, tracés plus compacts, point iris conservé. Licence du paquet officiel `geist` jointe.

## Hub. v0.3.0

- [x] Nouveau nom Hub., lettrage minimaliste Syne en tracés et point iris ; favicon assorti. Les données locales existantes restent dans le même espace de stockage.
- [x] 200 citations uniques, 7 auteurs, édition et source conservées. Textes courts issus notamment des éditions du domaine public sur Wikisource.
- [x] Bibliothèque avec recherche, filtre par auteur, pagination de 12 entrées, lecture complète et lien source.
- [x] Rotation en veille configurable : quotidienne, 1, 5 ou 15 minutes. Auteurs alternés, sans tirages aléatoires répétés.
- [x] Profil GitHub confirmé : KillermyB ; accès direct depuis le détail, données publiques uniquement.

## Identité et icônes v0.2.2

- [x] Base Outfit (graisse 850) en tracés, ligatures S–M et H–U conservées et épaissies.
- [x] Pictogrammes officiels Lucide 1.60.0 : réglages, navigation, météo et actions. SVG locaux, sans dépendance au chargement.
- [x] Licences Outfit OFL et Lucide ISC conservées dans `dist/licenses/`.

## Identité v0.2.1

- [x] Symbole organique à jonctions régulières et lettrage SMART HUB avec ligatures S–M, M–A et H–U en SVG, favicon assorti.
- [x] Accent iris pour les actions, sélections et focus ; palette graphite conservée la nuit.
- [x] Signature vectorielle réutilisable : `dist/logo.svg`.

## Ajouts v0.2.0

- [x] Surfaces graphite en mode sombre, dégradés légers bleus, mauves et abricot.
- [x] Tuile GitHub publique pour killermyb : 28 jours, cache, détail et états d’erreur.
- [x] Bibliothèque de 12 recettes, recherche par ingrédient et catégories.
- [x] Favoris persistants et courses adaptées aux portions, sans doublons pour une même recette et quantité.
- [ ] GitHub privé : ajouter une autorisation côté serveur si l’utilisateur souhaite inclure ses dépôts privés. Aucun jeton GitHub n’est demandé ni enregistré dans le navigateur.

## Sur la tour

- [ ] Installer Node 22.9+ et lancer `npm start` ; vérifier `npm run check` et `npm test`.
- [x] Connexion USB et identité réelle confirmées sur le Mac ; répéter les lectures si reprise sur une autre machine.
- [x] Sauvegardes privées du premier appareil vérifiées sur le Mac ; ne pas les publier.
- [x] Firefox 143.0.4 installé et Hub affiché sur le vrai panneau ; choix du kiosk permanent encore à valider.
- [ ] Vérifier le retour aux réglages Android avec un seul doigt et après redémarrage.
- [ ] Stabiliser l’accès de maintenance et l’adresse du cadre avec une méthode validée pour ce matériel.

## Comptes et données

- [ ] Autoriser et vérifier le calendrier **Perso** avec le bon compte.
- [ ] Autoriser et vérifier séparément **Myrak** ; confirmer le compte, les règles de l’organisation et les calendriers partagés nécessaires.
- [ ] Autoriser et vérifier séparément **Travail** ; confirmer le fournisseur et le compte attendus. Les connexions Outlook/Google existantes ne sont pas validées par leur simple renommage.
- [ ] Renseigner et vérifier la clé Todoist ; tester une tâche de contrôle explicitement identifiée comme telle.
- [ ] Choisir la vraie ville météo ; ajouter l’actualisation périodique et une indication d’ancienneté complète.
- [ ] Désactiver les exemples une fois les connexions validées.
- [ ] Ajouter déconnexion/révocation des comptes et export/import des données locales avant usage permanent.

## Produit à approfondir

- [ ] Agenda : plage synchronisée explicite, événements sur plusieurs jours, vue trois jours si souhaitée.
- [ ] Cuisine : extraction automatique depuis une URL et sauvegarde complète du carnet (favoris, plats retirés, courses). Les recettes individuelles se transfèrent déjà par fichier ; leurs quantités importées restent textuelles.
- [x] Ajouter une sélection de citations plus large, en vérifiant chaque attribution et la source (200 entrées en v0.3.0).
- [x] Signal visuel de fin du minuteur contrôlé en navigateur ; sonnerie et veille Android à vérifier sur le cadre.
- [ ] Choisir le navigateur permanent sur le cadre. Demande actuelle : aucun serveur pour le compagnon ; transfert manuel par fichier. Les calendriers/Todoist du serveur Node restent une option distincte à revoir.
- [ ] Durcir le transport réseau et la gestion des appareils avant un usage durable au-delà du réseau domestique de confiance.

## Validation physique

- [ ] Mesurer la fluidité et l’usage CPU/mémoire sur l’A33, en particulier le fondu des thèmes et les transitions.
- [ ] Tester 1280 × 800 réel, clavier tactile, veille/réveil, perte Wi-Fi, coupure électrique, heure et fuseau après redémarrage.
- [ ] Vérifier l’autostart du kiosk, la disponibilité des certificats HTTPS et le maintien de l’écran pendant la cuisine.

La réussite des tests en navigateur sur le Mac ne valide aucune de ces étapes physiques.

## Interface épurée v0.16.0

- [x] Supprimer le pied de page, alléger Spotify au repos/en lecture et la tuile Cuisine, adoucir l’horloge avec une touche orange en haut et du bleu clair en bas.
- [x] Palette GitHub bleu clair → orange selon l’activité quotidienne ; mise à jour de la tuile dès la fermeture de l’import.
- [x] Ajouter Toutes / Aujourd’hui à Todoist : futures et sans date accessibles, courses et sous-projets exclus ; trois colonnes à 1280 px, 27 tâches visibles et défilement interne vérifiés avec 36 tâches locales de contrôle.
- [x] Jeu météo rempli Meteocons statique, local, sous licence MIT, utilisé sur l’accueil, le détail et la veille ; 85 tests passés.
- [x] Transférer et vérifier v0.16.0 sur le cadre par SSH Wi-Fi, sans nouvelle ouverture d’onglet ni suppression des données.


## Maison et carte musicale v0.17.0

- [x] Pochette intégrée à la carte de lecture, dégradé sombre de lisibilité, contour blanc indiquant la progression et symbole pause plein.
- [x] Home Assistant : mémorisation explicitement choisie, reconnexion au rechargement et après coupure réseau sans répétition de commande ; transfert chiffré vers le cadre préparé.
- [x] Connexion et rechargement vérifiés sur le Mac avec les vrais états. Nouvelle vue Maison dans Home Assistant ; ScreenK conservé et sauvegardé localement.
- [x] QR Smart Life / Tuya validé par l’utilisateur : 11 appareils, 30 entités, dont 11 lumières/prises et 9 scènes. Plusieurs lumières sont signalées indisponibles par Home Assistant ; vérifier leur alimentation et leur état dans Smart Life.
- [ ] Ajouter les robots dans Home Assistant suivant leur marque et leur application.

## Correctifs v0.17.2

- [x] Reculer le contour musical pour éviter son découpage dans les angles inférieurs.
- [x] Autoriser les scènes dont la date de dernière activation est encore inconnue ; laisser les appareils indisponibles désactivés.
- [x] Installer les correctifs sur le cadre par Wi-Fi ; connexion HA mémorisée et appareils réels affichés.
- [ ] Vérifier physiquement une commande de lumière et un scénario avec l’utilisateur ; aucune commande réelle n’a été lancée pendant ces contrôles.

## Domotique compacte v0.18.0

- [x] Scènes du salon en premier, puis lampes et prises, médias et robots ; réglages des appareils repliés.
- [x] Tuiles d’éclairage réduites à 78 px à 1280 px, effet ambré allumé et états distincts éteint / indisponible ; bouton Accueil de la page supprimé.
- [x] Commandes TV marche/arrêt limitées aux capacités déclarées ; 92 tests passent sans commande domotique réelle.
- [x] Installer Tuya Local 2026.9.2 dans Home Assistant Container, sauvegarde privée préalable, compilation dans le conteneur et reprise HTTP vérifiées. Tuya cloud conservé.
- [x] Association Smart Life validée ; Bureau, Fado, VARMBLIXT et SOLVINDEN connectés en local en protocole 3.3 ; noms/identifiants/pièces conservés, doublons cloud désactivés et sauvegardés.
- [x] Bureau : marche/arrêt et restauration des réglages vérifiés par retours locaux. Fado/prises : commandes de maintien allumé et réglages conservés ; quatre connexions actives après rechargement.
- [ ] Rétablir les sept lampes hors ligne avant de tenter leur migration ; vérifier séparément la stabilité longue durée et les changements DHCP. Aucune coupure Internet n’a été testée.
- [ ] Diagnostiquer séparément Champignon et Japonaise, impossibles à réassocier selon l’utilisateur ; ne pas déduire un défaut de toutes les lampes du bref délai Smart Life à l’ouverture.

## Scènes simplifiées v0.18.1

- [x] Masquer les raccourcis génériques Turn On / Turn Off et leurs copies numérotées, sans supprimer les scènes d’origine ; conserver les ambiances nommées.
- [x] Vérification syntaxique et 93 tests réussis, dont le filtrage des raccourcis et la conservation des scènes nommées.
- [x] v0.18.1 publiée sur GitHub et Sites privé, installée par Wi-Fi ; cinq scènes affichées sur le vrai cadre à 1280 × 800.

## Dreame v0.18.2

- [x] Deux robots existants vérifiés par leurs états réels ; noms dupliqués corrigés dans Home Assistant.
- [x] Robots placés avant les médias, batterie/état/mode/alertes visibles et commandes liées aux capacités ; 94 tests réussis.
- [ ] Vérifier les alertes réservoir d’eau vide / retirer la serpillière sur les appareils, puis faire un essai physique des commandes. Aucun nettoyage ni changement de programme effectué pendant la configuration.

## Place et notifications v0.18.3

- [x] Barre de connexion retirée en mode connecté ; retours de commande en notification temporaire en bas à droite, erreurs distinctes, déconnexion déplacée dans Réglages.
- [x] TV/Sonos plus compacts avec volume sur la ligne des commandes quand la largeur le permet ; 95 tests réussis, dont les notifications et les réponses tardives d’anciennes connexions.

## Finitions v0.18.4

- [x] Interrupteur actif assorti à l’orange du menu ; notification blanche avec petite pastille orange, texte sombre et ombre légère, y compris en thème sombre.
- [x] Les confirmations et erreurs gardent leurs durées et leur annonce accessible. Le bandeau gris d’aide plein écran appartient à Firefox et n’est pas une notification Hub.


## Luminosité native et contour musical v0.19.1

- [x] Réglages → Luminosité de l’écran sur le cadre : curseur, boutons ± et raccourcis 25 / 50 / 75 / 100 %, minimum 10 % pour garder l’écran utilisable.
- [x] Niveau Android réel, mode automatique désactivé, confirmation relue avant affichage ; valeur sauvegardée hors du navigateur et script de restauration au démarrage. Aucun filtre d’opacité utilisé.
- [x] Commande limitée à la boucle locale, origine / référent vérifiés, JSON et clé locale par cadre requis, aucune commande shell fournie par la page. Pas de clé dans Git ni dans le site hébergé.
- [x] Script de démarrage géré sauvegardé puis modifié uniquement dans `/data/local/hub`, sans nouvelle écriture `/system` ; syntaxe Android et restauration manuelle contrôlées.
- [x] Contour musical en chemin SVG fermé, coordonnées physiques et longueur réelle ; fermeture complète à 100 %, aucun point à 0 %, adaptation à la taille par ResizeObserver.
- [x] 98 tests, syntaxe, contour à huit progressions, réglage à 1280 × 800 sur le cadre et 320 px en navigateur isolé.
- [ ] Nouvelle coupure électrique / redémarrage physique avec ce réglage : non déclenché pendant l’utilisation en cours. La restauration au démarrage est installée ; seul son lancement manuel a été revérifié dans cette livraison.


## Fluidité et finitions v0.19.2

- [x] Progression musicale orange en clair / blanche en sombre ; extérieur du trait aligné sur les quatre bords et les arrondis, sans bande de fond entre le contour et la carte.
- [x] Légende GitHub « − / dégradé / + », mêmes couleurs et seuils journaliers que la grille : 0, 1–2, 3–5, 6–9, 10+. Le détail conserve date du relevé / limites / actualisation.
- [x] Trois agents : audits performance, mouvement et non-régression, puis relecture des corrections. Les contrôles utilisent des sessions synthétiques ; aucune commande aux appareils de la maison.
- [x] Actualisations musique / courses / tâches limitées aux vues concernées ; pas de reconstruction sur relevé inchangé ; seules les tuiles musique/priorités changent sur l’accueil.
- [x] Géométrie SVG gardée au montage/redimensionnement. Mesure navigateur : 60 progressions stables → 0 nouvelle lecture de dimensions, 0 style calculé, 0 réécriture du chemin. Mesure de travail, pas une promesse de fréquence d’images.
- [x] Grille domotique conservée pour événements sans changement affiché ; focus du volume conservé sans reprise après navigation volontaire.
- [x] Lecteur plein écran réparé : fonction volume manquante, capacités et volume inconnu gérés ; ancien refresh Spotify ne peut recréer une connexion effacée ou remplacer un nouveau compte.
- [x] Brouillon Todoist et sélection conservés sur actualisation, soumission en vol protégée, texte envoyé seul effacé ; heure Courses actualisée séparément.
- [x] Entrée modale 200 ms, clavier/mouvement réduit sans déplacement ni fondu de coche ; thème du cadre sans capture plein écran. Focus et contrôles masqués des modales vérifiés au clavier.
- [x] 113 tests, syntaxe, parcours navigateur 1280 × 800 / 320 px, clair/sombre, cycle Spotify inchangé avec conservation des mêmes nœuds, et absence de débordement horizontal.
- [ ] Endurance longue durée / cadence tactile physique et FPS sur le cadre : non mesurés par les tests de code ou le navigateur isolé.

## Contour sans liseré v0.19.3

- [x] Suppression du fin halo sombre en clair : débord de 1 px sous le découpage unique de la carte, largeur visible de 3 px conservée.
- [x] Comparaison en gros plan avant/après, densité 2 et coordonnées fractionnaires ; clair/sombre conservés, 113 tests réussis.
- [x] Version installée et fichiers vérifiés sur le cadre par Wi-Fi, sans USB ni modification des connexions.


## v0.20.0 — minuteurs, veille et maintenance nocturne

- [x] Trois minuteurs indépendants et numérotés, noms/tags libres, tag d’étape depuis une recette, pause/reprise/+1 minute/retrait, reprise après rechargement et migration de l’ancien minuteur.
- [x] Alerte sonore Web Audio avec test et désactivation ; signal visuel nommé et réveil de la veille à échéance. L’audibilité dépend du volume et de l’autorisation audio du navigateur.
- [x] Spotify au repos sans titre « Musique », symbole intégré ; icônes météo embarquées pour éviter les images absentes.
- [x] Vérification Spotify toutes les 4–5 secondes quand visible, requêtes indépendantes de Todoist, suspension en arrière-plan et respect du délai de limitation API.
- [x] Musique en veille sous la météo, titre/artiste/pochette/appareil, accès au lecteur ; citations renouvelées chaque minute, sans reconstruire la musique.
- [x] Détail GitHub sur 28 jours, sélection d’un jour, jours actifs/pic/meilleure série et jusqu’à 50 messages publics chargés ; relevés privés conservés agrégés.
- [x] Domotique : attente du retour d’état, lecture de contrôle si nécessaire, double appui bloqué pendant l’envoi. Une acceptation sans état confirmé est présentée distinctement ; aucune répétition automatique de commande.
- [x] Planificateur natif réversible à 4 h 30 (fenêtre jusqu’à 5 h 29), une fois par date, après au moins 15 minutes d’activité et report si un minuteur est actif ; contrôle du serveur local toutes les 30 secondes.
- [x] Aide au plein écran par recherche du bouton accessible exact et toucher natif ; aucune coordonnée aveugle, aucun nouvel onglet et aucune écriture système supplémentaire.
- [x] 124 tests de code et parcours navigateur synthétique 1280/768/320 px ; rotation réelle d’une minute vérifiée avec conservation du nœud musique.
- [x] Alarme sonore entendue sur le cadre, confirmée par le propriétaire.
- [ ] Réaction physique des télévisions : à confirmer sur les appareils, sans commande domotique envoyée pour les tests.

## v0.20.1 — lecteur compact en veille

- [x] Carte musicale de 360 px maximum, métadonnées regroupées, adaptation à 320 px.
- [x] Contour blanc de progression écoulée, actualisé chaque seconde sans reconstruire la carte ; suspension quand la page est masquée et préférence de mouvement réduit conservée.
- [x] Retour du contour de l’accueil après sortie de veille ; arrêt/reprise du morceau vérifiés avec des données synthétiques.
- [x] 126 tests et contrôle navigateur 1280 × 800 / 320 × 740.


## Quotidien v0.21.0

- [x] Scénario Je pars avec sélection explicite, arrêt ciblé et retours par appareil, sans répétition automatique.
- [x] Nettoyage par pièces Dreame découvertes sur la carte active ; raccourcis vers scripts HA existants si nécessaire.
- [x] File Spotify et lecture d’un titre après confirmation du remplacement possible de la file.
- [x] Planning de repas hebdomadaire et portions conservées dans les recettes.
- [x] Horaires suisses directs, recherche d’arrêt et cache daté ; API publique Moudon et CORS vérifiés.
- [x] Rappel de départ par trajet manuel ou transports publics, conseil pluie avec prévision récente ; Hub doit rester ouvert.
- [x] Notes locales épinglables sur l’accueil et diagnostic des dernières lectures sans afficher de secrets.
- [ ] Choisir les appareils du scénario Je pars et vérifier leurs réactions physiques. Aucun arrêt réel envoyé pendant les tests.
- [ ] Confirmer les pièces de chaque vrai robot et lancer un nettoyage ciblé voulu par le propriétaire.
- [ ] Choisir l’arrêt préféré et préparer les trajets des rendez-vous ; aucune adresse privée inventée.


## Brief fusionné v0.22.0

- [x] Une seule entrée Brief dans l’en-tête ; ancienne route Quotidien conservée comme alias.
- [x] Note maison, trois prochains départs et estimations Lausanne centre / Genève centre ; planning déplacé exclusivement vers Cuisine, Je pars conservé dans Domotique.
- [x] Localisation ponctuelle explicite, point public Moudon de repli, aucune position persistée ; cache et provenance des estimations hors trafic.
- [x] Contrôle navigateur natif clair/sombre, format 1280 × 800 et empilement mobile 375 × 667 ; deux estimations et horaires réels reçus.
- [ ] Position réelle et précision du service de localisation du cadre à confirmer par son propriétaire ; aucune demande GPS déclenchée pendant les tests.


## Télécommande locale v0.23.1

- [x] Interface mobile assortie, thèmes clair/sombre, notes épinglées, état et commandes des lumières/prises, trois minuteurs et tâches Todoist hors courses.
- [x] Pont discret sans navigation/réveil lors d’une action, clé d’association distincte révocable, quatre actions bornées, file FIFO à usage unique et expiration courte. Aucun jeton de compte envoyé au téléphone.
- [x] Surface Wi-Fi optionnelle séparée sur 4180 ; application principale toujours sur 127.0.0.1:4173, lancement et surveillance depuis les scripts existants sans nouvelle écriture système.
- [x] Clavier natif passé de français à français Suisse (QWERTZ), réglages précédents sauvegardés en privé sur le cadre.
- [x] v0.23.1 publiée sur GitHub et Sites, fichiers vérifiés et plein écran confirmé sur le cadre en Wi-Fi. 169 tests réussis.
- [x] Activation persistante du port 4180 autorisée et appliquée ; accès HTTP local et état associé vérifiés. Voir v0.25.0.
- [ ] Association et ergonomie sur le téléphone réel à confirmer par le propriétaire. HTTP local uniquement, pas de chiffrement réseau ; Wi-Fi domestique de confiance requis.
- [ ] Adresse stable toujours à traiter dans le routeur ; rescanner le QR si DHCP change l’IP. Le navigateur Hub doit rester ouvert, y compris en veille Hub. Son du minuteur selon son activation sur le cadre.


## Minuteurs sans saisie v0.23.2

- [x] Champs Nom/Tag/Minutes/Secondes remplacés par six raccourcis nommés et neuf durées prêtes à lancer en un appui ; catégorie affectée automatiquement.
- [x] Même choix sur la télécommande mobile ; protection des trois emplacements, pause/reprise/+1 min et tags d’étapes depuis les recettes conservés.
- [x] 169 tests et lancement Pâtes → Cuisine → 10 min vérifié dans une session navigateur isolée. Activation Wi-Fi de la télécommande toujours en attente de l’accord précédent.


## Télécommande Domotique v0.24.0

- [x] Onglet Lumières remplacé par Domotique : scènes, lampes et prises, robots, Sonos/télévisions, état et contrôles réellement annoncés.
- [x] Volume absolu borné, actions domotiques autorisées explicitement et capacités revérifiées sur le cadre à l’exécution ; pas de service arbitraire, pas de répétition automatique.
- [x] Demandes rattachées à la session du cadre : ancienne demande refusée après interruption, retour d’arrière-plan ou rechargement.
- [x] Scène/volume/piste envoyés distingués d’un état confirmé ; notes, tâches et minuteurs conservés, sans navigation du cadre.
- [x] Écoute Wi-Fi persistante autorisée et activée en v0.25.0.
- [ ] Essai du téléphone physique ; aucune commande à un vrai appareil pendant les vérifications.


## Citations et activation locale v0.25.0

- [x] Lecture des 240 citations : douze extraits sans contexte retirés, huit maximes ambiguës ou en graphie ancienne remplacées, ponctuation et références corrigées. Cas douteux collationnés avec les éditions citées ; aucune réécriture silencieuse des auteurs.
- [x] Dix-huit textes ajoutés : La Fontaine, Hugo, Rimbaud, Baudelaire, Musset, Desbordes-Valmore, Sand et Éluard. Total : 246 citations, 16 auteurs, sources accessibles dans la bibliothèque.
- [x] Télécommande activée avec accord explicite ; sous-réseau du serveur ancien corrigé, contrôle de provenance compatible avec son CGI sans en-tête Origin. Clé invalide, provenance absente ou étrangère refusées ; état associé reçu, sans action aux appareils.
- [ ] Association et ergonomie à confirmer sur le téléphone réel depuis Réglages → Télécommande sur le cadre.

- [x] v0.25.0 installée en Wi-Fi, empreintes des fichiers vérifiées ; onglet existant actualisé et affichage réel en plein écran confirmé. Télécommande toujours active avec un état récent après actualisation.


## v0.25.1 — Veille plus aérée

- [x] Espacement vertical augmenté entre date, heure, météo et citation. Lecteur compact indépendant en bas à droite, contour blanc de progression conservé ; son apparition ne réduit plus l’horloge.
- [x] 173 tests et syntaxe réussis, analyse de secrets sans détection. Contrôles avec lecture simulée à 1280 × 800, sans musique, avec citation longue, 1280 × 600, 375 × 667 et 320 × 740 : absence de chevauchement et de débordement horizontal ; mouvement réduit conservé. Sur petit écran, lecteur après la citation dans la zone défilante.

- [x] v0.25.1 installée et veille réelle vérifiée en plein écran sur le cadre ; lecteur musical contrôlé avec données simulées en navigateur isolé.


## Télécommande et maison v0.26.0

- [x] Domotique ouverte par défaut, puis Minuteurs, À faire, Notes. Icônes SVG et Apple PNG dédiées.
- [x] Lessive 1 h 05 et Sèche-linge 1 h 55 sur cadre/télécommande ; affichage des heures dans les compteurs longs.
- [x] Minuteurs actifs avant les raccourcis, suppression par glissement gauche ou corbeille, identité revérifiée pour ne pas supprimer un minuteur ayant repris le même numéro.
- [x] Projets existants et priorités Todoist filtrables sur les deux interfaces ; courses exclues et aucune catégorie créée dans le compte.
- [x] Lecture de contrôle HA précoce à 300 ms, repli conservé et aucune répétition de commande. Pont à 750 ms quand un téléphone est actif, retour en attente à 500 ms ; état publié avant accusé de résultat. Les délais propres à Tuya/HA restent possibles.
- [x] Musique en haut à gauche de la veille et citations descendues ; contrôle des citations longues sur le format cadre et petits écrans.
- [x] 179 tests et parcours mobile simulé : filtre projet/priorité, marche/arrêt, glissement tactile réel, corbeille et lancement de 1 h 55. Aucune commande aux appareils physiques pendant ces tests.
- [x] Installation du cadre effectuée avec v0.26.1, qui inclut ces améliorations ; version et empreintes vérifiées.
- [ ] Essai physique sur iPhone et intégration de la future télécommande commune ScreenK/Raspberry.


## v0.26.1 — Notification de fin de minuteur

- [x] Double carillon montant répété une fois, attaque plus présente ; gain principal de 0,22 à 0,48 et harmonique légère. Alerte bornée à moins de deux secondes, nettoyage audio et absence de superposition pour les fins simultanées. Option sonore et déverrouillage par interaction conservés.
- [x] Syntaxe et 179 tests réussis. Rendu audio hors ligne réel : crête 0,516, fin à 1,87 s, sans écrêtage numérique.
- [x] v0.26.1 installée sur le cadre après contrôle USB de son identité et vérification de la clé SSH existante sur sa nouvelle adresse Wi-Fi. Empreintes et contenu servi validés ; onglet unique actualisé, accueil plein écran 1280 × 800 constaté.
- [x] Volume média natif augmenté de 5 à 6 sur 8 et relu dans Android ; bouton Tester le son déclenché avec confirmation applicative. Télécommande HTTP 200, minuteurs existants conservés.
- [x] Nouveau carillon et volume 6 sur 8 validés à l’écoute par l’utilisateur.


## v0.26.2 — Accès plein écran dans les réglages

- [x] Bloc Affichage en tête des réglages, bouton orange de 52 px « Remettre en plein écran » ; libellé « Quitter le plein écran » quand il est actif. Raccourci redondant supprimé, commande de secours hors plein écran conservée.
- [x] Syntaxe, 179 tests, contrôle 1280/320 px clair/sombre et vraies actions d’entrée/sortie du plein écran dans un navigateur isolé. Analyse de secrets sans détection.
- [x] v0.26.2 copiée sur le cadre, 83 fichiers et manifeste servis vérifiés. Ancien PID du serveur local réparé après restauration automatique de sécurité ; aucun compte ni minuteur supprimé.

- [x] Nouveau bouton testé sur le cadre : réglages ouverts, bouton touché, fermeture du panneau et accueil plein écran 1280 × 800 sans barre de navigateur constatés.


## v0.26.3 — Lecteur de veille plus étroit

- [x] Largeur réduite de 360 à 240 px, espacements resserrés ; pochette de 44 px, hauteur, emplacement et contour blanc conservés. Titres longs tronqués sans élargir la carte.
- [x] Syntaxe et 179 tests réussis. Navigateur isolé 1280/320 px : largeur 240 px, contour fermé et progressif, titres longs, absence de débordement, disparition au repos et mouvement réduit vérifiés ; aucune commande à un appareil réel. Analyse de secrets sans détection.

- [x] v0.26.3 installée sur le cadre, empreintes et manifeste servis vérifiés ; onglet existant actualisé, veille plein écran et lecteur de 240 px avec vraie lecture musicale constatés.


## v0.26.4 — Relecture des citations

- [x] Les 246 citations relues ; 70 textes retouchés pour les virgules, majuscules et espacements français. Les dix extraits en vers sont adaptés à une lecture continue et signalés dans leur référence. Une graphie ancienne (« Jusques à ») modernisée et signalée.
- [x] Auteurs, ordre du corpus, catégories et liens de source conservés. Contrôle comparatif des mots : aucune réécriture lexicale, hors la graphie explicitement modernisée. Les ponctuations d’édition ne sont pas présentées comme des fautes d’auteur ; leur présentation est harmonisée pour l’écran.
- [x] Syntaxe et 179 tests réussis, avec garde-fous sur la casse initiale, la ponctuation finale, les espaces insécables et les anciens débuts de vers. Liste complète relue exportée localement.

- [x] Six contrôles de rendu bibliothèque/veille à 1280 et 320 px, dont prose longue et extrait de poésie : texte relu affiché intégralement, aucun débordement horizontal ni erreur JS.

- [x] v0.26.4 installée sur le cadre, empreintes et manifeste servis vérifiés ; onglet unique actualisé et veille plein écran réelle constatée après chargement des textes corrigés.


## v0.27.0 — Réglages personnels et télécommande commune

- [x] État de Spotify, Todoist et Home Assistant dans les réglages, dernière réussite conservée et signal discret sur le bouton Réglages en cas de problème. Un flux Home Assistant connecté reste à jour même sans changement de lampe.
- [x] +30 secondes, +5 minutes et « Refaire le même » sur le cadre et la télécommande. Trois minuteurs indépendants ; nouvelle identité à chaque répétition, refus des anciennes commandes.
- [x] Accueil : masquer les tuiles et les déplacer avec les boutons Monter / Descendre. L’horloge reste ancrée en premier ; un bouton restaure la composition d’origine. Veille : date, météo, prochain rendez-vous, citation et musique réglables séparément.
- [x] Sauvegarde JSON personnelle, aperçu puis restauration explicite : notes de la maison, recettes personnelles, tâches locales et préférences, y compris lieu météo et accès ScreenK. Les notes/recettes/tâches déjà présentes sont conservées. Les comptes, photos, agendas et minuteurs en cours sont exclus ; leur association/transfert reste séparé.
- [x] Sélecteur Cadre / Écran salon / Miroir sur le téléphone ; liens locaux configurables vers les télécommandes ScreenK existantes, sans transfert d’identifiants ni intégration iframe.
- [ ] Commandes ScreenK directement dans Hub : transport et authentification à intégrer ultérieurement, indépendamment du sélecteur déjà fonctionnel.


## v0.27.1 — Mise en page portrait

- [x] Disposition portrait dédiée : grande horloge en largeur, météo et rendez-vous côte à côte sur tablette, puis priorités/musique, cuisine/citation et contributions. Sur téléphone : agenda placé juste après la météo. Ordre et masquage personnalisés conservés.
- [x] Textes et cibles tactiles agrandis sur tablette ; navigation sur sa propre ligne. Cuisine empilée, lecteur musical vertical, météo détaillée en largeur, scènes et éclairages adaptés au portrait. Semaine du calendrier défilante horizontalement dans son propre panneau.
- [x] Veille : heure et citation agrandies, informations espacées, musique compacte conservée en haut à gauche.
- [ ] Portrait physique du cadre : valider après rotation réelle ; les contrôles de navigateur ne prouvent pas le comportement du capteur d’orientation Android.


## v0.27.2 — Portrait compact et trajets

- [x] Accueil portrait : menus par icônes avec noms accessibles, commandes remontées sur la même ligne, rangée des minuteurs uniquement lorsqu’elle contient un minuteur. GitHub compact à côté de Cuisine, citation ou note sur toute la largeur. L’accueil complet tient à 800 × 1280 avec le texte contrôlé.
- [x] Brief sans bouton Maison redondant ; Départs conserve son tableau principal et un rappel plus étroit, avec les deux trajets dans une tuile horizontale en dessous. Actualisation routière partagée, limitée et suspendue lorsque la page est masquée.
- [x] Veille portrait : plus grande occupation verticale, heure et citation espacées, musique compacte centrée.
- [x] Syntaxe, 188 tests et contrôles de navigateur sur sept formats, paysage, thème sombre, mouvement réduit, personnalisation et trois minuteurs. Données simulées pendant ces contrôles.
- [x] v0.27.2 installée sur le cadre identifié ; manifeste servi vérifié. Capture réelle en portrait 800 × 1280 : accueil complet, GitHub visible et plein écran confirmé. Aucun réglage Android de rotation modifié.
