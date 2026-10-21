#!/system/bin/sh
# Installed privately on the verified Android 6 frame, not served by httpd.
BASE=/data/local/hub
BB=/system/bin/busybox-smp

[ -f "$BASE/.hub-managed" ] && [ ! -e "$BASE/autostart.disabled" ] || exit 0
if [ "$1" != run ]; then
    exec "$BB" flock -n "$BASE/autostart.lock" /system/bin/sh "$BASE/autostart.sh" run
fi

echo "Hub startup: $(date)"
attempt=0
while [ "$(getprop sys.boot_completed)" != 1 ]; do
    attempt=$((attempt + 1))
    [ "$attempt" -le 90 ] || { echo 'Android boot timeout'; exit 1; }
    sleep 2
done
[ ! -e "$BASE/autostart.disabled" ] || exit 0

# Restore a saved fixed level without touching the system startup hook.
[ ! -f "$BASE/screen-restore.sh" ] || /system/bin/sh "$BASE/screen-restore.sh"

# Start one loopback-only server. Never expose personal browser data on the LAN.
if ! "$BB" wget -q -T 4 -O /dev/null http://127.0.0.1:4173/; then
    [ -f "$BASE/www/index.html" ] && [ -f "$BASE/httpd.conf" ] || exit 1
    # Do not pass flock's inherited descriptor to the long-running server.
    "$BB" nohup "$BB" httpd -f -p 127.0.0.1:4173 -h "$BASE/www" -c "$BASE/httpd.conf" >"$BASE/httpd.log" 2>&1 </dev/null 3>&- 4>&- 5>&- 6>&- 7>&- 8>&- 9>&- &
    echo $! >"$BASE/httpd.pid"
fi

# Keep the same authorized Mac and existing key-only SSH configuration.
# A missing/invalid private address leaves SSH closed; it does not block Hub.
mac_ip=$(cat "$BASE/maintenance-ip" 2>/dev/null)
if echo "$mac_ip" | "$BB" awk -F. 'NF != 4 {exit 1} {for(i=1;i<=4;i++) if($i !~ /^[0-9]+$/ || $i>255) exit 1; if(!($1==10 || ($1==192 && $2==168) || ($1==172 && $2>=16 && $2<=31))) exit 1}'; then
    iptables -N HUB_SSH 2>/dev/null
    iptables -F HUB_SSH &&
    iptables -A HUB_SSH -s 127.0.0.1/32 -j ACCEPT &&
    iptables -A HUB_SSH -s "$mac_ip/32" -j ACCEPT &&
    iptables -A HUB_SSH -j DROP &&
    (iptables -C INPUT -p tcp --dport 2222 -j HUB_SSH 2>/dev/null || iptables -I INPUT 1 -p tcp --dport 2222 -j HUB_SSH) &&
    (ip6tables -C INPUT -p tcp --dport 2222 -j DROP 2>/dev/null || ip6tables -I INPUT 1 -p tcp --dport 2222 -j DROP) && {
        am start -n org.galexander.sshd/.SimpleSSHD
        am startservice -n org.galexander.sshd/.SimpleSSHDService
    }
else
    echo 'SSH not started: invalid maintenance address'
fi

# MAIN restores Firefox's existing Hub tab, without opening another URL/tab.
sleep 2
am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n org.mozilla.firefox/org.mozilla.gecko.LauncherActivity
echo 'Hub startup complete'

# Private helpers are installed separately, never served as web assets.
if [ -f "$BASE/nightly-restart.sh" ] && [ ! -e "$BASE/nightly.disabled" ]; then
    "$BB" nohup /system/bin/sh "$BASE/nightly-restart.sh" >"$BASE/nightly.log" 2>&1 </dev/null 3>&- 4>&- 5>&- 6>&- 7>&- 8>&- 9>&- &
fi
if [ -f "$BASE/fullscreen.sh" ]; then
    "$BB" nohup /system/bin/sh "$BASE/fullscreen.sh" >"$BASE/fullscreen.log" 2>&1 </dev/null 3>&- 4>&- 5>&- 6>&- 7>&- 8>&- 9>&- &
fi
