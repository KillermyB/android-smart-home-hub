# Cadre installé et mises à jour Wi-Fi

## Installation du 20 octobre 2026 — v0.7.0

Le cadre vérifié est un sun8i/A33, Android 6.0.1, ARMv7, build 20260529, écran 1280 × 800. L’accès USB/ADB était déjà root. Les sauvegardes privées des données, de boot et de bootloader ont été relues et vérifiées avant les installations. Ce n’est pas une image complète de toutes les partitions.

- Firefox 143.0.4 ARMv7, téléchargé depuis [Mozilla](https://archive.mozilla.org/pub/fenix/releases/143.0.4/), affiche Hub avec son propre moteur ; le WebView 44 stock est conservé. Mozilla indique que les [versions suivantes demandent Android 8](https://blog.mozilla.org/futurereleases/2025/09/15/raising-the-minimum-android-version-for-firefox/).
- [SimpleSSHD 27](https://f-droid.org/en/packages/org.galexander.sshd/), provenant de F-Droid, fournit la maintenance par clé. Aucun APK n’est stocké dans Git.
- Hub est installé dans `/data/local/hub/releases/v0.7.0`, avec un lien `www` vers la version active et un manifeste d’empreintes SHA-256.
- Le BusyBox déjà présent sert uniquement les fichiers statiques sur **127.0.0.1:4173**. Le Mac et la tour peuvent être éteints. Ce service sur le cadre ne fournit ni synchronisation du compagnon ni connexions calendriers Node.
- Fuseau Europe/Zurich, heure automatique, fuseau manuel et écran maintenu allumé sur alimentation ont été appliqués avec l’accord explicite de l’utilisateur.
- Le launcher AiMOR, ses données et le WebView stock sont conservés. Aucune partition n’a été flashée.

Ouvrir Hub dans Firefox à `http://127.0.0.1:4173/`, puis **Réglages → Plein écran**. Le même bouton quitte le plein écran ; la touche Retour du navigateur peut aussi le quitter. Un nouveau chargement peut demander de le réactiver. Les polices statiques corrigent les caractères trop fins observés sur cet Android ; les textes, heures et commandes ont ensuite été agrandis selon le retour sur le vrai cadre.

## Maintenance depuis le Mac autorisé

SSH écoute sur le port **2222**, avec une seule clé créée pour ce Mac. La clé privée, la configuration et la clé hôte épinglée via USB sont dans le dossier privé frère du dépôt, `.private-frame-access/`. Ils ne sont pas dans Git et ne doivent pas être publiés ou copiés avec les sources.

Le pare-feu de la session autorise seulement ce Mac et la boucle locale en IPv4, et bloque IPv6 pour ce port. Les redirections de ports/agent sont désactivées. Le shell vérifie aussi l’adresse source avant d’accorder root : cette restriction et la clé persistent dans les fichiers de l’application même si les règles de pare-feu en mémoire disparaissent au redémarrage. Une nouvelle IP du Mac peut donc nécessiter une reprise par USB. Aucun réglage de la box ni ouverture Internet n’a été effectué.

Depuis la racine du dépôt sur ce Mac :

```sh
npm run frame -- status --config '../.private-frame-access/connection.json'
npm run frame -- open --config '../.private-frame-access/connection.json'
```

Pour mettre à jour, conserver d’abord les modifications éventuelles signalées par Git, récupérer une version publiée puis contrôler le code :

```sh
git status --short
git pull --ff-only
npm run check
npm test
npm run frame -- deploy --config '../.private-frame-access/connection.json'
```

Le script vérifie l’identité du cadre, refuse une clé hôte inconnue et transfère seulement les fichiers statiques de `dist/`. Il refuse les fichiers cachés et liens symboliques, compare les empreintes sur l’appareil puis active la nouvelle version. Une version déjà installée est immuable : ne pas redéployer un contenu différent sous le même numéro. Les versions antérieures sont conservées ; en cas d’échec du contrôle HTTP après activation, le script tente de revenir à la précédente version publiée. Les données Firefox ne sont jamais effacées. Un rechargement peut être nécessaire si l’onglet était déjà ouvert.

Pour relancer le service web local sans transférer les fichiers :

```sh
npm run frame -- start --config '../.private-frame-access/connection.json'
```

`connection.json` contient l’IP actuelle du cadre, `port: 2222`, `user: "root"` et le chemin absolu de la clé. `known_hosts` doit rester à côté. Une IP historique n’est jamais un défaut fiable ; revérifier l’adresse dans le cadre ou la box si la connexion échoue. Ne pas désactiver la vérification de clé hôte pour contourner une erreur.

## Après une coupure

Installation du 21 octobre : une solution réversible de démarrage sans remplacement d’AiMOR est installée après accord explicite. Le premier redémarrage a confirmé la reprise du serveur local et de SSH. L’IP reste en DHCP. Voir [DEMARRAGE-RESEAU.md](DEMARRAGE-RESEAU.md) pour le mécanisme, les contrôles et le retour arrière. Le paragraphe ci-dessous décrit le constat historique avant cette correction.

Lors du premier contrôle du 20 octobre, USB et Wi-Fi revenaient après redémarrage, avec réglages heure/écran et fichiers conservés. La préférence SimpleSSHD avait été activée après accord, mais `BackgroundManagerService` bloquait son `BOOT_COMPLETED` : SSH puis Hub avaient nécessité une relance manuelle. Le script installé le 21 octobre corrige cette reprise sans modifier cette politique globale. Les fichiers persistants seuls n’auraient pas suffi à prouver l’autostart ; le nouveau contrôle comprend un véritable redémarrage et la reprise constatée des services.

Si SSH répond, utiliser `frame start`. Sinon, reprendre l’accès USB/ADB avec le câble de données validé. Le Mac a utilisé ADB sur 5038 avant le redémarrage ; le serveur 5037 a repris l’USB ensuite. Vérifier lequel voit le cadre plutôt que réutiliser un port figé ; ce n’est pas un paramètre à imposer sur Windows. Ne pas ouvrir ADB TCP 5555 pour contourner une reprise difficile.

Avant de remplacer le launcher ou d’installer un kiosk permanent, l’utilisateur doit confirmer physiquement le retour aux réglages Android, puis la reprise après coupure. Le parcours tactile Cuisine → recette → Maison est confirmé ; il ne valide pas ce chemin de récupération.

## Comptes et données personnelles

La copie du cadre et le site HTTPS ont des stockages séparés. Un push GitHub ne transfère aucun favori, photo, note ou jeton du navigateur du Mac. Les notes/photos/recettes peuvent être transférées manuellement avec le compagnon ; conserver les exports utiles avant toute opération sur les données Firefox.

Moudon est configurée pour la météo. Spotify et Todoist ont été associés au cadre avec accord ; leurs connexions restent dans Firefox, hors Git. Les cinq imports ICS Google/Outlook/iCloud restent des instantanés à réimporter après modification. Le relevé GitHub importé est distinct des commits publics lus sans clé. Home Assistant reste à connecter à l’instance du propriétaire. Pour Spotify, déclarer exactement le callback affiché, avec `http://127.0.0.1:4173/` pour cette copie locale. Voir [AGENDAS-IMPORT.md](AGENDAS-IMPORT.md), [COURSES-SPOTIFY.md](COURSES-SPOTIFY.md) et [DOMOTIQUE.md](DOMOTIQUE.md).


## Affichage comme application Android

Firefox est le premier affichage compatible installé, pas la seule architecture possible. Une application kiosque dédiée peut réutiliser l’interface, intégrer un moteur compatible et afficher Hub sans barre d’adresse. La déclarer comme application d’accueil permet à Android de l’ouvrir au démarrage ; un simple récepteur `BOOT_COMPLETED` est filtré sur ce firmware, comme confirmé ici et documenté dans le [rapport PF1007L](https://github.com/wesbos/photo-frame-dashboard/blob/main/docs/allwinner-a33-mainline-uboot.md#8-notes-from-this-unit-after-root).

Cette application n’est pas encore livrée. Prévoir un moteur compatible Android 6, le lancement du service local et du SSH restreint, un accès aux réglages utilisable avec un seul doigt et une sortie vers AiMOR. Ne pas remplacer le launcher avant la validation physique du chemin de récupération ; le seul test Cuisine → recette → Maison ne couvre pas cette étape.

## Éviter les doublons d’onglets — v0.8.1

`frame deploy` met à jour les fichiers et vérifie le service, puis s’arrête. `frame start` relance uniquement le service. Actualiser l’onglet Hub déjà ouvert pour charger la nouvelle version ; ces commandes n’ouvrent plus d’onglet supplémentaire. `frame open` reste une ouverture explicite de Firefox, utile si aucun onglet Hub n’existe. Le paramètre `?v=` d’une ancienne URL ne bloque pas la lecture des fichiers les plus récents après actualisation.

Les quatre onglets provenaient des ouvertures successives pendant l’installation et les déploiements. Les trois doublons Hub ont été fermés après contrôle ; un seul onglet a été conservé, sans effacement des données Firefox.
