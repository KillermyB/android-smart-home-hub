#!/system/bin/sh
# A real touch on Hub's accessibility-labelled button, never blind coordinates.
BASE=/data/local/hub
BB=/system/bin/busybox-smp
[ "$(getprop ro.hardware)" = sun8i ] && [ "$(getprop ro.build.version.release)" = 6.0.1 ] || exit 1
attempt=0
while [ "$attempt" -lt 6 ]; do
    attempt=$((attempt+1))
    sleep 4
    uiautomator dump "$BASE/fullscreen-ui.xml" >/dev/null 2>&1
    box=$("$BB" sed 's/></>\n</g' "$BASE/fullscreen-ui.xml" 2>/dev/null | "$BB" grep 'resource-id="native-fullscreen"' | "$BB" grep -E '(text|content-desc)="Activer le plein écran"' | "$BB" sed -n 's/.*bounds="\[\([0-9]*\),\([0-9]*\)\]\[\([0-9]*\),\([0-9]*\)\]".*/\1 \2 \3 \4/p' | "$BB" head -n 1)
    rm -f "$BASE/fullscreen-ui.xml"
    if [ -n "$box" ]; then
        set -- $box
        [ "$#" -eq 4 ] && [ "$3" -gt "$1" ] && [ "$4" -gt "$2" ] || exit 1
        input tap "$(( ($1+$3)/2 ))" "$(( ($2+$4)/2 ))"
        exit 0
    fi
done
exit 1
