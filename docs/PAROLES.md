# Paroles dans le lecteur Spotify

Les paroles se recherchent automatiquement quand le lecteur Spotify est visible et lorsqu’un nouveau morceau apparaît. Le titre, l’artiste principal, l’album et la durée du morceau sont envoyés à `https://lrclib.net/api/get` ; ni jeton Spotify ni cookies ne sont transmis. Aucun serveur personnel et aucune clé LRCLIB ne sont nécessaires. Une même piste n’est recherchée qu’une fois par visite du lecteur ; les actualisations Spotify et les rendus ne relancent pas la recherche, même en cas d’erreur ou d’absence de résultat.

Si des paroles sont disponibles, elles remplacent la pochette. Sinon, la pochette reste visible avec un statut discret (absence, instrumental ou erreur) et une nouvelle tentative manuelle reste possible. **Afficher la pochette** conserve ce choix pour le morceau dans la session (30 morceaux maximum), même après une navigation ou un passage en arrière-plan. La configuration Spotify permet de désactiver **Paroles automatiques** ; ce réglage reste local à l’appareil. Le bouton **Afficher les paroles** permet toujours une recherche manuelle.

Quitter le lecteur, passer en veille ou masquer l’onglet annule la recherche. Le retour au lecteur peut reprendre la recherche automatique en utilisant le cache mémoire et les limites du client. Aucune recherche automatique n’est lancée sur la page d’accueil ni derrière une fenêtre de réglages.

Le lecteur distingue paroles synchronisées, texte non synchronisé, morceau indiqué comme instrumental, absence de résultat et erreur. La synchronisation est une estimation locale à partir du dernier relevé Spotify ; elle se recale avec l’actualisation Spotify. Seule la zone de texte change à chaque nouvelle ligne. Le suivi s’arrête à la pause, en arrière-plan et derrière une fenêtre de réglages.

`dist/lyrics.js` expose `HubLyrics` dans le navigateur et `module.exports` dans les tests :

- `create({ fetch?, client?, timeoutMs? })` crée un client sans requête réseau.
- `client.load(spotifyItem, { signal? })` renvoie une promesse avec `status`, `source`, `sourceURL`, `track`, `id`, `plainText` et `lines`. Les statuts sont `synced`, `plain`, `instrumental`, `not-found`. Une erreur comporte `kind` ; une limitation comporte aussi `retryAt`.
- `client.cancel()` annule les recherches actives et en attente ; `clear()` efface le cache mémoire.
- `track(item)` valide les métadonnées. `parseLRC(text)` renvoie des `{ timeMs, text }`. `lineAt(lines, progress_ms)` renvoie l’index de la dernière ligne démarrée, ou `-1` avant la première ligne. Une ligne vide signifie une pause dans le texte. Un offset LRC positif avance les paroles.

Le client sérialise les recherches, espace les appels de 300 ms et respecte `Retry-After`. Le délai est de 12 secondes, les réponses sont limitées à 256 Kio et le cache à 12 morceaux en mémoire (une heure ; dix minutes pour une absence). Les paroles ne sont pas exportées, stockées durablement ni incluses dans le dépôt. Les tests utilisent uniquement des textes synthétiques et des réponses simulées.

Sources primaires : [API LRCLIB](https://lrclib.net/docs), [code du serveur](https://github.com/tranxuanthang/lrclib), [licence MIT du logiciel serveur](https://github.com/tranxuanthang/lrclib/blob/main/LICENSE), [configuration CORS](https://github.com/tranxuanthang/lrclib/blob/main/server/src/router.rs). Le serveur autorise l’en-tête navigateur `Lrclib-Client` ; ne pas définir manuellement `User-Agent`. L’interface affiche un lien d’attribution LRCLIB. La licence MIT du logiciel serveur ne constitue pas une licence sur les textes de paroles renvoyés par le service.

## Vérification restante

Les tests locaux couvrent le protocole simulé, le parseur LRC, les limites, le cache, les erreurs et l’annulation. La connexion Spotify réelle, les correspondances de morceaux, le suivi après un seek et l’affichage tactile sur le cadre restent à vérifier séparément. Ne pas considérer la réussite des tests synthétiques comme une validation de ces intégrations.
