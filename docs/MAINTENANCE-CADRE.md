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

Le lancement automatique de Hub et la reprise SSH après un vrai redémarrage ne sont pas encore validés. Le service web en mémoire doit être relancé après coupure. Les fichiers Hub et les données Firefox sont persistants ; la présence des fichiers n’est pas une preuve d’autostart.

Si SSH répond, utiliser `frame start`. Sinon, reprendre l’accès USB/ADB avec le câble de données validé. Sur le Mac de cette installation, le serveur ADB qui détient l’USB utilise le port 5038 ; c’est un état local à vérifier, pas un paramètre à imposer sur Windows. Ne pas ouvrir ADB TCP 5555 pour contourner une reprise difficile.

Avant de remplacer le launcher ou d’installer un kiosk permanent, l’utilisateur doit confirmer physiquement le retour aux réglages Android, puis la reprise après coupure. Le parcours tactile Cuisine → recette → Maison est confirmé ; il ne valide pas ce chemin de récupération.

## Comptes et données personnelles

La copie du cadre et le site HTTPS ont des stockages séparés. Un push GitHub ne transfère aucun favori, photo, note ou jeton du navigateur du Mac. Les notes/photos/recettes peuvent être transférées manuellement avec le compagnon ; conserver les exports utiles avant toute opération sur les données Firefox.

La vraie ville météo reste à choisir. GitHub public se charge sans clé. Les comptes Todoist, Spotify, calendriers et Home Assistant doivent être autorisés séparément par leur propriétaire. Pour Spotify, déclarer exactement le callback affiché, avec `http://127.0.0.1:4173/` pour cette copie locale. Les calendriers Outlook/Google utilisent encore le serveur Node et ne sont pas connectés par la copie statique. Voir [CONNEXIONS.md](CONNEXIONS.md), [COURSES-SPOTIFY.md](COURSES-SPOTIFY.md) et [DOMOTIQUE.md](DOMOTIQUE.md).
