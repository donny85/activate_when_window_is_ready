# Activate When Window Is Ready

A GNOME Shell extension that replaces the **“Window is ready”** notification with automatic window activation. When an application requests attention, the extension brings its window to the foreground instead of showing the notification.

## Compatibility

The extension currently targets **GNOME Shell 50**.

It works by disconnecting GNOME Shell's `WindowAttentionHandler` from the `window-demands-attention` and `window-marked-urgent` signals, then handling those signals itself. This uses an internal Shell object rather than a stable public extension API, so a GNOME Shell update may change the handler or its signal connections and require an extension update.

Automatic activation also intentionally bypasses GNOME Shell's usual protection against applications taking focus unexpectedly.

## Installation

Clone or download this repository, then copy the extension directory into your local GNOME Shell extensions directory:

```sh
mkdir -p ~/.local/share/gnome-shell/extensions
cp -r activate_when_window_is_ready@extensions@donny.cz \
  ~/.local/share/gnome-shell/extensions/
```

Enable it with GNOME Extensions or run:

```sh
gnome-extensions enable activate_when_window_is_ready@extensions@donny.cz
```

If the extension does not appear, log out and back in, then try enabling it again.

## Uninstallation

Disable the extension and remove its directory:

```sh
gnome-extensions disable activate_when_window_is_ready@extensions@donny.cz
rm -r ~/.local/share/gnome-shell/extensions/activate_when_window_is_ready@extensions@donny.cz
```
