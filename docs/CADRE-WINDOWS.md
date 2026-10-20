# Reprise sur la tour Windows

## Matériel identifié sur la photo

- À propos : PF1007.
- Firmware : `YHK.F-null-A33-1001-D1024-PF1007L-V10-1680.0.20260529`.
- Famille correspondante documentée : Allwinner A33 / PF1007L. Android 6.0.1, ARMv7 et 1280 × 800 sont rapportés sur le même firmware, **à confirmer par ADB sur cet exemplaire**.
- « IS OPEN » a été activé par l’utilisateur. L’accès USB n’a pas pu être établi sur le Mac, malgré plusieurs branchements.
- AiMOR répondait sur TCP 8086 ; TCP 5555 était fermé. **8086 est un service de fichiers AiMOR, pas ADB.**

Sources principales : [guide PF1007L](https://github.com/wesbos/photo-frame-dashboard/blob/main/docs/pf1007l-start-here.md), [rapport du menu de test sur le firmware exact](https://github.com/wesbos/photo-frame-dashboard/issues/135), [méthode Wi-Fi sur ce firmware](https://github.com/wesbos/photo-frame-dashboard/issues/117).

## 1. Connexion USB

Utiliser un **câble USB-A → USB-C de données connu**, connecté à un port USB-A de la tour. Le même câble doit alimenter le cadre. Un câble qui recharge seulement ne suffit pas. Si le cadre reste noir, vérifier le câble, le port et l’alimentation ; ne pas conclure à une panne firmware.

Laisser démarrer AiMOR. Dans À propos, toucher plusieurs fois Model. Le rapport indique le mot de passe de menu de test `YHK88888888`, puis basculer `IS CLOSED` vers `IS OPEN`. Le contrôle a déjà été activé pendant la session ; vérifier son état après redémarrage.

## 2. Outils officiels et diagnostic

Télécharger [Android SDK Platform-Tools pour Windows](https://developer.android.com/tools/releases/platform-tools). Ouvrir PowerShell dans le dossier `platform-tools` extrait :

```powershell
.\adb.exe devices -l
Get-PnpDevice -PresentOnly | Where-Object InstanceId -Match 'VID_1F3A'
```

- `device` : continuer avec les lectures ci-dessous.
- `unauthorized` : accepter la demande de débogage si elle s’affiche sur le cadre.
- `VID_1F3A` détecté sans ADB : noter le PID exact et consulter le tableau du guide.
- Aucun périphérique USB : vérifier le câble et le port avant tout logiciel, pilote ou flashage.

Si un seul cadre est branché en USB :

```powershell
.\adb.exe -d shell id
.\adb.exe -d shell getprop ro.hardware
.\adb.exe -d shell getprop ro.build.version.release
.\adb.exe -d shell getprop ro.build.display.id
.\adb.exe -d shell wm size
.\adb.exe -d shell dumpsys package com.android.webview
```

Ces lectures ne modifient pas le cadre. Conserver les sorties privées et comparer au guide avant installation.

## 3. Sauvegarder et choisir l’affichage

La suite dépend des résultats réels. Le WebView stock est rapporté comme Chrome 44 sur cette famille ; le projet vise un navigateur **Chrome/WebView 106 ou plus récent**. Avoir ADB ne prouve pas que ce navigateur est disponible.

Avant toute modification système, suivre les sauvegardes du [guide matériel](https://github.com/wesbos/photo-frame-dashboard/blob/main/docs/allwinner-a33-pf1007l.md). Sur Windows, **ne pas copier une image binaire avec `adb ... > fichier.img` dans Windows PowerShell 5** : cette redirection peut corrompre le contenu. Utiliser une méthode binaire contrôlée et vérifier les tailles et empreintes.

Pour le premier essai, privilégier une application navigateur utilisateur compatible plutôt qu’une réécriture du système. Ne remplacer le launcher ou WebView qu’après sauvegarde vérifiée et identification du matériel. Le choix du navigateur/APK et son fonctionnement physique restent à valider.

Une fois le navigateur disponible, il ouvre l’adresse LAN du serveur de la tour. La tour doit rester allumée pendant l’utilisation. Vérifier par toucher réel : navigation, défilement, clavier, sortie vers les réglages Android et retour à AiMOR. Ne pas désactiver AiMOR avant d’avoir confirmé un chemin de retour et un accès de maintenance durable.

## 4. Wi-Fi et limites constatées

L’IP et les derniers octets de la MAC ont changé plusieurs fois après redémarrage. La dernière IP vue sur cette session n’est pas une configuration durable. Relever la nouvelle dans le cadre ou la box.

La box identifiée est une **Sunrise Connect Box 3 Fiber F5685LGB** ; le menu AiMOR vu par l’utilisateur n’expose pas de modification IP/DNS. La tentative de préparer un relais DNS n’a donc pas été appliquée au cadre. Aucun paquet de commande ADB n’a été envoyé. Aucun firmware n’a été flashé, aucun compte externe autorisé et aucun service de la box modifié.

La [méthode réseau](https://github.com/wesbos/photo-frame-dashboard/blob/main/docs/pf1007l-20260410-network-adb.md) repose sur une redirection DNS temporaire. Elle n’est pas automatiquement disponible dans cette configuration ; ne pas toucher au DHCP de toute la maison pour contourner ce point. L’accès USB sur la tour est le prochain essai retenu.
