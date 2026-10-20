# Liste de reprise

## Avant GitHub

- [ ] Revoir l’interface avec l’utilisateur et choisir les éventuels ajustements.
- [ ] Créer le dépôt GitHub demandé après cette revue ; nom proposé : `smart-hub`.
- [ ] Contrôler le diff, l’exclusion de `.env`, `.data`, `tools`, sauvegardes et captures privées, puis publier une version cohérente avec l’historique existant.

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
- [x] Liens de recettes dans un nouvel onglet, avec adresse HTTP(S) validée. Le navigateur Android lui-même reste à installer sur le cadre.
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
- [ ] Brancher le cadre en USB-A → USB-C de données, confirmer `adb devices -l` et lire son identité réelle.
- [ ] Faire les sauvegardes privées nécessaires avant installation sur le cadre.
- [ ] Choisir et vérifier le navigateur/kiosk compatible ; tester Hub. sur le vrai panneau.
- [ ] Vérifier le retour aux réglages Android avec un seul doigt et après redémarrage.
- [ ] Stabiliser l’accès de maintenance et l’adresse du cadre avec une méthode validée pour ce matériel.

## Comptes et données

- [ ] Configurer et vérifier le compte Outlook personnel.
- [ ] Configurer séparément Outlook travail ; vérifier les règles de l’entreprise et les calendriers partagés nécessaires.
- [ ] Configurer et vérifier Google Agenda du compte Gmail.
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
