# À garder, sans serveur

Le compagnon est une page de la même application. Sur le téléphone, ouvrir l’adresse habituelle avec `?companion=1`, par exemple https://smart-hub-maison.kbo1.chatgpt.site/?companion=1. L’accès au site privé demande le compte autorisé ; aucune nouvelle autorisation de service n’est ajoutée.

1. Choisir une note, une photo, un lien ou une recette complète, puis « Garder sur cet appareil ».
2. Appuyer sur « Exporter le fichier ». Le fichier JSON contient les éléments de cette collection, y compris les photos préparées.
3. Transférer ce fichier au cadre par un moyen disponible sur les appareils (copie USB, partage de fichiers du système, etc.). Aucune de ces méthodes n’est activée automatiquement par Hub.
4. Ouvrir « À garder » sur le cadre, puis « Importer un fichier ». Les nouvelles entrées sont ajoutées ; un identifiant déjà présent n’est ni dupliqué ni écrasé.
5. Pour une recette complète importée, appuyer sur « Ajouter au carnet » pour cuisiner avec les étapes et les courses. Une recette du carnet peut aussi être exportée individuellement.

Il n’y a ni serveur de synchronisation ni envoi automatique. Le téléphone, le cadre, localhost et le site hébergé gardent chacun leurs données. Effacer les données du navigateur efface la copie locale : conserver les fichiers exportés. Ces fichiers ne sont pas chiffrés ; les transmettre comme des documents personnels.

La collection utilise IndexedDB : 100 éléments, six photos, transfert de 10 Mo au maximum. Photos JPEG/PNG/WebP de moins de 12 Mo à l’entrée, redimensionnées à 1280 px au plus et converties en JPEG sans métadonnées originales. Les liens acceptent uniquement HTTP/HTTPS et refusent les identifiants incorporés dans l’adresse. Les données importées sont validées avant enregistrement.

L’export de la collection ne contient pas les favoris, repas, tâches, réglages ni tout le carnet de cuisine. Une sauvegarde générale reste à développer. Le navigateur et les sélecteurs de fichiers du vrai cadre restent à vérifier après installation.

# Liens web sur le cadre

« Cuisine → Liens web » permet de conserver des adresses et d’ouvrir la page d’origine dans un nouvel onglet. Fermer cet onglet pour revenir à Hub. Les étapes ne sont pas extraites automatiquement. Un site externe nécessite Internet et peut afficher ses propres publicités ou demandes de consentement.

Cela suppose un navigateur Android compatible sur le cadre, acceptant les nouveaux onglets. Le code web ne remplace ni n’installe ce navigateur. L’installation et le retour fiable à Hub. restent à valider sur le matériel ; consulter CADRE-WINDOWS.md avant toute intervention.
