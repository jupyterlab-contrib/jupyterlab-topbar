import { Switch } from '@jupyter/react-components';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { IThemeManager, IToolbarWidgetRegistry } from '@jupyterlab/apputils';

import { ReactWidget } from '@jupyterlab/ui-components';

import * as React from 'react';

import '../style/index.css';

const themeTogglerPluginId = 'jupyterlab-theme-toggler:plugin';

const extension: JupyterFrontEndPlugin<void> = {
  id: themeTogglerPluginId,
  autoStart: true,
  requires: [IThemeManager],
  optional: [IToolbarWidgetRegistry],
  activate: async (
    app: JupyterFrontEnd,
    themeManager: IThemeManager,
    toolbarRegistry: IToolbarWidgetRegistry
  ): Promise<void> => {
    console.log('jupyterlab-theme-toggler extension is activated!');

    // Get app commands
    const { commands } = app;

    const themes = [
      'JupyterLab Light', // Light Theme goes first
      'JupyterLab Dark',
    ];

    const onChange = async () => {
      const isLight = themeManager.isLight(themeManager.theme);
      await commands.execute('apputils:change-theme', {
        theme: themes[~~isLight],
      });
    };

    if (toolbarRegistry) {
      toolbarRegistry.addFactory('TopBar', 'theme-toggler', () => {
        const widget = ReactWidget.create(
          <Switch onChange={onChange} checked={true}>
            Theme
            <span slot="checked-message">Light</span>
            <span slot="unchecked-message">Dark</span>
          </Switch>
        );
        return widget;
      });
    }
  },
};

export default extension;
