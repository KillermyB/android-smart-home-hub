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
- [x] 240 citations sourcées, cycle mélangé sans répétition, historique précédent/suivant et mémoire des dernières lectures.

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
