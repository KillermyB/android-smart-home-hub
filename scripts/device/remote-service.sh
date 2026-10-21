#!/system/bin/sh
# Opt-in phone remote. The main application stays on loopback port 4173.
BASE=/data/local/hub
BB=/system/bin/busybox-smp
[ -f "$BASE/.hub-managed" ] && [ "$(getprop ro.hardware)" = sun8i ] || exit 1
[ "$1" = locked ] || exec "$BB" flock -n "$BASE/remote-service.lock" /system/bin/sh "$0" locked
[ -f "$BASE/remote-enabled" ] || exit 0
umask 077
mkdir -p "$BASE/remote-data" "$BASE/remote-www/cgi-bin" "$BASE/remote-www/fonts"
if [ ! -f "$BASE/remote-data/access-key" ]; then
    "$BB" od -An -N32 -tx1 /dev/urandom | "$BB" tr -d ' \n' >"$BASE/remote-data/access-key"
fi
[ "$(wc -c <"$BASE/remote-data/access-key")" -eq 64 ] || exit 1
stop_owned(){
    pid=$(cat "$BASE/remote.pid" 2>/dev/null)
    case "$pid" in ''|*[!0-9]*) return;; esac
    cmd=$("$BB" tr '\000' ' ' <"/proc/$pid/cmdline" 2>/dev/null)
    case "$cmd" in *"httpd -f -p "*" -h $BASE/remote-www "*) kill "$pid";; esac
}
network=$("$BB" ip -f inet addr show wlan0 | "$BB" awk '/inet /{print $2;exit}')
case "$network" in */24) ;; *) stop_owned; exit 1;; esac
ip=${network%/*}
printf '%s' "$ip" | "$BB" awk -F. 'NF!=4 {exit 1} {for(i=1;i<=4;i++) if($i!~/^[0-9]+$/||$i>255)exit 1; if(!($1==10||($1==192&&$2==168)||($1==172&&$2>=16&&$2<=31)))exit 1}' || exit 1
if [ -f "$BASE/remote.pid" ]; then
    pid=$(cat "$BASE/remote.pid")
    case "$pid" in ''|*[!0-9]*) exit 1;; esac
    if [ -r "/proc/$pid/cmdline" ]; then
        cmd=$("$BB" tr '\000' ' ' <"/proc/$pid/cmdline")
        case "$cmd" in *"httpd -f -p $ip:4180 -h $BASE/remote-www "*)
            old=$(cat "$BASE/remote-release" 2>/dev/null)
            [ "$old" != "$("$BB" readlink "$BASE/www")" ] || exit 0
            kill "$pid";;
            *"httpd -f -p "*" -h $BASE/remote-www "*) kill "$pid";;
            *) exit 1;;
        esac
    fi
fi
for asset in remote.html remote.css remote.js remote-core.js timer-presets.js icon.svg; do
    cp "$BASE/www/$asset" "$BASE/remote-www/$asset" || exit 1
done
cp "$BASE/www/remote.html" "$BASE/remote-www/index.html"
for weight in 400 500 600 700; do cp "$BASE/www/fonts/inter-$weight.woff2" "$BASE/remote-www/fonts/" || exit 1; done
cp "$BASE/www/cgi-bin/remote.cgi" "$BASE/remote-www/cgi-bin/remote.cgi" || exit 1
chmod 700 "$BASE/remote-www/cgi-bin/remote.cgi"
cat >"$BASE/remote.conf" <<EOF
A:${ip%.*}.0/255.255.255.0
D:*
.js:application/javascript
.css:text/css
.svg:image/svg+xml
.woff2:font/woff2
EOF
# Confine the listener to the current Wi-Fi subnet, including after boot.
iptables -N HUB_REMOTE 2>/dev/null
iptables -F HUB_REMOTE &&
iptables -A HUB_REMOTE -i wlan0 -s "${ip%.*}.0/24" -j ACCEPT &&
iptables -A HUB_REMOTE -j DROP &&
(iptables -C INPUT -p tcp --dport 4180 -j HUB_REMOTE 2>/dev/null || iptables -I INPUT 1 -p tcp --dport 4180 -j HUB_REMOTE) || exit 1
"$BB" nohup "$BB" httpd -f -p "$ip:4180" -h "$BASE/remote-www" -c "$BASE/remote.conf" >"$BASE/remote.log" 2>&1 </dev/null 3>&- 4>&- 5>&- 6>&- 7>&- 8>&- 9>&- &
echo $! >"$BASE/remote.pid"
"$BB" readlink "$BASE/www" >"$BASE/remote-release"
