import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";

const SIGNAL_NAMES = [
  "window-demands-attention",
  "window-marked-urgent",
];

export default class WindowIsReadyRemover extends Extension {
  enable () {
    this._disableShellHandler();
    const onWindowAttention = this._onWindowAttention.bind(this);
    this._signalHandlers = SIGNAL_NAMES.map((signalName) =>
      global.display.connect(signalName, onWindowAttention),
    );
  }

  disable () {
    this._signalHandlers?.forEach((handlerId) =>
      global.display.disconnect(handlerId),
    );
    this._signalHandlers = null;

    this._restoreShellHandler();
  }

  _disableShellHandler () {
    const handler = Main.windowAttentionHandler;

    if (typeof handler?._onWindowDemandsAttention !== "function") {
      throw new Error("GNOME Shell window attention handler is unavailable");
    }

    this._attentionHandler = handler;
    this._shellCallback = handler._onWindowDemandsAttention.bind(handler);

    // GNOME Shell's source is js/ui/windowAttentionHandler.js: its constructor
    // connects this object to both signals, and this extension replaces those handlers.
    // Disconnect only GNOME Shell's handlers, not other listeners of the signals.
    global.display.disconnectObject(handler);
  }

  _restoreShellHandler () {
    if (!this._attentionHandler) {
      return;
    }

    // Keep these signal names and callback in sync with the Shell constructor.
    global.display.connectObject(
      "window-demands-attention",
      this._shellCallback,
      "window-marked-urgent",
      this._shellCallback,
      this._attentionHandler,
    );

    this._attentionHandler = null;
    this._shellCallback = null;
  }

  _onWindowAttention (_display, window) {
    if (!window || window.has_focus() || window.is_skip_taskbar()) {
      return;
    }

    Main.activateWindow(window, global.get_current_time());
  }
}
