#!/system/bin/sh
# Reapply the user's saved manual brightness before Firefox starts.
percent=$(cat /data/local/hub/screen-percent 2>/dev/null)
case "$percent" in ''|*[!0-9]*|0*) exit 0;; esac
[ "$percent" -ge 10 ] && [ "$percent" -le 100 ] || exit 0
settings put system screen_brightness_mode 0 && settings put system screen_brightness "$(( (percent * 255 + 50) / 100 ))"
