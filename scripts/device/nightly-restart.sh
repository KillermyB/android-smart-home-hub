#!/system/bin/sh
# One reboot in the 04:30–05:29 window, postponed by active/paused Hub timers.
BASE=/data/local/hub
BB=/system/bin/busybox-smp
should_restart(){
    case "$1" in 04[3-5][0-9]|05[0-2][0-9]) ;; *) return 1;; esac
    [ "$2" != "$3" ] && [ "$4" -ge 900 ] && [ "$5" -le "$6" ]
}
if [ "$1" = decide ]; then shift; if should_restart "$@"; then echo restart; else echo wait; fi; exit 0; fi
[ "$(getprop ro.hardware)" = sun8i ] && [ "$(getprop ro.build.version.release)" = 6.0.1 ] && [ -f "$BASE/.hub-managed" ] || exit 1
[ "$1" = run ] || exec "$BB" flock -n "$BASE/nightly.lock" /system/bin/sh "$0" run
while [ ! -e "$BASE/nightly.disabled" ]; do
    # A missing image should not wait until tonight: restore only the loopback server.
    if ! "$BB" wget -q -T 3 -O /dev/null http://127.0.0.1:4173/; then
        if [ -f "$BASE/httpd.conf" ] && [ -f "$BASE/www/index.html" ]; then
            "$BB" nohup "$BB" httpd -f -p 127.0.0.1:4173 -h "$BASE/www" -c "$BASE/httpd.conf" > "$BASE/httpd.log" 2>&1 </dev/null 3>&- 4>&- 5>&- 6>&- 7>&- 8>&- 9>&- &
        fi
    fi
    day=$(date +%F); clock=$(date +%H%M); now=$(date +%s)
    last=$(cat "$BASE/nightly-last-date" 2>/dev/null)
    uptime=$(cut -d. -f1 /proc/uptime)
    until=$(cat "$BASE/activity-until" 2>/dev/null)
    case "$until" in ''|*[!0-9]*) until=0;; esac
    if should_restart "$clock" "$day" "$last" "$uptime" "$until" "$now"; then
        # Record before reboot: interrupted boots cannot loop in the same night.
        umask 077
        if printf '%s\n' "$day" > "$BASE/nightly-last-date.next" && mv "$BASE/nightly-last-date.next" "$BASE/nightly-last-date"; then sync; /system/bin/reboot; exit 0; fi
    fi
    sleep 30
done
