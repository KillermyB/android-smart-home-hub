# Télécommande locale

Sur le cadre : **Réglages → Télécommande**. Scanner le QR avec le téléphone connecté au même Wi-Fi. Sur iPhone : **Partager → Sur l’écran d’accueil**. L’association est conservée sur ce téléphone.

- **Notes**, dernier onglet : envoyer jusqu’à 400 caractères, épingler sur l’accueil. Maximum 12 notes sur le cadre.
- **Domotique**, ouverte par défaut : scènes, lampes et prises, robots aspirateurs, Sonos et télévisions. Commandes selon les capacités actuelles des appareils : marche/arrêt, lecture/pause, piste précédente/suivante, volume, nettoyage/retour à la base. État confirmé lorsque disponible ; scènes, changement de piste et volume indiquent seulement « commande envoyée ». Aucun changement de page du cadre.
- **Minuteurs** : Thé, Œufs, Pâtes, Four, Lessive (1 h 05), Sèche-linge (1 h 55), Pause et durées prédéfinies. Lancement en un appui ; trois emplacements partagés avec la cuisine. Les minuteurs en cours apparaissent en premier : glisser vers la gauche ou toucher la corbeille pour supprimer sur le cadre. Le numéro et l’identité de chaque minuteur sont revérifiés avant suppression. Activer et tester le son sur le cadre. L’alerte à échéance reste celle de Hub.
- **À faire** : filtrer par projet existant, priorité et recherche, puis cocher une tâche Todoist ; courses exclues. Aucune nouvelle connexion Todoist sur le téléphone.

Le cadre doit garder Hub ouvert. Quand son navigateur est fermé ou en arrière-plan, le téléphone devient indisponible et les demandes expirent ; une nouvelle session après interruption ou rechargement refuse les demandes de l’ancienne session. Aucune répétition automatique après un résultat incertain. En cas de doute, vérifier l’état avant de renvoyer. Les grandes listes sont tronquées selon un budget de transmission, avec leur total indiqué.

## Accès et réseau

Le service tourne **sur le cadre**, aucun ordinateur/serveur supplémentaire nécessaire. Port 4180 lié uniquement à son adresse Wi-Fi privée et à son sous-réseau /24, pare-feu local ; aucune redirection Internet. L’application principale et ses réglages natifs restent sur 127.0.0.1:4173. Les deux racines HTTP sont distinctes.

Le QR contient une clé de télécommande privée de 256 bits, indépendante de SSH et des comptes. Elle permet d’accéder aux notes, minuteurs, appareils domotiques et tâches : ne pas partager sa capture. La clé est retirée du fragment d’URL après association. **Révoquer les téléphones** génère une nouvelle clé et invalide les anciens liens. Les jetons Home Assistant/Todoist restent dans le navigateur du cadre et ne sont pas exportés.

Le service local utilise **HTTP sans TLS** : clé et contenus ne sont pas chiffrés sur le Wi-Fi. Réservé au réseau domestique de confiance ; ne pas ouvrir le port sur Internet. Ce n’est pas une application native ni une PWA hors ligne. Si DHCP change l’adresse du cadre après redémarrage, rescanner son QR ; aucun faux nom hub.local n’est annoncé.

Activation persistante autorisée et vérifiée sur le cadre le 21 octobre 2026. La page mobile et la lecture des états associés répondent sur le Wi-Fi ; l’essai sur le téléphone réel reste à faire.

## Maintenance

```sh
npm run frame -- remote-enable --config /chemin/prive/connection.json
npm run frame -- remote-disable --config /chemin/prive/connection.json
```

Activation explicite sur le matériel vérifié. La désactivation arrête uniquement le listener reconnu, révoque l’association et efface la copie filtrée des états ; elle ne supprime pas les notes, minuteurs ou connexions de Hub. Les scripts existants relancent le service activé au démarrage et vérifient son processus toutes les 30 secondes. Une vraie coupure électrique reste distincte d’un test logiciel.

QR généré localement avec [Project Nayuki](https://www.nayuki.io/page/qr-code-generator-library), licence MIT conservée dans le fichier embarqué. Aucun service externe ne reçoit le QR.

## Icône et autres écrans

Icône de navigateur dédiée et icône Apple 180 × 180 intégrées. Sur iPhone, créer le raccourci depuis Safari → Partager → Sur l’écran d’accueil. Un ancien raccourci peut garder son ancienne icône et nécessiter d’être recréé. L’installation réelle sur iPhone reste à confirmer.

Une télécommande commune avec ScreenK/Raspberry est prévue pour la suite : le transport et l’authentification de cette autre télécommande restent à examiner. Aucun contrôle ni partage de clés entre les deux systèmes n’est encore configuré. Les adresses locales fournies restent dans les notes privées hors Git.
