# Installer Hub. sur le cadre

Guide de reprise pour la livraison **v0.6.0**. Dépôt privé créé : [KillermyB/smart-hub](https://github.com/KillermyB/smart-hub). Le push et le tag `v0.6.0` doivent être vérifiés après leur publication.

Le code peut être récupéré sur la tour Windows. Le cadre, lui, doit ouvrir Hub. dans un navigateur compatible : il n’a pas besoin de Git ou de Node.js. L’installation physique n’a pas encore été validée sur cet exemplaire AiMOR.

## 1. Récupérer le projet sur la tour

Après publication du dépôt `KillermyB/smart-hub`, installer Git et Node.js 22.9 ou plus récent, puis ouvrir PowerShell dans le dossier où conserver le projet :

```powershell
git clone https://github.com/KillermyB/smart-hub.git
Set-Location .\smart-hub
node --version
npm run check
npm test
npm start
```

Un dépôt privé demande une connexion GitHub autorisée. Utiliser le gestionnaire d’identifiants de Git ou GitHub Desktop ; ne pas inscrire de jeton dans l’adresse du dépôt ou dans un fichier du projet.

Ouvrir `http://localhost:4173/` sur la tour. Aucun `npm install` n’est nécessaire pour cette version. `npm start` fonctionne sans `.env` pour l’interface et les fonctions locales. Arrêter avec `Ctrl+C`.

Pour une mise à jour ultérieure, arrêter l’aperçu puis vérifier qu’aucun travail local n’est en cours :

```powershell
git status --short
git pull --ff-only
npm run check
npm test
npm start
```

Si `git status` affiche des fichiers modifiés, les conserver et les examiner avant la mise à jour. Ne pas utiliser de réinitialisation forcée.

## 2. Choisir le mode d’affichage

| Mode | Ce qui reste nécessaire | Services disponibles |
| --- | --- | --- |
| Site privé HTTPS — conseillé sans serveur personnel | Navigateur compatible sur le cadre, accès Internet et compte autorisé sur le site | Fonctions locales, météo, GitHub public, courses Todoist et télécommande Spotify après configuration |
| Aperçu sur la tour | Tour allumée, Node et configuration LAN documentée | Même interface, plus anciennes connexions calendriers/tâches du serveur Node après configuration |

Adresse du site privé : **https://smart-hub-maison.kbo1.chatgpt.site/**.

Le premier mode n’impose pas de garder la tour allumée. Copier `dist/` sur le cadre et ouvrir `index.html` en `file://` n’est pas le parcours prévu : le site HTTPS fournit l’origine stable nécessaire aux données locales et aux connexions du navigateur.

Les fichiers GitHub sont le code de l’application. Ils ne contiennent pas les favoris, recettes personnelles, photos, notes ou jetons d’un navigateur. `localhost`, le site hébergé et chaque appareil gardent des copies différentes. Pour le transfert manuel des notes/photos/recettes, consulter [TRANSFERT-LOCAL.md](TRANSFERT-LOCAL.md). Ne pas effacer les données du navigateur avant d’avoir conservé les exports utiles.

## 3. Vérifier l’accès USB et l’identité du cadre

Utiliser un câble **USB-A → USB-C de données connu**, branché directement sur un port USB-A de la tour. Vérifier que le cadre est alimenté et laisse démarrer AiMOR. Un câble de charge seul ne permet pas ADB.

Le menu de test a été passé sur `IS OPEN` pendant la session Mac, sans obtenir d’accès ADB. Vérifier son état après redémarrage en suivant [CADRE-WINDOWS.md](CADRE-WINDOWS.md), qui décrit le menu du firmware photographié.

Télécharger les [Android SDK Platform-Tools officiels pour Windows](https://developer.android.com/tools/releases/platform-tools), extraire l’archive puis ouvrir PowerShell dans le dossier `platform-tools` :

```powershell
.\adb.exe devices -l
```

- Si l’état est `unauthorized`, regarder si une demande de débogage apparaît sur le cadre.
- Si aucun appareil n’apparaît, contrôler le câble de données, le port USB-A et l’alimentation avant toute installation.
- Si un seul cadre est connecté et son état est `device`, relever son identité en lecture seule :

```powershell
.\adb.exe -d shell id
.\adb.exe -d shell getprop ro.hardware
.\adb.exe -d shell getprop ro.build.version.release
.\adb.exe -d shell getprop ro.build.display.id
.\adb.exe -d shell wm size
.\adb.exe -d shell dumpsys package com.android.webview
```

Comparer ces résultats à [CADRE-WINDOWS.md](CADRE-WINDOWS.md). Le modèle PF1007 et le firmware photographié sont connus ; Android, architecture, résolution et version WebView de cet appareil doivent être confirmés. Si l’identité diffère, ne pas appliquer une procédure destinée à un autre matériel.

Conserver les sorties ADB, numéros de série, adresses réseau et captures de diagnostic dans un dossier privé **hors du dépôt Git**. L’adresse IP peut changer au redémarrage ; aucune ancienne adresse ne doit servir de valeur par défaut. Le port AiMOR 8086 n’est pas ADB.

## 4. Sauvegarder avant d’installer un navigateur

La cible de l’interface est **Chrome/WebView 106 ou plus récent**. L’accès ADB ne prouve pas que ce navigateur fonctionne sur le cadre. Le choix exact du navigateur et de son APK reste à valider après les lectures ci-dessus ; aucun APK ni commande d’installation non vérifiés ne sont inclus ici.

Avant une installation sur l’appareil :

1. Identifier le matériel réel et conserver les lectures de diagnostic.
2. Suivre la sauvegarde adaptée au modèle dans le guide matériel référencé par [CADRE-WINDOWS.md](CADRE-WINDOWS.md).
3. Vérifier les tailles et empreintes des sauvegardes et le moyen de les relire. Ne pas copier une image binaire avec une redirection PowerShell 5 `>` qui peut altérer les octets.
4. Conserver AiMOR et l’accès aux réglages Android. Commencer par une application navigateur utilisateur compatible, sans modification du système.

Ne pas flasher `boot` ou `system`, remplacer le launcher, désactiver AiMOR ou exposer ADB sur le réseau pour afficher cette interface. Aucune de ces opérations n’est nécessaire au premier essai dans un navigateur utilisateur.

## 5. Premier essai sur le vrai panneau

Une fois le navigateur compatible installé et la sortie vers les réglages confirmée physiquement, ouvrir le site HTTPS et vérifier à la main :

- Heure/fuseau, heures des rendez-vous de l’agenda 24 h, repères Perso/Myrak/Travail, marges et météo de la vraie ville.
- Navigation, défilement, clavier tactile et fermeture des fenêtres avec un seul doigt.
- Mode sombre, écran de veille, citations et réveil au toucher.
- Minuteur qui reste visible en changeant de page ; son alerte est visuelle, aucune sonnerie Android n’est garantie.
- Cuisine, favoris, plats retirés, portions et courses.
- Sélecteurs de fichiers, export/import du compagnon et ouverture/retour des liens web.
- Déconnexion Wi-Fi, reprise après redémarrage et chemin de retour vers AiMOR/réglages.

Faire ces essais avant d’envisager un démarrage automatique ou un mode kiosk. Un clic injecté depuis ADB ne valide pas le tactile réel, et une capture du navigateur sur la tour ne valide pas les performances du cadre.

## 6. Connecter les comptes sur le cadre

**Météo et GitHub public** : choisir la ville dans les réglages ; le compte GitHub public est configurable dans sa tuile. Ces services ne nécessitent pas de serveur personnel.

**Courses Todoist** : ouvrir Courses depuis Cuisine ou Réglages, saisir le jeton soi-même, puis choisir le projet. La liste locale reste distincte ; elle n’est pas transférée automatiquement. Le partage avec le téléphone se fait via le même projet Todoist. Le jeton reste dans la session de l’onglet et peut devoir être ressaisi après sa fermeture complète.

**Spotify** : utiliser le site HTTPS et le Client ID public d’une application Spotify correctement configurée. L’adresse de retour doit correspondre exactement à celle indiquée dans le lecteur. `localhost` n’est pas accepté par Spotify ; pour le développement local, utiliser `http://127.0.0.1:4173/`. Le cadre pilote un appareil Spotify existant : il ne devient pas un haut-parleur Spotify. Le contrôle nécessite Premium, les permissions de l’application et un appareil actif. Voir [COURSES-SPOTIFY.md](COURSES-SPOTIFY.md).

**Calendriers Perso, Myrak et Travail** : sélectionner et autoriser les trois comptes attendus séparément. Le bleu Myrak et les autres repères visuels identifient les sources ; ils ne prouvent pas une connexion. Les flux Outlook/Google et tâches Todoist via Node utilisent encore le serveur local de la tour et ne sont pas activés par le site statique. Leur configuration reste dans [CONNEXIONS.md](CONNEXIONS.md). Si le choix reste « aucun serveur personnel », les connexions calendriers ne fonctionneront pas encore en permanence sur le site statique.

Pour un essai LAN avec la tour, suivre les réglages `HOST`, `HUB_ACCESS_TOKEN` et l’association décrits dans [CONNEXIONS.md](CONNEXIONS.md). Ne pas rediriger le port vers Internet. Le site HTTPS reste le choix adapté à la connexion Spotify sur le cadre.

**Paroles LRCLIB** : le chargement en mode focus est automatique si l’option est activée, avec les métadonnées du morceau. Il peut être désactivé dans les réglages Spotify ; le bouton « Afficher la pochette » masque les paroles du morceau courant. La disponibilité et la synchronisation doivent être testées dans le navigateur du cadre. Le logiciel LRCLIB est sous MIT, mais cette licence ne donne pas de droits sur les paroles renvoyées ; aucun texte de chanson n’est intégré au projet.

## État de la livraison

La publication du code GitHub, la publication du site, les autorisations des comptes et l’installation physique sont quatre validations distinctes. Ce guide prépare la reprise sur la tour ; il ne constitue pas une preuve d’installation sur le cadre.

**Home Assistant** : l’interface est prévue dans Réglages → Domotique. Une instance Home Assistant existante et accessible depuis le cadre est nécessaire ; HTTPS est requis depuis le site HTTPS. Le jeton reste uniquement en mémoire, et aucun appareil réel n’est validé à ce stade. Voir [DOMOTIQUE.md](DOMOTIQUE.md).
