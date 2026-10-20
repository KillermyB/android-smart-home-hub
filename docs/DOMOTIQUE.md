# Maison connectée · Home Assistant

Hub. peut se connecter directement à **une instance Home Assistant déjà installée**, depuis **Réglages → Domotique**. Cette page ne crée pas de serveur et ne configure pas les intégrations des fabricants. Elle laisse la composition de l’accueil intacte.

## Connecter ton instance

1. Vérifier dans Home Assistant que les lumières, interrupteurs ou robots fonctionnent déjà.
2. Ouvrir le profil utilisateur Home Assistant, puis la section Sécurité / jetons d’accès longue durée. Créer un jeton pour le cadre, idéalement avec un compte dédié aux autorisations nécessaires.
3. Dans Hub., saisir l’adresse de ton instance et ce jeton, puis **Connecter**. Utiliser une adresse HTTP(S) sans identifiants, paramètres ni fragment. Ne jamais mettre le jeton dans l’URL.
4. Attendre l’état **Connecté**. Les appareils affichés viennent uniquement des états retournés par Home Assistant ; aucune maison fictive n’est ajoutée.

**Le jeton reste en mémoire de cette page.** Il n’est enregistré ni dans localStorage, ni dans sessionStorage, ni dans les exports, ni dans le dépôt. Le champ de saisie est vidé dès l’envoi du formulaire. Fermer/recharger la page ou choisir **Déconnecter et oublier le jeton** demande une nouvelle saisie. Le jeton reste révocable depuis Home Assistant.

Seule l’adresse, sans secret, peut être mémorisée en cochant l’option correspondante. Pour effacer une adresse déjà mémorisée, se déconnecter puis établir la prochaine connexion avec cette case décochée.

## Réseau et HTTPS

- Le navigateur du cadre doit pouvoir joindre directement Home Assistant. Un site hébergé ne rend pas automatiquement ton réseau domestique accessible à distance.
- Depuis le site Hub. en **HTTPS**, utiliser une instance Home Assistant également en **HTTPS**, avec un certificat accepté par le navigateur. Le navigateur peut demander une autorisation d’accès au réseau local.
- Pour un essai LAN en HTTP, ouvrir Hub. et Home Assistant dans un contexte réseau cohérent. Ce choix ne convient pas à la connexion Spotify exigeant HTTPS ou le retour loopback autorisé.
- Hub. utilise l’API WebSocket officielle `/api/websocket`. L’authentification et les autorisations sont celles de ton compte Home Assistant.

Aucun changement réseau, ouverture de port, accès distant ou certificat n’est configuré par Hub. La demande « sans serveur personnel » reste respectée pour les fonctions locales du cadre ; **la domotique nécessite une instance Home Assistant existante**, sur le matériel de ton choix.

## Commandes disponibles

| Entités Home Assistant | Commandes prévues |
| --- | --- |
| `light.*` | Allumer, éteindre |
| `switch.*` | Allumer, éteindre |
| `vacuum.*` | Démarrer, pause, arrêter, retour à la base, selon les capacités annoncées |
| `scene.*` | Activer une scène |

Les noms et les états viennent de Home Assistant. Les robots peuvent afficher leur batterie lorsque cette information est fournie. Les commandes sont désactivées pour les états inconnus/indisponibles, pendant une commande et en cas de déconnexion. Les capacités des robots utilisent les indicateurs officiels de Home Assistant ; une commande non annoncée n’est pas proposée.

Une réponse positive signifie **« commande acceptée par Home Assistant »**. L’état affiché attend la mise à jour réelle de l’entité : Hub. ne simule pas l’allumage ou le démarrage d’un robot. Aucune commande n’est envoyée en ouvrant la page ou en se connectant, aucune commande en échec n’est répétée automatiquement, et seules les entités identifiées explicitement sont ciblées.

## Validation restant à faire

Le module et l’interface sont préparés en v0.6.0. La connexion à ton instance, les autorisations du compte, les vrais appareils, le réseau du cadre, le tactile et la reconnexion après coupure restent à vérifier avec toi. Aucun test simulé ne prouve l’activation d’une lumière ou d’un robot réel.

Commencer par consulter les états. Tester ensuite une seule lumière clairement identifiée, puis vérifier physiquement son état et son retour dans l’interface. Pour un robot, vérifier d’abord que la zone est prête et que les commandes sont disponibles dans Home Assistant.

Références : [API WebSocket officielle](https://developers.home-assistant.io/docs/api/websocket/), [authentification Home Assistant](https://www.home-assistant.io/docs/authentication/), [capacités officielles vacuum](https://github.com/home-assistant/core/blob/dev/homeassistant/components/vacuum/const.py).


## Enceintes et Sonos — v0.14.0

Les entités `media_player` remontées par Home Assistant apparaissent dans **Enceintes · Sonos** : titre, artiste, lecture/pause, précédent/suivant et volume selon les capacités réellement annoncées. Le volume est borné entre 0 et 100 %. Les états attendent les événements Home Assistant ; une commande acceptée ne simule pas un changement d’état. Aucun regroupement Sonos, lancement de contenu ou allumage global implicite. Les pochettes protégées ne reçoivent jamais le jeton dans leur URL.

L’intégration [Sonos](https://www.home-assistant.io/integrations/sonos/) doit être ajoutée à ton instance ; Hub utilise ensuite les services [media_player](https://www.home-assistant.io/integrations/media_player/). Aucun appareil réel n’a encore été commandé par cette nouvelle interface.
