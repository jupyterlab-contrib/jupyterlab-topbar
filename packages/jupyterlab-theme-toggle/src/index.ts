import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { IThemeManager } from "@jupyterlab/apputils";

import { Widget } from "@phosphor/widgets";

import { ITopBar } from "jupyterlab-topbar";

import "../style/index.css";

/**
 * Initialization data for the jupyterlab-theme-toggle extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab-theme-toggle",
  autoStart: true,
  requires: [IThemeManager, ITopBar],
  activate: (
    app: JupyterFrontEnd,
    themeManager: IThemeManager,
    topBar: ITopBar
  ) => {
    // TODO: make this configurable via the settings
    let themes = [
      "JupyterLab Light", // Light Theme goes first
      "JupyterLab Dark"
    ];
    // TODO: replace by Toggle Button
    let button = document.createElement("button");
    button.onclick = async () => {
      const isLight = themeManager.isLight(themeManager.theme);
      await app.commands.execute("apputils:change-theme", {
        theme: themes[~~isLight]
      });
    };

    const updateText = () => {
      const isLight = themeManager.isLight(themeManager.theme);
      const theme = isLight ? themes[1] : themes[0];
      button.textContent = `Switch to ${theme}`;
    }

    themeManager.themeChanged.connect(updateText);
    updateText();

    let textWidget = new Widget({ node: button });
    topBar.addItem("theme-toggle", textWidget);
  }
};

export default extension;
