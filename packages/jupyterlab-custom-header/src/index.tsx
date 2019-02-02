import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import React from 'react';

import {
  ReactElementWidget
} from '@jupyterlab/apputils';

import {
  ITopBar
} from 'jupyterlab-topbar';

import '../style/index.css';

/**
 * Initialization data for the jupyterlab-custom-header extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-custom-header',
  autoStart: true,
  requires: [
    ITopBar,
  ],
  activate: (
    app: JupyterLab,
    topBar: ITopBar,
  ) => {
    // TODO: read from settings
    let text = new ReactElementWidget(<div>Custom Text Here</div>);
    topBar.addItem('custom-header', text);
  }
};

export default extension;
