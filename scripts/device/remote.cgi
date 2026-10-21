#!/system/bin/sh
# Only fixed operations and base64 data; never evaluate client data as shell/paths.
BASE=/data/local/hub
BB=/system/bin/busybox-smp
STORE=$BASE/remote-data
reply() {
    printf 'Status: %s\r\nContent-Type: application/json\r\nCache-Control: no-store\r\nX-Content-Type-Options: nosniff\r\nReferrer-Policy: no-referrer\r\n\r\n%s\n' "$1" "$2"
    exit 0
}
[ -f "$BASE/remote-enabled" ] || reply '503 Service Unavailable' '{"error":"Télécommande désactivée sur le cadre."}'
[ -z "$QUERY_STRING" ] || reply '400 Bad Request' '{}'
ip=$($BB ip -f inet addr show wlan0 | $BB awk '/inet /{split($2,a,"/");print a[1];exit}')
local=false
if [ "$REMOTE_ADDR" = 127.0.0.1 ] && [ "$HTTP_HOST" = 127.0.0.1:4173 ]; then
    case "$HTTP_REFERER" in http://127.0.0.1:4173/*) local=true;; *) reply '403 Forbidden' '{}';; esac
else
    [ "$HTTP_HOST" = "$ip:4180" ] && [ "$HTTP_ORIGIN" = "http://$ip:4180" ] || reply '403 Forbidden' '{}'
    # A remote phone must be on this Wi-Fi /24, never another interface or Internet.
    [ "${REMOTE_ADDR%.*}" = "${ip%.*}" ] || reply '403 Forbidden' '{}'
fi
umask 077
now=$(date +%s)
if [ "$REQUEST_METHOD" = GET ] && [ "$local" = true ]; then
    [ "$1" = locked ] || exec "$BB" flock -x "$STORE/queue.lock" /system/bin/sh "$0" locked
    key=$(cat "$STORE/access-key")
    printf 'Content-Type: application/json\r\nCache-Control: no-store\r\n\r\n{"key":"%s","url":"http://%s:4180/","commands":[' "$key" "$ip"
    sep=''
    for id in $(cat "$STORE/order" 2>/dev/null); do
        [ ${#id} -eq 32 ] || continue
        case "$id" in *[!a-f0-9]*) continue;; esac
        file=$STORE/$id.cmd
        [ -f "$file" ] || continue
        created=$($BB head -n 1 "$file")
        [ $((now-created)) -le 30 ] || { rm "$file"; continue; }
        # Claim before dispatch. An interrupted command is never replayed.
        mv "$file" "$STORE/$id.run"
        payload=$($BB tail -n 1 "$STORE/$id.run")
        printf '%s{"id":"%s","payload":"%s"}' "$sep" "$id" "$payload"
        sep=,
    done
    : >"$STORE/order"
    printf ']}\n'
    exit 0
fi
[ "$REQUEST_METHOD" = POST ] && [ "$CONTENT_TYPE" = text/plain ] || reply '405 Method Not Allowed' '{}'
case "$CONTENT_LENGTH" in ''|*[!0-9]*) reply '400 Bad Request' '{}';; esac
[ "$CONTENT_LENGTH" -ge 70 ] && [ "$CONTENT_LENGTH" -le 90000 ] || reply '413 Payload Too Large' '{}'
body=$("$BB" timeout -t 4 "$BB" head -c "$CONTENT_LENGTH") || reply '408 Request Timeout' '{}'
[ ${#body} -eq "$CONTENT_LENGTH" ] || reply '400 Bad Request' '{}'
[ "$(printf '%s' "$body" | $BB awk 'END {print NR}')" = 4 ] || reply '400 Bad Request' '{}'
key=$(printf '%s' "$body" | $BB sed -n '1p')
op=$(printf '%s' "$body" | $BB sed -n '2p')
id=$(printf '%s' "$body" | $BB sed -n '3p')
payload=$(printf '%s' "$body" | $BB sed -n '4p')
if [ "$local" = true ]; then expected=$(cat "$BASE/screen-key"); else expected=$(cat "$STORE/access-key"); fi
[ ${#key} -eq 64 ] && [ "$key" = "$expected" ] || reply '403 Forbidden' '{"error":"Association expirée. Scanne à nouveau le QR du cadre."}'
# Never hold the shared lock while reading an unauthenticated network body.
if [ "$1" != locked ]; then
    printf '%s' "$body" | "$BB" flock -x "$STORE/queue.lock" /system/bin/sh "$0" locked
    exit $?
fi
# Retain an uncertain result, but release capacity after an interrupted browser.
for file in "$STORE"/*.run; do
    [ -f "$file" ] || continue
    started=$("$BB" stat -c %Y "$file")
    if [ $((now-started)) -gt 45 ]; then
        file_id=${file##*/}; file_id=${file_id%.run}
        printf '%s' '{"ok":false,"message":"Résultat non confirmé. Vérifie l’état avant de réessayer."}' | "$BB" base64 | "$BB" tr -d '\n' >"$STORE/$file_id.result"
        rm "$file"
    fi
done
valid_payload() { case "$payload" in ''|*[!A-Za-z0-9+/=]*) return 1;; esac; }
valid_id() { [ ${#id} -eq 32 ] || return 1; case "$id" in *[!a-f0-9]*) return 1;; esac; }
case "$op" in
    publish)
        [ "$local" = true ] && valid_payload || reply '403 Forbidden' '{}'
        printf '%s\n' "$payload" >"$STORE/snapshot.next" && mv "$STORE/snapshot.next" "$STORE/snapshot" || reply '500 Internal Server Error' '{}'
        printf '%s\n' "$now" >"$STORE/heartbeat"
        ;;
    ack)
        [ "$local" = true ] && valid_id && valid_payload && [ ${#payload} -le 2048 ] || reply '403 Forbidden' '{}'
        [ -f "$STORE/$id.run" ] || reply '409 Conflict' '{}'
        printf '%s\n' "$payload" >"$STORE/$id.result"
        rm "$STORE/$id.run"
        ;;
    revoke)
        [ "$local" = true ] || reply '403 Forbidden' '{}'
        "$BB" od -An -N32 -tx1 /dev/urandom | "$BB" tr -d ' \n' >"$STORE/access-key.next"
        [ "$(wc -c <"$STORE/access-key.next")" -eq 64 ] || reply '500 Internal Server Error' '{}'
        mv "$STORE/access-key.next" "$STORE/access-key"
        rm -f "$STORE"/*.cmd "$STORE"/*.run "$STORE"/*.result
        : >"$STORE/order"
        ;;
    send)
        [ "$local" = false ] && valid_id && valid_payload && [ ${#payload} -le 2048 ] || reply '400 Bad Request' '{}'
        beat=$(cat "$STORE/heartbeat" 2>/dev/null)
        case "$beat" in ''|*[!0-9]*) beat=0;; esac
        [ $((now-beat)) -le 15 ] || reply '503 Service Unavailable' '{"error":"Hub doit être ouvert sur le cadre. Aucune action envoyée."}'
        if [ ! -f "$STORE/$id.cmd" ] && [ ! -f "$STORE/$id.run" ] && [ ! -f "$STORE/$id.result" ]; then
            count=$(find "$STORE" -name '*.cmd' -o -name '*.run' | "$BB" wc -l)
            [ "$count" -lt 6 ] || reply '429 Too Many Requests' '{"error":"Des actions sont déjà en cours."}'
            printf '%s\n%s\n' "$now" "$payload" >"$STORE/$id.next" && mv "$STORE/$id.next" "$STORE/$id.cmd" || reply '500 Internal Server Error' '{}'
            printf '%s\n' "$id" >>"$STORE/order"
        fi
        ;;
    status)
        [ "$local" = false ] || reply '403 Forbidden' '{}'
        ;;
    *) reply '400 Bad Request' '{}';;
esac
# Bound result retention to one hour. Files only use fixed extensions/hex ids.
for file in "$STORE"/*.result "$STORE"/*.run; do
    [ -f "$file" ] || continue
    modified=$("$BB" stat -c %Y "$file")
    [ $((now-modified)) -le 3600 ] || rm "$file"
done
# Keep at most 32 recent results, even on a busy household network.
excess=$(find "$STORE" -name '*.result' | "$BB" wc -l)
if [ "$excess" -gt 32 ]; then
    "$BB" ls -t "$STORE"/*.result | "$BB" tail -n +33 | while IFS= read -r file; do rm "$file"; done
fi
if [ "$op" = status ]; then
    snapshot=$(cat "$STORE/snapshot" 2>/dev/null)
    beat=$(cat "$STORE/heartbeat" 2>/dev/null)
    case "$beat" in ''|*[!0-9]*) beat=0;; esac
    printf 'Content-Type: application/json\r\nCache-Control: no-store\r\n\r\n{"heartbeat":%s,"snapshot":"%s","results":[' "$beat" "$snapshot"
    sep=''
    for file in "$STORE"/*.result; do
        [ -f "$file" ] || continue
        id=${file##*/}; id=${id%.result}; result=$(cat "$file")
        printf '%s{"id":"%s","value":"%s"}' "$sep" "$id" "$result"; sep=,
    done
    printf ']}\n'; exit 0
fi
reply '200 OK' '{"accepted":true}'
