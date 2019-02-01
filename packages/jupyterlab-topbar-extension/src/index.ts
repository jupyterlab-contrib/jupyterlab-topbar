import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  IMainMenu,
} from '@jupyterlab/mainmenu';

import { ITopBar, TopBar } from 'jupyterlab-topbar';

import '../style/index.css';

/**
 * Initialization data for the jupyterlab-topbar extension.
 */
const extension: JupyterLabPlugin<ITopBar> = {
  id: 'jupyterlab-topbar-extension:plugin',
  autoStart: true,
  requires: [
    // required to place the item to the right of the existing one
    IMainMenu,
  ],
  provides: ITopBar,
  activate: (
    app: JupyterLab,
    menu: IMainMenu,
  ): ITopBar => {

    let topBar = new TopBar();
    topBar.id = 'jp-TopBar';
    topBar.addClass('jp-TopBar');
    topBar.addItem('spacer', TopBar.createSpacerItem());

    app.shell.addToTopArea(topBar);

    return topBar;
  }
};

export default extension;
