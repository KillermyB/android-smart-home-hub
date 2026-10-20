# Hub.

Un tableau de bord tactile pour le cadre AiMOR PF1007/PF1007L : heure, météo, calendriers, tâches, cuisine et musique.

**Version : v0.7.1.** Hub est installé et affiché sur le cadre physique dans Firefox 143.0.4. La navigation réutilise l’en-tête, les favoris se mettent à jour sur place et la recherche conserve son champ. Un comparatif sur le cadre confirme une réduction du temps de traitement JavaScript ; mesures et limites dans [VERIFICATION.md](docs/VERIFICATION.md). Le tactile Cuisine → recette → Maison a été confirmé par l’utilisateur. Le redémarrage Android a conservé les réglages et fichiers ; le démarrage automatique est bloqué par la politique constructeur. La reprise après coupure, les performances prolongées et les comptes réels restent à vérifier. Les exemples sont signalés et aucun compte externe n’est connecté par défaut.

Dépôt privé : [KillermyB/smart-hub](https://github.com/KillermyB/smart-hub), branche `main`, version `v0.7.1`.

Le cadre utilise désormais ses propres fichiers à `http://127.0.0.1:4173/`, sans Mac ni tour allumés. Les mises à jour Wi-Fi depuis ce Mac sont décrites dans [MAINTENANCE-CADRE.md](docs/MAINTENANCE-CADRE.md).

## Récupérer et lancer sur Windows

Installer Git et [Node.js](https://nodejs.org/) **22.9 ou plus récent**. Ouvrir PowerShell dans le dossier où conserver le projet :

```powershell
git clone https://github.com/KillermyB/smart-hub.git
Set-Location .\smart-hub
npm run check
npm test
npm start
```

Un dépôt privé demande une connexion GitHub autorisée. Ouvrir [http://localhost:4173](http://localhost:4173). Aucun `npm install` ni fichier `.env` n’est nécessaire pour l’interface et les fonctions locales de cette version. Arrêter avec `Ctrl+C`.

Pour reprendre l’installation du cadre, suivre [INSTALLATION-CADRE.md](docs/INSTALLATION-CADRE.md). Le cadre doit ouvrir le site dans un navigateur compatible ; il n’a pas besoin de Git ou de Node.js.

## Fonctionnalités conservées et affinées

- **Accueil** : grande horloge sur dégradé bleu/crème/orange, météo et priorités à droite, prochains rendez-vous avec leurs heures lisibles, repas et Spotify. GitHub et citations restent accessibles. Mode sombre graphite.
- **Agenda** : sources distinctes **Perso, Myrak et Travail**, avec filtres et repères de couleur ; Myrak utilise un bleu soutenu. Vues jour, semaine et mois.
- **À faire** : ajout, validation et suppression des tâches locales ; connexion Todoist des tâches quotidiennes via le serveur Node existant après configuration.
- **Cuisine** : 32 recettes initiales, dont 20 faciles à petit budget sans porc ; recettes personnelles, recherche, catégories, favoris, plats retirés/restauration, portions et étapes conservés.
- **Courses** : page dédiée depuis Cuisine ou Réglages, rayons modifiables, articles cochés en bas, ajout des ingrédients manquants depuis une recette. Liste locale distincte du projet Todoist choisi.
- **Musique** : widget et lecteur Spotify immersif, pochette et commandes après autorisation ; paroles LRCLIB automatiques en mode focus lorsque disponibles, avec option de désactivation et retour à la pochette. Aucune lecture ni parole fictive n’est présentée comme réelle.
- **Domotique** : page Maison connectée depuis Réglages, liaison directe à une instance Home Assistant existante, vrais états et commandes des lumières/interrupteurs/robots/scènes, jeton en mémoire uniquement. [Guide Home Assistant](docs/DOMOTIQUE.md).
- **Brief du matin** : prochain rendez-vous, trois priorités, météo et repas choisi ; ouverture matinale facultative.
- **Minuteur** : accessible depuis chaque page, durée libre, pause/reprise, ajout d’une minute, persistance et alerte visuelle.
- **Compagnon local** : notes, photos, liens et recettes conservés sur l’appareil ; transfert manuel par fichier, sans serveur de synchronisation. [Guide de transfert](docs/TRANSFERT-LOCAL.md).
- **GitHub** : commits publics de KillermyB sur 28 jours ; compte configurable, cache, erreurs et résultats partiels signalés.
- **Veille** : grande heure, météo de la ville choisie et 200 citations sourcées en police sans sérif ; réveil par toucher ou Échap.
- **Interface** : polices et icônes locales, commandes tactiles, transitions courtes et préférence `prefers-reduced-motion` conservée. Cible Chrome/WebView 106 ou plus récent.

## Où vivent les données

Les tâches locales, recettes, favoris, plats retirés, repas, courses, thème, ville météo, réglages et minuteur restent **dans le navigateur utilisé**. Les contenus « À garder » utilisent IndexedDB. Chaque appareil et chaque origine (`localhost`, site hébergé) garde sa propre copie. Un clone ou un push GitHub ne transfère pas ces données.

Les jetons Courses Todoist et Spotify restent dans la session du navigateur. Le jeton Home Assistant reste uniquement en mémoire ; seule son adresse peut être mémorisée avec accord explicite. Les anciennes connexions calendriers/tâches Node utilisent `.env` et `.data` sur la tour. Ne publier ni secrets, ni exports personnels, ni sauvegardes du cadre. La clé et les jetons de ce serveur sont sur la même machine : le chiffrement protège le fichier isolé, pas une machine compromise.

## Services et limites

La copie autonome du cadre et le [site privé HTTPS](https://smart-hub-maison.kbo1.chatgpt.site/) évitent de garder la tour allumée pour les fonctions locales, météo, GitHub public, courses Todoist et télécommande Spotify. Les calendriers Perso/Myrak/Travail restent à autoriser et à vérifier séparément ; les flux calendriers existants nécessitent encore le serveur Node. Choisir une couleur ou un nom de source ne connecte pas un compte.

La domotique exige une instance Home Assistant existante, accessible depuis le navigateur. Depuis Hub. en HTTPS, son adresse doit également être HTTPS. Aucun serveur domotique n’est installé par cette app et aucun appareil réel n’a encore été testé. Voir [DOMOTIQUE.md](docs/DOMOTIQUE.md).

Pour Todoist/Spotify, voir [COURSES-SPOTIFY.md](docs/COURSES-SPOTIFY.md). Pour Outlook/Google et le mode LAN, voir [CONNEXIONS.md](docs/CONNEXIONS.md). Spotify pilote un appareil existant et nécessite les droits du compte, Premium et un appareil actif ; il ne transforme pas le cadre en haut-parleur. La fermeture complète de la session peut demander une nouvelle connexion.

Les paroles sont recherchées auprès de [LRCLIB](https://lrclib.net/docs) automatiquement en mode focus si cette option est activée, à partir des métadonnées du morceau. Le réglage Spotify permet de désactiver ce chargement ; le bouton « Afficher la pochette » masque les paroles pour le morceau courant. La pochette reste visible si aucune parole n’est disponible. Le logiciel serveur LRCLIB est publié sous licence MIT ; **cette licence ne donne pas de droits sur les paroles retournées**. Aucun texte de chanson n’est inclus dans le dépôt. Une absence, une version instrumentale ou une erreur de recherche est signalée.

## Validation et reprise sur le cadre

```powershell
npm run check
npm test
```

Les tests de code, les contrôles visuels en navigateur, les autorisations de vrais comptes, le push GitHub et le fonctionnement physique sont des validations distinctes. Les résultats de chaque livraison sont consignés dans [VERIFICATION.md](docs/VERIFICATION.md).

L’accès USB/ADB root a été confirmé sur le Mac, les sauvegardes données/boot/bootloader sont vérifiées et Firefox est installé. Le WebView stock et AiMOR sont conservés. Pour un autre ordinateur, commencer par les lectures d’identité et ne pas utiliser les anciennes adresses IP. Le démarrage automatique et le retour physique aux réglages Android restent à valider. Voir [INSTALLATION-CADRE.md](docs/INSTALLATION-CADRE.md), puis [CADRE-WINDOWS.md](docs/CADRE-WINDOWS.md).

La liste des étapes restantes est dans [RESTANT.md](docs/RESTANT.md).
