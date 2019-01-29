import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ISettingRegistry
} from '@jupyterlab/coreutils';

import {
  IMainMenu,
} from '@jupyterlab/mainmenu';

import { ITopBar, TopBar } from 'jupyterlab-topbar';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab-topbar extension.
 */
const extension: JupyterLabPlugin<ITopBar> = {
  id: 'jupyterlab-topbar:plugin',
  autoStart: true,
  requires: [
    // required to place the item to the right of the existing one
    IMainMenu,
  ],
  provides: ITopBar,
  activate: (
    app: JupyterLab,
    menu: IMainMenu,
    settingsRegistry: ISettingRegistry,
  ): ITopBar => {

    let topBar = new TopBar();
    topBar.id = 'jp-TopBar';
    topBar.addClass('jp-TopBar');

    app.shell.addToTopArea(topBar);

    console.log(extension.id, 'activated');

    return topBar;
  }
};

export default extension;
