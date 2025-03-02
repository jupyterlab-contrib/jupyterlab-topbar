import { Switch, SwitchProps } from '@jupyter/react-components';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { IThemeManager, IToolbarWidgetRegistry } from '@jupyterlab/apputils';

import { ReactWidget } from '@jupyterlab/ui-components';

import { useState, useEffect } from 'react';

import * as React from 'react';

import '../style/index.css';

const themeTogglerPluginId = 'jupyterlab-theme-toggler:plugin';

interface IThemeSwitchProps extends SwitchProps {
  themeManager: IThemeManager;
}

const ThemeSwitch = (props: IThemeSwitchProps) => {
  const { themeManager, ...others } = props;

  const [dark, setDark] = useState(false);

  const updateChecked = () => {
    const isDark = !themeManager.isLight(themeManager.theme);
    setDark(!!isDark);
  };

  useEffect(() => {
    let timeout = 0;
    if (!themeManager.theme) {
      // TODO: investigate why the themeManager is undefined
      timeout = setTimeout(() => {
        updateChecked();
      }, 500);
    } else {
      updateChecked();
    }
    themeManager.themeChanged.connect(updateChecked);
    return () => {
      clearTimeout(timeout);
      themeManager.themeChanged.disconnect(updateChecked);
    };
  });

  return <Switch {...others} aria-checked={dark} />;
};

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
          <ThemeSwitch themeManager={themeManager} onChange={onChange}>
            <span slot="unchecked-message">Light</span>
            <span slot="checked-message">Dark</span>
          </ThemeSwitch>
        );
        return widget;
      });
    }
  },
};

export default extension;
