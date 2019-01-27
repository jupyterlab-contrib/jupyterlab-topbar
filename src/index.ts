import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ISettingRegistry
} from '@jupyterlab/coreutils';

import {
  IMainMenu,
} from '@jupyterlab/mainmenu';

import {
  Toolbar,
} from '@jupyterlab/apputils';

import {
  TextView
} from './textView';

import {
  MemoryUsage
} from './memoryUsage';

import '../style/index.css';
import { Widget } from '@phosphor/widgets';
import { JSONObject } from '@phosphor/coreutils';


/**
 * Initialization data for the jupyterlab-topbar extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab-topbar:plugin',
  autoStart: true,
  requires: [
    // required to place the item to the right of the existing one
    IMainMenu,
    ISettingRegistry,
  ],
  activate: async (
    app: JupyterLab,
    menu: IMainMenu,
    settingsRegistry: ISettingRegistry,
  ) => {
    console.log(extension.id);
    const settings = await settingsRegistry.load(extension.id);

    let toolBar = new Toolbar<Widget>();
    toolBar.id = "topbar";
    toolBar.addClass('jp-TopBar');

    const textSettings = settings.get('text').composite as JSONObject;
    const memorySettings = settings.get('memoryUsage').composite as JSONObject;

    if (textSettings.enabled) {
      let value = textSettings.value as string;
      let textView = new TextView(value);
      toolBar.addItem("text", textView);
    }
    if (memorySettings.enabled) {
      let memoryUsage = new MemoryUsage();
      toolBar.addItem("memoryUsage", memoryUsage);
    }
    app.shell.addToTopArea(toolBar);
  }
};

export default extension;
