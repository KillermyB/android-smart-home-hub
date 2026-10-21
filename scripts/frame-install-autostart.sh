#!/system/bin/sh
# Run over trusted USB only, after explicit approval of the system-file change.
# Device-specific original hash: refuse another firmware or an existing edit.
set -e
BASE=/data/local/hub
BB=/system/bin/busybox-smp
TARGET=/system/bin/install-recovery.sh
EXPECTED=2b31b7e57a0b4304ce90a31e72054defd1ddd85b34075471cc67c8058b6f6fed

[ "$(id -u)" = 0 ]
[ "$(getprop ro.hardware)" = sun8i ]
[ "$(getprop ro.build.version.release)" = 6.0.1 ]
case "$(getprop ro.build.display.id)" in *20260529*) ;; *) exit 1;; esac
[ -f "$BASE/.hub-managed" ] && [ -f "$BASE/autostart.sh" ]
actual=$($BB sha256sum "$TARGET")
[ "${actual%% *}" = "$EXPECTED" ] || { echo 'Original script differs; no change made'; exit 1; }
[ ! -e "$BASE/install-recovery.original" ] || { echo 'Backup exists; inspect before reinstalling'; exit 1; }
/system/bin/sh -n "$BASE/autostart.sh"

cp "$TARGET" "$BASE/install-recovery.original"
chmod 600 "$BASE/install-recovery.original" "$BASE/maintenance-ip"
chmod 700 "$BASE/autostart.sh"
backup=$($BB sha256sum "$BASE/install-recovery.original")
[ "${backup%% *}" = "$EXPECTED" ]
cp "$TARGET" "$BASE/install-recovery.next"
cat >>"$BASE/install-recovery.next" <<'HOOK'

# Hub managed startup: optional, asynchronous, removable over USB.
if [ -x /data/local/hub/autostart.sh ] && [ ! -e /data/local/hub/autostart.disabled ]; then
    /system/bin/busybox-smp nohup /system/bin/sh /data/local/hub/autostart.sh >/data/local/hub/autostart.log 2>&1 </dev/null &
fi
HOOK
/system/bin/sh -n "$BASE/install-recovery.next"

# Original is untouched until the complete replacement is ready for atomic rename.
# Always return /system to read-only, including on a failed intermediate write.
trap 'mount -o remount,ro /system' EXIT
mount -o remount,rw /system
cp "$BASE/install-recovery.next" "$TARGET.hub-new"
chown 0:0 "$TARGET.hub-new"
chmod 750 "$TARGET.hub-new"
"$BB" cmp "$BASE/install-recovery.next" "$TARGET.hub-new"
mv "$TARGET.hub-new" "$TARGET"
mount -o remount,ro /system
trap - EXIT
echo 'Hub startup installed; a real reboot is still required for verification'
