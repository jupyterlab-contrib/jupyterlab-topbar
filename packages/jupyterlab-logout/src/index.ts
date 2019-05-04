import {
  JupyterFrontEnd, JupyterFrontEndPlugin, IRouter
} from '@jupyterlab/application';

import { Widget } from '@phosphor/widgets';

import { ITopBar } from "jupyterlab-topbar";

import '@jupyterlab/application/style/buttons.css';

import '../style/index.css';

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-logout',
  autoStart: true,
  requires: [IRouter, ITopBar],
  activate: async (
    app: JupyterFrontEnd,
    router: IRouter,
    topBar: ITopBar,
  ) => {
    let logout = document.createElement('a');
    logout.id = "logout";
    logout.innerHTML = "Log Out";
    logout.addEventListener('click', function () {
      router.navigate('/logout', { hard: true });
    });

    const widget = new Widget({node: logout});
    widget.addClass('jp-Button-flat');
    topBar.addItem("logout-button", widget);
  }
};

export default extension;
