import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/coreutils';

import React from 'react';

import {
  ReactElementWidget
} from '@jupyterlab/apputils';

import {
  ITopBar
} from 'jupyterlab-topbar';

import '../style/index.css';

/**
 * Initialization data for the jupyterlab-topbar-text extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-topbar-text:plugin',
  autoStart: true,
  requires: [
    ISettingRegistry,
    ITopBar,
  ],
  activate: async (
    app: JupyterLab,
    settingsRegistry: ISettingRegistry,
    topBar: ITopBar,
  ) => {
    const settings = await settingsRegistry.load(extension.id);
    let text = settings.get('text').composite as string;
    let textWidget = new ReactElementWidget(<div>{text}</div>);
    topBar.addItem('custom-header', textWidget);
  }
};

export default extension;
