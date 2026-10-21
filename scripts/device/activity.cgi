#!/system/bin/sh
# An authenticated countdown deadline only, never a command or reboot endpoint.
BASE=/data/local/hub
BB=/system/bin/busybox-smp
reply(){ printf 'Status: %s\r\nContent-Type: application/json\r\nCache-Control: no-store\r\n\r\n%s\n' "$1" "$2"; exit 0; }
[ "$REMOTE_ADDR" = 127.0.0.1 ] && [ "$HTTP_HOST" = 127.0.0.1:4173 ] || reply '403 Forbidden' '{}'
case "$HTTP_REFERER" in http://127.0.0.1:4173/*) ;; *) reply '403 Forbidden' '{}';; esac
[ "$(getprop ro.hardware)" = sun8i ] && [ "$(getprop ro.build.version.release)" = 6.0.1 ] || reply '503 Service Unavailable' '{}'
[ "$REQUEST_METHOD" = POST ] && [ "$CONTENT_TYPE" = application/json ] || reply '405 Method Not Allowed' '{}'
case "$CONTENT_LENGTH" in ''|*[!0-9]*) reply '400 Bad Request' '{}';; esac
[ "$CONTENT_LENGTH" -ge 86 ] && [ "$CONTENT_LENGTH" -le 100 ] || reply '400 Bad Request' '{}'
key=$(cat "$BASE/screen-key" 2>/dev/null)
[ ${#key} -eq 64 ] || reply '503 Service Unavailable' '{}'
body=$("$BB" head -c "$CONTENT_LENGTH")
seconds=$(printf '%s' "$body" | "$BB" sed -n 's/^{"seconds":\([0-9][0-9]*\),.*$/\1/p')
case "$seconds" in ''|*[!0-9]*|0[0-9]*) reply '400 Bad Request' '{}';; esac
[ "$seconds" -le 86400 ] && [ "$body" = "{\"seconds\":$seconds,\"key\":\"$key\"}" ] || reply '403 Forbidden' '{}'
until=0
[ "$seconds" -eq 0 ] || until=$(( $(date +%s) + seconds + 120 ))
umask 077
printf '%s\n' "$until" > "$BASE/activity-until.next" && mv "$BASE/activity-until.next" "$BASE/activity-until" || reply '500 Internal Server Error' '{}'
reply '200 OK' '{"native":true,"saved":true}'
