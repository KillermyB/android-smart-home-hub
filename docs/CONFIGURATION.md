# Activer les services de Hub

Le cadre et le site privé utilisent des stockages de navigateur distincts. Une autorisation donnée dans Chrome ne connecte pas automatiquement Firefox ; l’association Spotify ci-dessous transmet cette connexion au cadre. Ne transférer aucun secret par Git, messagerie ou capture d’écran.

## Météo et GitHub

- Moudon est chargée automatiquement si aucune ville n’a été choisie. Le choix existant est conservé. Le relevé réel affiche sa date et se renouvelle toutes les 30 minutes tant que l’onglet est visible.
- GitHub public utilise le compte déjà choisi, sans clé. Les dépôts privés ne sont pas inclus dans ce compteur ; zéro commit public n’indique pas une absence d’activité privée.
- Les anciennes données d’exemple sont masquées lors de cette mise à jour, sans supprimer tâches, recettes ou favoris. Le pied de page ouvre simplement les réglages.

## Spotify et les paroles

1. Sur le cadre, ouvrir la tuile Spotify, puis **Connecter Spotify**.
2. Pour une autorisation directement sur le cadre, cocher **Rester connecté sur cet appareil**. Le Client ID public de l’application existante est prérempli. Sélectionner **Continuer avec Spotify**, se connecter au bon compte et autoriser la lecture de l’activité et le contrôle de la lecture.
3. Sur un téléphone, le Mac ou une enceinte, lancer un morceau dans Spotify. Hub affiche son état ; il ne crée pas d’appareil de lecture audio.
4. Les paroles LRCLIB sont recherchées automatiquement dans le lecteur. Le suivi est estimé à partir de la progression Spotify ; aucune parole n’est inventée si la recherche échoue. La pochette reste visible ; les paroles disponibles apparaissent en dessous. Les options de paroles et de connexion restent dans les réglages du lecteur.

Les deux retours autorisés dans l’application Spotify sont `http://127.0.0.1:4173/` pour le cadre et `https://smart-hub-maison.kbo1.chatgpt.site/` pour le site. L’ancien retour de cette application est conservé. Aucune clé secrète n’est nécessaire avec PKCE. Le compte développeur doit remplir les [conditions du mode de développement Spotify](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

### Sono Home

Le bouton **Home** utilise Spotify Connect. Si aucun appareil disponible ne porte ce nom, choisir sa sono dans la liste : son nom est mémorisé pour les prochains appuis. Seuls les appareils réellement retournés par Spotify sont proposés ; un appareil absent ou restreint ne peut pas être sélectionné. Le transfert conserve l’état lecture/pause et ne change pas le volume. Le curseur de volume est actif uniquement si l’appareil annonce cette capacité.

### Associer le cadre depuis le Mac

Après la connexion sur le Mac : **Configurer Spotify → Associer depuis un autre appareil → Créer le fichier d’association**. Le fichier JSON contient uniquement du contenu chiffré AES-GCM ; le code de 256 bits reste séparé. Utiliser **Afficher le code** pour le lire ou le copier, puis **Masquer le code**. L’association expire après 10 minutes. Sur le cadre, ouvrir le même écran, choisir le fichier, saisir le code et garder cochée **Garder la connexion sur cet appareil**. La connexion est conservée dans le stockage privé du navigateur et son accès est renouvelé par l’API Spotify. Ne pas conserver le code avec le fichier ni les publier. Le transfert peut être effectué ponctuellement par la liaison privée du Mac au cadre, sans serveur supplémentaire.

La mémorisation n’est pas un coffre-fort contre un appareil compromis. « Déconnecter » enlève les jetons des stockages de session et persistant. Spotify peut révoquer une autorisation ; dans ce cas seulement, une nouvelle connexion peut être nécessaire. La réussite dans Chrome ne prouve pas la réussite de l’association sur le cadre. Sur ce cadre, l’import et la reprise après fermeture/réouverture de Firefox ont été vérifiés le 20 octobre 2026.

## Todoist

Pour les courses sans serveur : **Cuisine → Courses → Todoist**. Ouvrir Todoist **Paramètres → Intégrations → Développeur**, puis coller le jeton uniquement dans le champ protégé de Hub. Charger les projets et choisir le projet Courses. La création d’un projet ou de rayons reste une action explicite. Aucun achat local n’est envoyé automatiquement.

La connexion directe alimente aussi les tâches et priorités. Le projet `course` et ses sous-projets sont exclus des tâches ; seules ses tâches alimentent les courses. La mémorisation est un choix explicite ; « Déconnecter Todoist » efface l’accès dans Hub.

## Calendriers : copier les fichiers ICS

Aucune API, clé ni configuration `.env` n’est nécessaire :

1. Exporter le fichier `.ics` depuis Google Agenda, Outlook ou iCloud. Pour Google, décompresser le ZIP exporté avant l’import.
2. Ouvrir **Réglages → Mes agendas**, choisir **Perso**, **Travail** ou **Myrak**, puis sélectionner les fichiers `.ics` sur l’appareil. Plusieurs fichiers sont acceptés.
3. Pour une nouvelle version, sélectionner la copie dans **Remplacer une copie existante** et importer un seul fichier. Cela conserve le nom et le calendrier choisis et évite les doublons, même si le nom de l’export diffère.
4. Les événements récurrents, exceptions et fuseaux sont lus localement. Les fichiers restent dans ce navigateur ; un import est une copie datée, pas un abonnement automatique.

Perso et Travail partagent le filtre orange ; Myrak conserve son bleu. Les sources restent distinctes dans le détail. Un lien `webcal://` n’est pas un fichier : télécharger son export ICS avant l’import. Ne jamais placer les calendriers privés dans `dist`, Git ou un répertoire publié. L’association chiffrée ponctuelle peut transmettre leurs copies au cadre sans serveur permanent.

## Google Agenda API : option directe dans le navigateur

Dans **Mes agendas → Connexion Google Agenda · Myrak** :

1. Activer **Google Calendar API** dans Google Cloud, configurer l’écran de consentement et créer un client OAuth **Application Web**.
2. Ajouter les origines JavaScript exactes utilisées : `http://127.0.0.1:4173` sur le cadre et `https://smart-hub-maison.kbo1.chatgpt.site` sur le site. Ajouter l’origine de l’aperçu local seulement si nécessaire.
3. Activer la connexion Google dans Hub, renseigner le **Client ID public** puis se connecter. Aucun Client Secret ne doit être saisi ou publié.
4. Choisir les agendas et **Charger ces agendas**. Le relevé remplace uniquement les ICS Myrak à l’affichage ; leurs copies ne sont pas supprimées. **Revenir aux fichiers ICS Myrak** rétablit ces copies.

Le [modèle Google Identity Services](https://developers.google.com/identity/oauth2/web/guides/use-token-model) fournit un accès temporaire sans jeton de renouvellement. Hub conserve uniquement le Client ID, la sélection et la copie datée des événements ; l’accès reste en mémoire. Après expiration ou fermeture du navigateur, reconnecter Google pour actualiser. Les événements déjà chargés restent disponibles hors ligne. Ce flux ne promet donc pas une synchronisation permanente sans intervention. Aucun compte Google n’a encore été autorisé pour cette nouvelle connexion.

## Home Assistant

Ouvrir le bouton **Domotique** dans la barre du haut après avoir préparé l’instance Home Assistant. Renseigner son URL et son jeton dans Hub ; le jeton reste en mémoire. Depuis le site HTTPS, utiliser une instance également accessible en HTTPS. Les appareils réels apparaissent seulement après connexion. Voir [DOMOTIQUE.md](DOMOTIQUE.md).


## Qualité de l’air

Le petit widget météo affiche l’indice **européen** et l’UV, séparément. Données modélisées [Open-Meteo / CAMS ENSEMBLE](https://open-meteo.com/en/docs/air-quality-api), actualisées toutes les 30 minutes lorsque la page est visible. Le relevé daté est conservé en cas de coupure ; ce ne sont pas des mesures de capteurs intérieurs.
