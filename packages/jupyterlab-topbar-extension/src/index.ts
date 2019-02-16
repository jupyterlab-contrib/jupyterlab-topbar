import { JupyterLab, JupyterLabPlugin } from "@jupyterlab/application";

import { IMainMenu } from "@jupyterlab/mainmenu";

import { ICommandPalette } from "@jupyterlab/apputils";

import { ISettingRegistry } from "@jupyterlab/coreutils";

import { ITopBar, TopBar } from "jupyterlab-topbar";

import "../style/index.css";

namespace CommandIDs {
  /**
   * Toggle Top Bar visibility
   */
  export const toggle = `jupyterlab-topbar-extension:toggle`;
}

/**
 * Initialization data for the jupyterlab-topbar extension.
 */
const extension: JupyterLabPlugin<ITopBar> = {
  id: "jupyterlab-topbar-extension:plugin",
  autoStart: true,
  optional: [IMainMenu, ICommandPalette, ISettingRegistry],
  provides: ITopBar,
  activate: (
    app: JupyterLab,
    menu: IMainMenu,
    palette: ICommandPalette,
    settingRegistry: ISettingRegistry
  ): ITopBar => {
    let topBar = new TopBar();
    topBar.id = "jp-TopBar";
    topBar.addClass("jp-TopBar");
    topBar.addItem("spacer", TopBar.createSpacerItem());

    app.commands.addCommand(CommandIDs.toggle, {
      label: "Show Top Bar",
      execute: (args: any) => {
        topBar.setHidden(topBar.isVisible);
        if (settingRegistry) {
          settingRegistry.set(extension.id, "visible", topBar.isVisible);
        }
      },
      isToggled: () => topBar.isVisible
    });

    if (menu) {
      menu.viewMenu.addGroup([{ command: CommandIDs.toggle }], 2);
    }

    const category = "Top Bar";
    if (palette) {
      palette.addItem({ command: CommandIDs.toggle, category });
    }

    if (settingRegistry) {
      const updateSettings = (settings: ISettingRegistry.ISettings): void => {
        const visible = settings.get("visible").composite as boolean;
        topBar.setHidden(!visible);
      };

      Promise.all([settingRegistry.load(extension.id), app.restored])
        .then(([settings]) => {
          updateSettings(settings);
          settings.changed.connect(settings => {
            updateSettings(settings);
          });
        })
        .catch((reason: Error) => {
          console.error(reason.message);
        });
    }

    app.shell.addToTopArea(topBar);

    return topBar;
  }
};

export default extension;
