# Courses Todoist et Spotify — v0.5.0

Les deux connexions partent directement du navigateur, sans serveur personnel. Elles sont facultatives : les achats locaux restent dans `hub.shopping`, les autres données et fonctionnalités gardent leurs clés existantes. Le site reste privé et statique.

## Courses

- Depuis la tuile Courses, ajouter/modifier un achat et choisir un rayon. Les catégories automatiques sont des suggestions modifiables.
- Les achats cochés sont regroupés en bas ; ils peuvent être rétablis. La page Courses montre les achats actifs.
- Depuis une recette, ajuster les portions et cocher ce qu’on possède déjà, puis « Ajouter les ingrédients ». Les libellés actifs identiques ne sont pas ajoutés deux fois. Cela ne fusionne pas automatiquement des quantités différentes.
- « Cet appareil » et « Todoist » sont deux listes distinctes. Changer de source ne supprime ni n’envoie la liste locale.

Pour Todoist :

1. Dans Courses → Todoist, saisir soi-même le jeton personnel de l’[API officielle](https://developer.todoist.com/api/v1/), puis charger les projets. Ne pas envoyer le jeton dans un chat ou le dépôt.
2. Choisir le projet Courses existant, ou utiliser le bouton explicite pour en créer un. Le bouton des rayons crée seulement les sections manquantes dans le projet choisi.
3. Partager ce projet depuis l’application Todoist si nécessaire. Hub. ne crée pas de partage ou d’invitation.
4. Sur le téléphone, ouvrir le même projet dans Todoist. La liste distante est actualisée toutes les 60 secondes lorsque Hub. est visible ; une actualisation manuelle est disponible.
5. Les validations sont effectuées après réponse de l’API. L’historique distant couvre les sept derniers jours ; si son chargement échoue, ce fait est indiqué séparément des achats actifs.

Le jeton donne accès au compte Todoist ; Hub. ne l’envoie qu’à `api.todoist.com`. Il peut rester dans `sessionStorage`, ou être mémorisé sur cet appareil après choix explicite. Le bouton Déconnecter l’enlève de cette session sans révoquer le jeton chez Todoist. La révocation se fait dans Todoist. Rien n’est envoyé automatiquement depuis la liste locale.

La connexion directe alimente également les tâches quotidiennes, en excluant le projet Courses et ses sous-projets.

## Spotify

1. Créer/configurer son application dans le [dashboard Spotify](https://developer.spotify.com/dashboard). L’accès dépend des règles actuelles du mode de développement et des utilisateurs autorisés.
2. Enregistrer exactement l’adresse de retour montrée dans Musique → Configurer Spotify. Sur le site hébergé : `https://smart-hub-maison.kbo1.chatgpt.site/`.
3. En local, utiliser `http://127.0.0.1:4173/` : Spotify refuse `localhost` comme adresse de retour. Une adresse LAN HTTP du cadre n’est pas acceptée ; préférer le site HTTPS.
4. Saisir le Client ID public, puis autoriser Spotify. Aucun Client Secret n’est demandé. Le flux utilise PKCE S256 avec état aléatoire à durée limitée.
5. Ouvrir Spotify sur le téléphone ou une enceinte et lancer un morceau. Le cadre affiche la pochette, le titre, l’artiste et l’appareil, puis pilote précédent, lecture/pause et suivant.

Le cadre est une télécommande : il ne devient pas un haut-parleur Spotify. Les commandes nécessitent Premium et un appareil actif compatible. Aucun morceau ou état de lecture fictif n’est affiché. La progression est celle du dernier relevé, actualisé toutes les 15 secondes quand visible. Les boutons restent désactivés sans lecture active ou pour un appareil restreint.

Jetons d’accès et de renouvellement restent dans `sessionStorage`, jamais dans un export du compagnon. Le bouton Déconnecter efface la session locale ; la révocation de l’application se fait dans le compte Spotify. Les limites API provoquent une attente avant nouvelle tentative ; aucun polling quand le document est masqué ni lorsque les deux services sont déconnectés.

Références officielles : [PKCE](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow), [adresses de retour](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri), [lecture](https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback).

## Validation restante

Contrats testés avec réponses simulées : pagination Todoist, écritures, erreurs 401/429, PKCE/état, absence de lecteur Spotify. L’autorisation des vrais comptes et les échanges authentifiés n’ont pas été réalisés. Le navigateur et le tactile du cadre restent à vérifier. Les anciens flux Outlook/Google/Todoist Node restent inchangés.

## Spotify mémorisé et association — v0.9.0

Spotify peut maintenant conserver le jeton de renouvellement sur l’appareil, après choix explicite. Une fermeture d’onglet ou du navigateur ne supprime pas cette connexion mémorisée ; la déconnexion l’efface. L’association chiffrée depuis un navigateur déjà connecté évite de saisir ses identifiants sur le cadre. La procédure à jour est dans [CONFIGURATION.md](CONFIGURATION.md). Ces ajouts concernent Spotify ; le jeton Todoist reste géré séparément.
