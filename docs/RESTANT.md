# Liste de reprise

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
- [ ] Démarrage automatique SSH/Hub : option SimpleSSHD approuvée et activée, mais `BackgroundManagerService` filtre son signal de boot. Intégrer la reprise au futur kiosque d’accueil, après validation physique de l’accès aux réglages. Tester aussi une coupure électrique. Voir `MAINTENANCE-CADRE.md`.

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
