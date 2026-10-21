# Maison connectée · Home Assistant

Hub. peut se connecter directement à **une instance Home Assistant déjà installée**, depuis **Réglages → Domotique**. Cette page ne crée pas de serveur et ne configure pas les intégrations des fabricants. Elle laisse la composition de l’accueil intacte.

## Connecter ton instance

1. Vérifier dans Home Assistant que les lumières, interrupteurs ou robots fonctionnent déjà.
2. Ouvrir le profil utilisateur Home Assistant, puis la section Sécurité / jetons d’accès longue durée. Créer un jeton pour le cadre, idéalement avec un compte dédié aux autorisations nécessaires.
3. Dans Hub., saisir l’adresse de ton instance et ce jeton, puis **Connecter**. Utiliser une adresse HTTP(S) sans identifiants, paramètres ni fragment. Ne jamais mettre le jeton dans l’URL.
4. Attendre l’état **Connecté**. Les appareils affichés viennent uniquement des états retournés par Home Assistant ; aucune maison fictive n’est ajoutée.

**Le jeton reste en mémoire par défaut.** Avec **Rester connecté sur cet appareil**, Hub mémorise l’adresse et le jeton dans le stockage local du navigateur, puis se reconnecte au rechargement. Le champ est vidé dès l’envoi. **Déconnecter et oublier le jeton** efface cette copie, sans révoquer le jeton dans Home Assistant.

Ce stockage n’est pas un coffre chiffré : une personne ayant accès au navigateur peut accéder à cette connexion. Ne cocher cette option que sur son Mac ou son cadre personnel. Un transfert vers le cadre peut passer par **Associer mes connexions**, avec un fichier AES-GCM et un code séparé valables 30 minutes ; les fichiers temporaires doivent ensuite être supprimés. Rien n’est inclus dans Git.

Après une interruption réseau, une connexion mémorisée retente uniquement l’authentification et la lecture des états, avec un délai de 2 à 60 secondes et suspension des tentatives lorsque la page est masquée. Les commandes d’appareils ne sont jamais répétées. Un jeton refusé exige une intervention.

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

## Validation

En v0.17.0, le jeton dédié autorisé a été créé et la lecture réelle des états a été vérifiée sur le Mac. La connexion persistante a été retrouvée après rechargement, sans nouvelle saisie. La Sonos Home et les deux télévisions sont détectées ; aucune commande d’appareil n’a été exécutée pour ces contrôles.

Les lumières Smart Life s’ajoutent via l’intégration officielle **Tuya** dans Home Assistant : code utilisateur depuis **Moi → Réglages → Compte et sécurité**, puis QR à scanner avec **+ → Scanner**. Hub reçoit ensuite les entités `light` et `switch` automatiquement. Les robots doivent également être intégrés dans Home Assistant avant d’apparaître dans Hub.

Références : [API WebSocket officielle](https://developers.home-assistant.io/docs/api/websocket/), [authentification Home Assistant](https://www.home-assistant.io/docs/authentication/), [capacités officielles vacuum](https://github.com/home-assistant/core/blob/dev/homeassistant/components/vacuum/const.py).


## Enceintes et Sonos — v0.14.0

Les entités `media_player` remontées par Home Assistant apparaissent dans **Enceintes · Sonos** : titre, artiste, lecture/pause, précédent/suivant et volume selon les capacités réellement annoncées. Le volume est borné entre 0 et 100 %. Les états attendent les événements Home Assistant ; une commande acceptée ne simule pas un changement d’état. Aucun regroupement Sonos, lancement de contenu ou allumage global implicite. Les pochettes protégées ne reçoivent jamais le jeton dans leur URL.

L’intégration [Sonos](https://www.home-assistant.io/integrations/sonos/) doit être ajoutée à ton instance ; Hub utilise ensuite les services [media_player](https://www.home-assistant.io/integrations/media_player/). Aucun appareil réel n’a encore été commandé par cette nouvelle interface.

## Page compacte · v0.18.0

Ordre de lecture : scènes (celles du salon en premier), lampes et prises d’éclairage, Sonos/télévisions, robots, puis réglages des appareils repliés. Les prises `switch` portant un nom d’éclairage/prise ou la classe `outlet` sont regroupées avec les lampes ; les réglages Sonos restent séparés. Aucun identifiant privé d’appareil n’est inclus dans le code.

Une lampe allumée reçoit une surface ambrée, une icône lumineuse et le texte « Allumé ». Une lampe éteinte garde une surface neutre ; une lampe indisponible reste identifiée comme telle et ses commandes sont désactivées. La commande cible le vrai domaine `light` ou `switch` et attend les états Home Assistant.

Les lecteurs exposant officiellement les capacités `TURN_ON`/`TURN_OFF` proposent une commande de mise sous/hors tension. Ce signal de capacité ne prouve pas le réveil physique après veille profonde : il dépend du modèle, de l’intégration et des réglages réseau de la télévision. Aucun réveil réel n’a été lancé pendant les vérifications.

### Indisponibilités et pilotage local

Tuya documente un bref état hors ligne pendant la reconnexion de Smart Life au cloud à l’ouverture : [explication Tuya](https://support.tuya.com/en/help/_detail/K9hut3kw7xumg). Ce délai ne suffit pas à conclure à un mauvais appairage. Dans Home Assistant, l’intégration officielle reprend l’indicateur `online` de Tuya ; un état durablement indisponible doit être examiné séparément.

Pour les ANTELA 9 W, [Tuya Local](https://github.com/make-all/tuya-local) est une piste de contrôle Wi-Fi local, sous réserve du protocole, de la clé locale et du profil effectivement détectés. Le modèle commercial seul ne garantit pas la compatibilité. Une première ampoule joignable doit être validée avant une migration ; aucune intégration communautaire ni modification du micrologiciel n’a été installée pour cette refonte. Les ampoules qui ne rejoignent plus Smart Life doivent d’abord retrouver une connexion réseau et une alimentation normales.
