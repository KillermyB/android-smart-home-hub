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
4. Les paroles LRCLIB sont recherchées automatiquement dans le lecteur. Le suivi est estimé à partir de la progression Spotify ; aucune parole n’est inventée si la recherche échoue. Le bouton **Afficher la pochette** permet de masquer les paroles.

Les deux retours autorisés dans l’application Spotify sont `http://127.0.0.1:4173/` pour le cadre et `https://smart-hub-maison.kbo1.chatgpt.site/` pour le site. L’ancien retour de cette application est conservé. Aucune clé secrète n’est nécessaire avec PKCE. Le compte développeur doit remplir les [conditions du mode de développement Spotify](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

### Associer le cadre depuis le Mac

Après la connexion sur le Mac : **Configurer Spotify → Associer depuis un autre appareil → Créer le fichier d’association**. Le fichier JSON contient uniquement du contenu chiffré AES-GCM ; le code de 256 bits reste séparé. Utiliser **Afficher le code** pour le lire ou le copier, puis **Masquer le code**. L’association expire après 10 minutes. Sur le cadre, ouvrir le même écran, choisir le fichier, saisir le code et garder cochée **Garder la connexion sur cet appareil**. La connexion est conservée dans le stockage privé du navigateur et son accès est renouvelé par l’API Spotify. Ne pas conserver le code avec le fichier ni les publier. Le transfert peut être effectué ponctuellement par la liaison privée du Mac au cadre, sans serveur supplémentaire.

La mémorisation n’est pas un coffre-fort contre un appareil compromis. « Déconnecter » enlève les jetons des stockages de session et persistant. Spotify peut révoquer une autorisation ; dans ce cas seulement, une nouvelle connexion peut être nécessaire. La réussite dans Chrome ne prouve pas la réussite de l’association sur le cadre.

## Todoist

Pour les courses sans serveur : **Cuisine → Courses → Todoist**. Ouvrir Todoist **Paramètres → Intégrations → Développeur**, puis coller le jeton uniquement dans le champ protégé de Hub. Charger les projets et choisir le projet Courses. La création d’un projet ou de rayons reste une action explicite. Aucun achat local n’est envoyé automatiquement.

La connexion directe actuellement implémentée concerne les courses. Les priorités quotidiennes utilisent encore la connexion Node optionnelle, ou les tâches locales du cadre. La connexion des courses ne doit pas être présentée comme une connexion des priorités.

## Perso, Myrak et Travail

Ces calendriers ne sont pas encore autorisés. Le code actuel utilise les applications Microsoft Entra et Google Cloud du [guide CONNEXIONS.md](CONNEXIONS.md), avec le serveur Node optionnel pour l’échange et le renouvellement des jetons. Être connecté à Outlook ou Gmail dans Chrome ne remplit pas ces réglages.

Pour une version entièrement sans serveur personnel, il reste à remplacer ces flux par des clients OAuth de navigateur et à enregistrer leurs applications/retours appropriés. Ne pas ajouter de secret d’application dans le frontend pour contourner cette étape.

## Home Assistant

Ouvrir **Réglages → Domotique** après avoir préparé l’instance Home Assistant. Renseigner son URL et son jeton dans Hub ; le jeton reste en mémoire. Depuis le site HTTPS, utiliser une instance également accessible en HTTPS. Les appareils réels apparaissent seulement après connexion. Voir [DOMOTIQUE.md](DOMOTIQUE.md).
