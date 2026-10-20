# Connexions

Configurer depuis un navigateur sur la tour à `http://localhost:4173`. Redémarrer `npm start` après toute modification de `.env`.

## Todoist

Dans Todoist : Paramètres → Intégrations → Développeur → jeton API. Copier le jeton dans `TODOIST_API_TOKEN` du fichier **local** `.env`. Ne pas le coller dans GitHub ni dans un message public.

Le serveur utilise l’[API v1 officielle](https://developer.todoist.com/api/v1/) : tâches du jour/en retard, ajout avec échéance aujourd’hui, validation par `/tasks/{id}/close`. Les tâches ne sont cochées qu’après confirmation du service. La suppression proposée pour les exemples ne supprime aucune tâche distante.

## Microsoft : personnel et travail

1. Enregistrer une application Web dans [Microsoft Entra](https://entra.microsoft.com/).
2. Pour une application couvrant les deux types de comptes, sélectionner comptes de tous les annuaires professionnels **et** comptes Microsoft personnels.
3. Ajouter les deux URI de retour de plateforme **Web** :
   - `http://localhost:4173/auth/callback/outlook`
   - `http://localhost:4173/auth/callback/work`
4. Ajouter la permission déléguée Microsoft Graph `Calendars.Read`. Le flux demande aussi `offline_access` pour renouveler l’accès.
5. Renseigner `MICROSOFT_CLIENT_ID` et `MICROSOFT_CLIENT_SECRET` dans `.env`. `MICROSOFT_TENANT=common` convient au cas mixte ; la politique de l’entreprise peut imposer une validation administrateur.
6. Dans Smart Hub → Réglages → connecter Outlook personnel, puis Outlook travail en choisissant chaque fois le bon compte.

Le serveur liste les calendriers du compte et leurs événements, avec pagination, entre 60 jours avant et 120 jours après le jour courant. Les récurrences sont développées par [calendarView](https://learn.microsoft.com/en-us/graph/api/calendar-list-calendarview?view=graph-rest-1.0). Les événements sur plusieurs jours sont, pour cette première version, affichés sur leur jour de départ uniquement. Les calendriers partagés par délégation ne sont pas encore gérés explicitement.

## Google Agenda

1. Créer un projet dans [Google Cloud Console](https://console.cloud.google.com/) et activer **Google Calendar API**.
2. Configurer l’écran de consentement. En mode test, ajouter l’adresse Gmail comme utilisateur test.
3. Créer un client OAuth de type **Application Web**, avec l’URI de retour `http://localhost:4173/auth/callback/google`.
4. Renseigner `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` dans `.env`.
5. Réglages → Google Agenda → Connecter.

Le scope [`calendar.readonly`](https://developers.google.com/workspace/calendar/api/auth) permet de lister les calendriers et lire leurs événements. Aucune permission Gmail n’est demandée. Selon l’état de publication de l’application Google, il faudra ajuster le consentement pour un fonctionnement durable.

## Météo

Choisir la ville dans les réglages puis sélectionner le bon résultat. Géocodage et prévisions utilisent [Open-Meteo](https://open-meteo.com/). La météo n’utilise pas la géolocalisation du navigateur. Pour le moment, elle est actualisée lors du choix de la ville ; une actualisation régulière reste à ajouter. Une valeur conservée est accompagnée de son heure de mise à jour.

## Accès du cadre au serveur de la tour

En premier lieu, garder `HOST=127.0.0.1` et vérifier l’interface sur la tour. Ensuite, pour un essai sur le réseau de confiance :

1. Définir `HOST=0.0.0.0` et un `HUB_ACCESS_TOKEN` aléatoire d’au moins 24 caractères.
2. Garder `BASE_URL=http://localhost:4173` pour autoriser les comptes depuis le navigateur de la tour.
3. Autoriser le port TCP 4173 sur le **réseau privé** Windows si nécessaire ; ne pas le rediriger sur Internet.
4. Ouvrir `http://ADRESSE_LOCALE_DE_LA_TOUR:4173` sur le cadre, puis saisir le code d’association. Il est conservé dans un cookie HttpOnly, pas dans le JavaScript.

Ce mode LAN HTTP est réservé à un réseau de confiance. Pour un usage permanent, prévoir un transport HTTPS et une gestion des appareils avec révocation. L’aperçu hébergé statique ne contient pas ce serveur privé et ne connecte pas les comptes.
