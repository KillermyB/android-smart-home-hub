#!/system/bin/sh
# Narrow, loopback-only native display control. Never accepts shell commands.
BASE=/data/local/hub
reply() {
    printf 'Status: %s\r\nContent-Type: application/json\r\nCache-Control: no-store\r\nX-Content-Type-Options: nosniff\r\n\r\n%s\n' "$1" "$2"
    exit 0
}
[ "$REMOTE_ADDR" = 127.0.0.1 ] && [ "$HTTP_HOST" = 127.0.0.1:4173 ] || reply '403 Forbidden' '{}'
case "$HTTP_REFERER" in http://127.0.0.1:4173/*) ;; *) reply '403 Forbidden' '{}';; esac
[ "$(getprop ro.hardware)" = sun8i ] && [ "$(getprop ro.build.version.release)" = 6.0.1 ] || reply '503 Service Unavailable' '{}'
[ "$1" = locked ] || exec /system/bin/busybox-smp flock -x "$BASE/screen.lock" /system/bin/sh "$0" locked
key=$(cat "$BASE/screen-key" 2>/dev/null)
[ ${#key} -eq 64 ] || reply '503 Service Unavailable' '{}'
case "$REQUEST_METHOD" in
    GET)
        value=$(settings get system screen_brightness)
        case "$value" in ''|*[!0-9]*) reply '503 Service Unavailable' '{}';; esac
        percent=$(( (value * 100 + 127) / 255 ))
        mode=$(settings get system screen_brightness_mode)
        [ "$mode" = 0 ] && fixed=true || fixed=false
        ;;
    POST)
        [ "$CONTENT_TYPE" = application/json ] || reply '415 Unsupported Media Type' '{}'
        case "$CONTENT_LENGTH" in ''|*[!0-9]*) reply '400 Bad Request' '{}';; esac
        [ "$CONTENT_LENGTH" -le 100 ] && [ "$CONTENT_LENGTH" -ge 86 ] || reply '400 Bad Request' '{}'
        body=$(/system/bin/busybox-smp head -c "$CONTENT_LENGTH")
        # Extract only the decimal field, then compare the entire canonical body.
        percent=$(printf '%s' "$body" | /system/bin/busybox-smp sed -n 's/^{"percent":\([0-9][0-9]*\),.*$/\1/p')
        case "$percent" in ''|*[!0-9]*|0*) reply '400 Bad Request' '{}';; esac
        [ "$percent" -ge 10 ] && [ "$percent" -le 100 ] || reply '400 Bad Request' '{}'
        [ "$body" = "{\"percent\":$percent,\"key\":\"$key\"}" ] || reply '403 Forbidden' '{}'
        value=$(( (percent * 255 + 50) / 100 ))
        settings put system screen_brightness_mode 0 >/dev/null 2>&1 && settings put system screen_brightness "$value" >/dev/null 2>&1 || reply '500 Internal Server Error' '{}'
        [ "$(settings get system screen_brightness_mode)" = 0 ] && [ "$(settings get system screen_brightness)" = "$value" ] || reply '500 Internal Server Error' '{}'
        fixed=true
        umask 077
        printf '%s\n' "$percent" >"$BASE/screen-percent.next" && mv "$BASE/screen-percent.next" "$BASE/screen-percent" || reply '500 Internal Server Error' '{}'
        ;;
    *) reply '405 Method Not Allowed' '{}';;
esac
reply '200 OK' "{\"native\":true,\"percent\":$percent,\"fixed\":$fixed,\"key\":\"$key\"}"
