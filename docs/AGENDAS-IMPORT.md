# Agendas locaux et connexions directes — v0.12.0

Hub fonctionne sur le cadre sans serveur personnel. Réglages → Mes agendas permet d’importer des fichiers iCalendar `.ics` dans Perso, Myrak ou Travail. Les données restent dans le navigateur utilisé ; aucun calendrier privé n’est inclus dans le code publié.

L’import est **un instantané**, pas un abonnement automatique. Après une modification dans Google, Outlook ou iCloud, récupérer le nouveau fichier et le réimporter dans la même catégorie. Un même nom de calendrier et une même source remplacent le relevé précédent. Un import vide reste identifié comme vide ; aucune donnée d’exemple n’est ajoutée. « Retirer » efface uniquement la copie Hub, jamais l’agenda d’origine.

Les flux iCloud et Outlook lus pendant la configuration n’exposaient pas d’autorisation CORS : un site statique ne peut pas les consulter directement depuis un autre domaine. Ne pas envoyer un lien secret à un proxy CORS public. Aucune nouvelle publication ni modification du partage des calendriers n’a été effectuée.

ICAL.js 2.2.1 (MPL-2.0, fichier et licence locaux) traite RRULE, RDATE, EXDATE et les exceptions. Les heures UTC et les zones VTIMEZONE sont converties en Europe/Zurich ; les zones IANA sans définition sont résolues avec Intl. Les événements sur plusieurs jours sont répartis par jour, avec fin exclusive des journées entières. Fenêtre calculée : 60 jours avant et 365 jours après le jour courant ; recalcul au changement de jour. Limites : 10 Mo par fichier, 30 000 occurrences par série ; les fichiers trop complexes sont refusés.

## Association privée entre appareils

Réglages → Associer mes connexions accepte un fichier AES-256-GCM et un code séparé. Le code expire après 30 minutes. Le fichier peut contenir des copies ICS, le projet Todoist choisi et son jeton, ainsi qu’un relevé GitHub agrégé. Cocher « Mémoriser Todoist » seulement sur un appareil de confiance. Les agendas sont stockés localement ; la clé Todoist reste en session ou dans localStorage selon ce choix. La déconnexion Todoist efface les deux stockages.

Pour préparer un transfert, créer **hors du dépôt** un JSON de cette forme (valeurs fictives) :

```json
{
  "calendars": [{"id":"my-calendar","name":"Myrak","source":"google","text":"BEGIN:VCALENDAR..."}],
  "todoist": {"token":"YOUR_TOKEN","project":"YOUR_SHOPPING_PROJECT_ID"},
  "github": null
}
```

Les clés `todoist` et `github` sont facultatives. `calendars` reste un tableau, éventuellement vide. Les trois sources permises sont `outlook`, `google`, `work`.

```sh
node scripts/connection-pack.mjs /private/config.json /private/hub-connections.json /private/code.txt
```

Ne pas conserver fichier chiffré et code ensemble après association. Supprimer les fichiers de transfert et le JSON contenant la clé une fois les appareils associés. Un push GitHub ou une mise à jour du cadre ne transporte pas ces données.

## GitHub : commits et contributions

La recherche publique n’inclut pas les commits privés. L’API GraphQL du compte authentifié peut fournir un **calendrier de contributions agrégé**, comprenant selon GitHub commits, PR, issues et contributions privées. Ce nombre n’est pas un nombre de commits.

```sh
node scripts/github-export.mjs /private/github.json
```

Cette commande utilise `gh` déjà connecté sur l’ordinateur et exporte uniquement compte, dates et compteurs quotidiens. Aucun jeton ni nom de dépôt n’est copié dans le fichier. Importer le relevé depuis la tuile GitHub ou l’inclure dans le transfert chiffré. La tuile indique « contributions » et « Relevé importé » ; ce relevé n’est pas actualisé en arrière-plan. « Revenir aux commits publics » réactive la recherche publique périodique.
