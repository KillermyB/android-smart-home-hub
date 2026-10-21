# Démarrage et adresse réseau du cadre

## État du 21 octobre 2026

Le cadre a été identifié à nouveau par USB : sun8i, Android 6.0.1, modèle logiciel AEEZO, build du 29 mai 2026. Hub v0.15.2 reste installé. Le Wi-Fi utilise encore DHCP ; aucune adresse fixe n’est appliquée. L’ancienne option de démarrage SimpleSSHD reste bloquée par le filtre constructeur `BOOT_COMPLETED`.

Les deux scripts ci-dessous sont **installés après accord explicite du propriétaire**. La validation automatique avait d’abord refusé cette modification système ; l’accord précis sur le fichier, le mécanisme et le risque a permis son installation. Le fichier d’origine reste sauvegardé avec son empreinte vérifiée, et `/system` a été remis en lecture seule. Le dernier redémarrage a confirmé le retour du serveur local, de SSH avec son pare-feu et de Hub dans un seul onglet Firefox, sans relance manuelle. Le plein écran HTML a été réactivé ensuite par son bouton : cette dernière étape n’est pas automatique. Les contrôles figurent dans `VERIFICATION.md`.

## Solution proposée sans remplacer AiMOR

- `scripts/frame-autostart.sh` attend la fin du démarrage Android pendant trois minutes au maximum, relance le serveur HTTP lié uniquement à `127.0.0.1:4173`, rétablit le pare-feu SSH limité au Mac autorisé, lance SimpleSSHD puis réouvre Firefox par son activité principale. Il ne demande pas une nouvelle URL, afin de retrouver l’onglet existant sans le dupliquer.
- `scripts/frame-install-autostart.sh` est spécifique au fichier original de ce firmware. Il refuse une autre identité, une autre empreinte ou une sauvegarde déjà présente. Il sauvegarde le fichier original, ajoute seulement un appel asynchrone au script Hub et remplace atomiquement `/system/bin/install-recovery.sh`, puis remet `/system` en lecture seule, y compris après une erreur intermédiaire.
- Le contenu d’origine du script constructeur reste intact, avant l’ajout. Aucun flash de partition, remplacement du launcher, effacement de Firefox, ouverture Internet ni nouvel identifiant SSH n’est prévu.
- L’adresse IPv4 du Mac autorisé est conservée dans `/data/local/hub/maintenance-ip`, hors Git. Elle doit correspondre au filtre du shell SSH existant. Un changement DHCP du Mac peut demander une correction par USB ; ne pas élargir le filtre pour contourner ce contrôle.
- Le verrou du script évite deux lancements simultanés. `/data/local/hub/autostart.disabled` permet de le neutraliser sans toucher à Android.

L’ajout au fichier système nécessite un accord explicite : une écriture défectueuse peut nécessiter une restauration USB. Cet accord a été reçu pour cet exemplaire. Les sauvegardes privées de boot et bootloader ont été relues et leurs empreintes vérifiées ; l’archive de données a été relue et contient 332 entrées. Ce n’est pas une sauvegarde complète de toutes les partitions. L’installateur refuse une deuxième installation sur un fichier déjà modifié ; les évolutions du script dans `/data/local/hub/` ne nécessitent pas de nouvelle écriture système.

## Contrôles d’installation

1. Réidentifier le cadre et vérifier les sauvegardes. Garder l’USB connecté.
2. Copier les scripts dans `/data/local/hub/`, puis vérifier leur syntaxe sur Android. Le fichier `maintenance-ip` doit rester privé et contenir uniquement l’IPv4 autorisée.
3. Tester le script de lancement seul, sans réexécuter le script constructeur de restauration recovery.
4. Exécuter l’installateur approuvé et confirmer que `/system` est revenu en lecture seule.
5. Redémarrer réellement Android. Constater, sans commande de relance manuelle : service HTTP, SSH par clé et pare-feu, Firefox sur Hub, nombre d’onglets, comptes et réglages conservés.
6. Vérifier séparément le plein écran et une coupure électrique réelle. Un redémarrage logiciel ne prouve pas une reprise après perte d’alimentation. Firefox peut demander un toucher pour réactiver le plein écran HTML.

## Retour arrière par USB

Commencer par neutraliser le lancement, sans remplacer aucun fichier système :

```sh
adb -d shell touch /data/local/hub/autostart.disabled
```

Pour restaurer le script constructeur, vérifier d’abord que la sauvegarde `/data/local/hub/install-recovery.original` porte exactement l’empreinte originale attendue par l’installateur. La copie privée relue sur le Mac offre un deuxième exemplaire. Restaurer uniquement ce fichier par copie atomique avec ses permissions d’origine, puis remettre `/system` en lecture seule. Ne pas flasher une partition pour annuler cet ajout. Les accès et fichiers Hub peuvent rester installés pour une reprise manuelle.

## Adresse IP stable

Privilégier une réservation DHCP propre au cadre dans la box, sans modifier le DHCP de toute la maison. La MAC du cadre a changé lors de redémarrages précédents : une réservation ne sera considérée comme fiable qu’après vérification de la même identité réseau lors d’un redémarrage supplémentaire. Ne pas attribuer arbitrairement une IP située dans le pool DHCP.

La box locale a été retrouvée, mais son interface HTTPS affiche un avertissement de certificat. Le propriétaire doit le franchir lui-même et se connecter ; cette étape n’a pas été contournée. La réservation reste à effectuer et à contrôler. Trois redémarrages ont encore montré des identités MAC et adresses DHCP différentes : ne pas promettre une réservation durable basée uniquement sur la MAC actuellement affichée. Une IP statique dans le profil Wi-Fi du cadre est une autre option, une fois le pool DHCP connu et l’adresse exclue/réservée dans la box. Les adresses et identifiants privés restent dans les fichiers de maintenance hors Git.
